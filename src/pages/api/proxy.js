export default async function handler(req, res) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).send("Missing or invalid URL parameter");
    }

    try {
        // Fetch target
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            redirect: 'follow'
        });

        // Capture data
        const finalUrl = response.url;
        const contentType = response.headers.get("content-type");
        const bodyText = await response.text();

        // 1. CORS & Security Headers (Strict Permissive)
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Content-Type", contentType || "text/html");
        res.removeHeader("X-Frame-Options");
        res.removeHeader("Content-Security-Policy");
        res.setHeader("X-Frame-Options", "ALLOWALL");
        res.setHeader("Content-Security-Policy", "frame-ancestors *;");

        // 2. HTML Injection (The "Deep Proxy" Logic)
        // Skip injection if ?raw=true is passed
        if (contentType && contentType.includes("text/html") && req.query.raw !== 'true') {
            // We inject a script that monkey-patches the browser environment
            // to force all navigation and API calls back through this proxy.
            const proxyScript = `
            <script>
            (function() {
                const PROXY_BASE = '/api/proxy?url=';
                const ORIGIN_URL = '${finalUrl}';
                
                // Helper: Resolve relative URLs to absolute, then proxy them
                function toProxy(target) {
                    try {
                        if (!target) return '';
                        if (target.startsWith('data:')) return target;
                        if (target.startsWith('#')) return target;
                        
                        // Resolve against the original site
                        const absolute = new URL(target, ORIGIN_URL).href;
                        return PROXY_BASE + encodeURIComponent(absolute);
                    } catch (e) { return target; }
                }

                console.log("[Proxy Shim] Active for:", ORIGIN_URL);

                // --- 0. Override Window.Open (Prevent Escape) ---
                const originalOpen = window.open;
                window.open = function(url, target, features) {
                    // Force all new windows to open inside the current proxy tunnel if possible
                    // or just redirect the current window if it's a "blank" target attempt
                    console.log("[Proxy] Trapped window.open:", url);
                    if (url) {
                        window.location.href = toProxy(url);
                    }
                    return null; // Block actual popup
                };

                // --- 1. Intercept Links (Navigation) ---
                document.addEventListener('click', function(e) {
                    const link = e.target.closest('a');
                    if (link && link.href) {
                        // Force self target to stay in iframe/proxy
                        link.target = "_self";
                        
                        const href = link.getAttribute('href'); 
                        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
                        
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = toProxy(href);
                    }
                }, true);

                // --- 2. Intercept Forms ---
                document.addEventListener('submit', function(e) {
                    const form = e.target;
                    const action = form.getAttribute('action');
                    if (action) {
                        e.preventDefault();
                        // Naive form handling: just GET navigation for now
                        // (Real POST support requires generic proxy body handling)
                        window.location.href = toProxy(action);
                    }
                }, true);

                const originalFetch = window.fetch;
                window.fetch = function(input, init) {
                    try {
                        let url = input;
                        if (typeof input === 'string') {
                            // Don't proxy data/blob/local schemes
                            if (input.startsWith('data:') || input.startsWith('blob:')) return originalFetch(input, init);
                            url = toProxy(input);
                        } else if (input instanceof Request) {
                            if (input.url.startsWith('data:') || input.url.startsWith('blob:')) return originalFetch(input, init);
                            // We must create a new Request object because Request.url is read-only
                            // and cloning requests with bodies in a shim is risky.
                            // Safer to just proxy the URL string if possible, or fallback.
                            // Next.js uses string inputs mostly.
                            try {
                                url = toProxy(input.url);
                            } catch(e) { 
                                return originalFetch(input, init); 
                            }
                        }
                        return originalFetch(url, init);
                    } catch (e) {
                        console.warn("[Proxy] Fetch Patch Error:", e);
                        return originalFetch(input, init);
                    }
                };

                // --- 4. Monkey-Patch XMLHttpRequest (Legacy/Library API Calls) ---
                const originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url, ...args) {
                    try {
                        if (typeof url === 'string' && !url.startsWith('data:') && !url.startsWith('blob:')) {
                            return originalOpen.call(this, method, toProxy(url), ...args);
                        }
                    } catch (e) {
                         console.warn("[Proxy] XHR Patch Error:", e);
                    }
                    return originalOpen.call(this, method, url, ...args);
                };

                // --- 5. History API Patch (Next.js Router) ---
                // Prevents client-side routers from changing URL bar to un-proxied state
                // and breaking subsequent reloads.
                const originalPush = history.pushState;
                history.pushState = function(state, title, url) {
                    // Start strict: don't let them change visible URL easily, 
                    // or maybe just log it. Changing iframe URL usually fine.
                    // But if they push '/about', we want effective state to remain inside proxy.
                    // For now, no-op or minimal handling is safer than breaking it.
                    return originalPush.apply(this, arguments); 
                };

            })();
            </script>
            <base href="${finalUrl}" />
            `;

            // Inject at head or prepend to body
            let modifiedBody = bodyText;
            if (bodyText.includes("<head>")) {
                modifiedBody = bodyText.replace("<head>", `<head>${proxyScript}`);
            } else {
                modifiedBody = `${proxyScript}${bodyText}`;
            }

            return res.send(modifiedBody);
        }

        // Non-HTML: Send as-is
        return res.send(bodyText);

    } catch (e) {
        console.error("Proxy Error:", e);
        return res.status(500).send("Proxy Error: " + e.message);
    }
}

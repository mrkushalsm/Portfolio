const GITHUB_USERNAME = "mrkushalsm";
const BASE_URL = "https://api.github.com";
const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache
const cache = {};

const cachedFetch = async (key, fetchFn) => {
    const now = Date.now();
    if (cache[key] && now - cache[key].timestamp < CACHE_TTL) {
        return cache[key].data;
    }
    const data = await fetchFn();
    cache[key] = { data, timestamp: now };
    return data;
};

const githubFetch = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
};

// Fetch user profile
export const fetchUserProfile = () =>
    cachedFetch("profile", () => githubFetch(`/users/${GITHUB_USERNAME}`));

// Fetch all public repos (paginated, up to 100)
export const fetchRepos = () =>
    cachedFetch("repos", () =>
        githubFetch(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`)
    );

// Fetch public events (paginated)
export const fetchEvents = (page = 1) =>
    cachedFetch(`events_p${page}`, () =>
        githubFetch(`/users/${GITHUB_USERNAME}/events/public?per_page=30&page=${page}`)
    );

// Fetch contribution data for a specific year
const fetchContributionsForYear = async (year) => {
    const res = await fetch(`${CONTRIBUTIONS_API}/${GITHUB_USERNAME}?y=${year}`);
    if (!res.ok) throw new Error(`Contributions API error: ${res.status}`);
    return res.json();
};

// Fetch contributions for the rolling "last year" window
export const fetchContributions = () =>
    cachedFetch("contributions_last", () => fetchContributionsForYear("last"));

// Fetch contributions for a specific calendar year
export const fetchContributionsByYear = (year) =>
    cachedFetch(`contributions_${year}`, () => fetchContributionsForYear(year));

// Fetch all-time contribution totals (from account creation year to now)
export const fetchAllTimeContributions = async (createdAt) => {
    const startYear = new Date(createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = startYear; y <= currentYear; y++) years.push(y);

    const results = await Promise.all(
        years.map((y) =>
            fetchContributionsByYear(y).catch(() => ({ total: { [y]: 0 }, contributions: [] }))
        )
    );

    let allTimeTotal = 0;
    const yearlyBreakdown = {};
    years.forEach((y, i) => {
        const yearTotal = results[i]?.total?.[y] ?? 0;
        yearlyBreakdown[y] = yearTotal;
        allTimeTotal += yearTotal;
    });

    return { allTimeTotal, yearlyBreakdown, yearData: Object.fromEntries(years.map((y, i) => [y, results[i]])) };
};

// GitHub language colors (standard mapping)
export const LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    PHP: "#4F5D95",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Dart: "#00B4AB",
    Lua: "#000080",
    Vim: "#019833",
    Makefile: "#427819",
    Dockerfile: "#384d54",
    SCSS: "#c6538c",
    Vue: "#41b883",
    Svelte: "#ff3e00",
};

export const GITHUB_USERNAME_EXPORT = GITHUB_USERNAME;

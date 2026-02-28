import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    fetchUserProfile,
    fetchRepos,
    fetchEvents,
    fetchContributions,
    fetchContributionsByYear,
    fetchAllTimeContributions,
    LANGUAGE_COLORS,
    GITHUB_USERNAME_EXPORT,
} from "../../data/githubApi";

// ─── Event Icon Map ───
const EVENT_ICONS = {
    PushEvent: "📝",
    PullRequestEvent: "🔀",
    IssuesEvent: "🐛",
    WatchEvent: "⭐",
    ForkEvent: "🍴",
    CreateEvent: "🆕",
    DeleteEvent: "🗑️",
    IssueCommentEvent: "💬",
    PullRequestReviewEvent: "👀",
    PullRequestReviewCommentEvent: "💬",
    ReleaseEvent: "🚀",
    PublicEvent: "🌐",
};

const EVENT_LABELS = {
    PushEvent: "Push",
    PullRequestEvent: "Pull Request",
    IssuesEvent: "Issue",
    WatchEvent: "Starred",
    ForkEvent: "Forked",
    CreateEvent: "Created",
    DeleteEvent: "Deleted",
    IssueCommentEvent: "Comment",
    PullRequestReviewEvent: "Review",
    PullRequestReviewCommentEvent: "Review Comment",
    ReleaseEvent: "Release",
    PublicEvent: "Made Public",
};

// ─── Utility: Relative time ───
const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
};

// ─── Loading Skeleton ───
const Skeleton = ({ width = "100%", height = "1rem" }) => (
    <div
        className="rounded animate-pulse bg-white/5"
        style={{ width, height }}
    />
);

// Inject spin keyframe (guaranteed to exist for the refresh icon)
const SpinKeyframe = () => (
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
);

// ═══════════════════════════════════════════
// CONTRIBUTION HEATMAP (native CSS grid)
// ═══════════════════════════════════════════
const LEVEL_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

const ContributionHeatmap = ({ contributions }) => {
    if (!contributions || contributions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[100px] text-gray-500 text-xs">
                Unable to load contribution graph
            </div>
        );
    }

    // Group contributions into weeks (columns)
    const weeks = [];
    let currentWeek = [];
    contributions.forEach((day, i) => {
        const dayOfWeek = new Date(day.date).getDay(); // 0=Sun
        if (i === 0 && dayOfWeek !== 0) {
            for (let j = 0; j < dayOfWeek; j++) currentWeek.push(null);
        }
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="p-3 bg-[#0d1117]" style={{ overflow: "visible" }}>
            <div className="flex gap-[2px]">
                {/* Day labels column */}
                <div className="flex flex-col gap-[2px] mr-1 shrink-0">
                    {dayLabels.map((d, i) => (
                        <div key={i} className="h-[11px] w-6 text-[8px] text-gray-500 flex items-center">
                            {i % 2 === 1 ? d : ""}
                        </div>
                    ))}
                </div>
                {/* Weeks */}
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                        {week.map((day, di) => {
                            const showBelow = di < 2;
                            const nearRight = wi > weeks.length - 8;
                            const nearLeft = wi < 5;
                            const hAlign = nearRight
                                ? "right-0"
                                : nearLeft
                                ? "left-0"
                                : "left-1/2 -translate-x-1/2";
                            return (
                                <div
                                    key={di}
                                    className="w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-150 hover:z-10 relative group"
                                    style={{ backgroundColor: day ? LEVEL_COLORS[day.level] || LEVEL_COLORS[0] : "transparent" }}
                                >
                                    {day && day.count > 0 && (
                                        <div className={`absolute hidden group-hover:block z-50 pointer-events-none ${hAlign} ${showBelow ? "top-full mt-1" : "bottom-full mb-1"}`}>
                                            <div className="bg-[#2d2d2d] text-gray-200 text-[9px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap border border-[#444]">
                                                {day.count} contribution{day.count !== 1 ? "s" : ""} on {day.date}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-1 mt-2 justify-end">
                <span className="text-[9px] text-gray-500 mr-1">Less</span>
                {LEVEL_COLORS.map((color, i) => (
                    <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
                ))}
                <span className="text-[9px] text-gray-500 ml-1">More</span>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════
// PERFORMANCE TAB
// ═══════════════════════════════════════════
const PerformanceTab = ({ profile, repos, contributions, allTimeData, loading }) => {
    const [heatmapView, setHeatmapView] = useState("last"); // "last", "2023", "2024", etc.
    const [yearContrib, setYearContrib] = useState(null);
    const [yearLoading, setYearLoading] = useState(false);

    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const allTimeTotal = allTimeData?.allTimeTotal ?? "—";
    const lastYearTotal = contributions?.total?.lastYear ?? "—";

    // Most used language
    const langCount = {};
    repos.forEach((r) => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const topLang =
        Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const latestPush = repos[0] ? timeAgo(repos[0].pushed_at) : "—";

    // Build year options from profile creation
    const startYear = profile ? new Date(profile.created_at).getFullYear() : 2023;
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let y = currentYear; y >= startYear; y--) yearOptions.push(y);

    // Load year-specific heatmap when view changes
    useEffect(() => {
        if (heatmapView === "last") {
            setYearContrib(null);
            return;
        }
        setYearLoading(true);
        fetchContributionsByYear(parseInt(heatmapView))
            .then((data) => setYearContrib(data))
            .catch(() => setYearContrib(null))
            .finally(() => setYearLoading(false));
    }, [heatmapView]);

    const activeContrib = heatmapView === "last" ? contributions?.contributions : yearContrib?.contributions;
    const activeTotal = heatmapView === "last"
        ? lastYearTotal
        : (yearContrib?.total?.[parseInt(heatmapView)] ?? "—");

    return (
        <div className="flex flex-col gap-4 p-3 h-full overflow-auto">
            {/* ── Contribution Heatmap ── */}
            <div className="border border-[#333] rounded-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#333] bg-[#1a1a1a]">
                    <div className="w-2 h-2 rounded-full bg-[#39d353]" />
                    <span className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
                        Contribution History
                    </span>

                    {/* Year selector */}
                    <div className="ml-auto flex items-center gap-1">
                        <select
                            value={heatmapView}
                            onChange={(e) => setHeatmapView(e.target.value)}
                            className="bg-[#2a2a2a] text-gray-300 text-[10px] px-1.5 py-0.5 rounded border border-[#444] outline-none cursor-pointer hover:border-[#0078d7]"
                        >
                            <option value="last">Last 12 Months</option>
                            {yearOptions.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <span className="text-[10px] text-[#39d353] ml-1">
                            {yearLoading ? "…" : activeTotal !== "—" ? `${activeTotal} contributions` : ""}
                        </span>
                    </div>
                </div>
                {yearLoading ? (
                    <div className="p-3 bg-[#0d1117] flex items-center justify-center min-h-[100px]">
                        <span className="text-gray-500 text-xs animate-pulse">Loading {heatmapView} data…</span>
                    </div>
                ) : (
                    <ContributionHeatmap contributions={activeContrib} />
                )}
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                    {
                        label: "All-Time Contributions",
                        value: loading ? "…" : allTimeTotal,
                        icon: "📊",
                    },
                    {
                        label: "Public Repos",
                        value: loading ? "…" : profile?.public_repos ?? repos.length,
                        icon: "📦",
                    },
                    { label: "Total Stars", value: loading ? "…" : totalStars, icon: "⭐" },
                    { label: "Top Language", value: loading ? "…" : topLang, icon: "💻" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="border border-[#333] rounded-sm bg-[#1a1a1a] p-3 flex flex-col"
                    >
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {stat.label}
                        </span>
                        <span className="text-lg font-semibold text-[#76b9ed] mt-1 flex items-center gap-1.5">
                            <span>{stat.icon}</span> {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Yearly Breakdown ── */}
            {allTimeData?.yearlyBreakdown && (
                <div className="border border-[#333] rounded-sm bg-[#1a1a1a]">
                    <div className="px-3 py-1.5 border-b border-[#333] text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Contributions by Year
                    </div>
                    <div className="flex gap-0">
                        {Object.entries(allTimeData.yearlyBreakdown).reverse().map(([year, count]) => {
                            const maxCount = Math.max(...Object.values(allTimeData.yearlyBreakdown), 1);
                            const pct = (count / maxCount) * 100;
                            return (
                                <div key={year} className="flex-1 px-2 py-2 flex flex-col items-center gap-1 border-r border-[#333] last:border-r-0">
                                    <div className="w-full bg-[#161b22] rounded-sm h-[40px] flex items-end overflow-hidden">
                                        <div
                                            className="w-full rounded-t-sm transition-all"
                                            style={{ height: `${Math.max(pct, 5)}%`, backgroundColor: "#39d353" }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold text-[#39d353]">{count}</span>
                                    <span className="text-[9px] text-gray-500">{year}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Extra Metrics ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="border border-[#333] rounded-sm bg-[#1a1a1a] p-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total Forks</span>
                    <div className="text-sm text-gray-300 mt-1">{loading ? "…" : totalForks}</div>
                </div>
                <div className="border border-[#333] rounded-sm bg-[#1a1a1a] p-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Latest Push</span>
                    <div className="text-sm text-gray-300 mt-1">{loading ? "…" : latestPush}</div>
                </div>
                <div className="border border-[#333] rounded-sm bg-[#1a1a1a] p-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</span>
                    <div className="text-sm text-gray-300 mt-1">{loading ? "…" : profile?.followers ?? "—"}</div>
                </div>
                <div className="border border-[#333] rounded-sm bg-[#1a1a1a] p-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Following</span>
                    <div className="text-sm text-gray-300 mt-1">{loading ? "…" : profile?.following ?? "—"}</div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════
// PROCESSES TAB (Repo List)
// ═══════════════════════════════════════════
const ProcessesTab = ({ repos, loading }) => {
    const [sortKey, setSortKey] = useState("pushed_at");
    const [sortDir, setSortDir] = useState("desc");
    const [selectedRow, setSelectedRow] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const menuRef = useRef(null);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const sorted = [...repos].sort((a, b) => {
        let va = a[sortKey];
        let vb = b[sortKey];
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        if (va == null) va = "";
        if (vb == null) vb = "";
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const getStatus = (repo) => {
        if (repo.archived) return { text: "Archived", color: "#e74c3c" };
        if (repo.fork) return { text: "Fork", color: "#f39c12" };
        return { text: "Active", color: "#2ecc71" };
    };

    const SortArrow = ({ col }) => {
        if (sortKey !== col) return null;
        return (
            <span className="ml-1 text-[10px]">{sortDir === "asc" ? "▲" : "▼"}</span>
        );
    };

    const containerRef = useRef(null);

    const handleRowClick = (e, repo) => {
        e.stopPropagation();
        setSelectedRow(repo.id);
        // Calculate position relative to the container (avoids transform-breaking-fixed issues)
        const rect = containerRef.current?.getBoundingClientRect();
        setContextMenu({
            x: e.clientX - (rect?.left || 0),
            y: e.clientY - (rect?.top || 0),
            repo,
        });
    };

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu(null);
            }
        };
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, []);

    const columns = [
        { key: "name", label: "Name", flex: "2.5" },
        { key: "language", label: "Language", flex: "1.2" },
        { key: "stargazers_count", label: "★ Stars", flex: "0.8" },
        { key: "forks_count", label: "🍴 Forks", flex: "0.8" },
        { key: "pushed_at", label: "Last Push", flex: "1.2" },
        { key: "status", label: "Status", flex: "0.9" },
    ];

    if (loading) {
        return (
            <div className="p-3 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} height="28px" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative" ref={containerRef}>
            {/* ── Header ── */}
            <div className="flex items-center border-b border-[#404040] bg-[#1e1e1e] text-[10px] text-gray-400 uppercase tracking-wider select-none shrink-0">
                {columns.map((col) => (
                    <div
                        key={col.key}
                        className="px-2.5 py-2 cursor-pointer hover:bg-white/5 transition-colors flex items-center"
                        style={{ flex: col.flex }}
                        onClick={() =>
                            col.key === "status"
                                ? handleSort("archived")
                                : handleSort(col.key)
                        }
                    >
                        {col.label}
                        <SortArrow col={col.key === "status" ? "archived" : col.key} />
                    </div>
                ))}
            </div>

            {/* ── Rows ── */}
            <div className="flex-1 overflow-auto">
                {sorted.map((repo, i) => {
                    const status = getStatus(repo);
                    const isSelected = selectedRow === repo.id;
                    return (
                        <div
                            key={repo.id}
                            className={`flex items-center text-xs border-b border-[#2a2a2a] cursor-pointer transition-colors
                                ${isSelected ? "bg-[#0078d7]/30" : i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}
                                hover:bg-[#0078d7]/20`}
                            onClick={(e) => handleRowClick(e, repo)}
                        >
                            <div
                                className="px-2.5 py-2 truncate text-gray-200 font-medium"
                                style={{ flex: "2.5" }}
                                title={repo.full_name}
                            >
                                {repo.name}
                            </div>
                            <div
                                className="px-2.5 py-2 flex items-center gap-1.5"
                                style={{ flex: "1.2" }}
                            >
                                {repo.language && (
                                    <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                LANGUAGE_COLORS[repo.language] || "#888",
                                        }}
                                    />
                                )}
                                <span className="text-gray-400 truncate">
                                    {repo.language || "—"}
                                </span>
                            </div>
                            <div
                                className="px-2.5 py-2 text-gray-400"
                                style={{ flex: "0.8" }}
                            >
                                {repo.stargazers_count}
                            </div>
                            <div
                                className="px-2.5 py-2 text-gray-400"
                                style={{ flex: "0.8" }}
                            >
                                {repo.forks_count}
                            </div>
                            <div
                                className="px-2.5 py-2 text-gray-500"
                                style={{ flex: "1.2" }}
                            >
                                {timeAgo(repo.pushed_at)}
                            </div>
                            <div className="px-2.5 py-2" style={{ flex: "0.9" }}>
                                <span
                                    className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                                    style={{
                                        backgroundColor: `${status.color}20`,
                                        color: status.color,
                                    }}
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: status.color }}
                                    />
                                    {status.text}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Context Menu ── */}
            {contextMenu && (
                <div
                    ref={menuRef}
                    className="absolute z-[99999] bg-[#2d2d2d] border border-[#555] rounded shadow-xl py-1 text-xs text-gray-200 min-w-[160px]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button
                        className="w-full text-left px-3 py-1.5 hover:bg-[#0078d7] transition-colors"
                        onClick={() => {
                            window.open(contextMenu.repo.html_url, "_blank");
                            setContextMenu(null);
                        }}
                    >
                        🔗 Open on GitHub
                    </button>
                    <button
                        className="w-full text-left px-3 py-1.5 hover:bg-[#0078d7] transition-colors"
                        onClick={() => {
                            window.open(
                                `${contextMenu.repo.html_url}/blob/${contextMenu.repo.default_branch}/README.md`,
                                "_blank"
                            );
                            setContextMenu(null);
                        }}
                    >
                        📄 View README
                    </button>
                    <div className="border-t border-[#444] my-1" />
                    <button
                        className="w-full text-left px-3 py-1.5 hover:bg-[#0078d7] transition-colors"
                        onClick={() => {
                            navigator.clipboard.writeText(contextMenu.repo.clone_url);
                            setContextMenu(null);
                        }}
                    >
                        📋 Copy Clone URL
                    </button>
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════
// ACTIVITY TAB (Event Log) — with pagination
// ═══════════════════════════════════════════
const ActivityTab = ({ events: initialEvents, loading: initialLoading }) => {
    const [events, setEvents] = useState(initialEvents);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Sync with parent events when they change
    useEffect(() => {
        setEvents(initialEvents);
        setPage(1);
        setHasMore(initialEvents.length >= 30);
    }, [initialEvents]);

    const loadMore = async () => {
        const nextPage = page + 1;
        setLoadingMore(true);
        try {
            const moreEvents = await fetchEvents(nextPage);
            if (moreEvents.length === 0) {
                setHasMore(false);
            } else {
                setEvents((prev) => [...prev, ...moreEvents]);
                setPage(nextPage);
                if (moreEvents.length < 30) setHasMore(false);
            }
        } catch {
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="p-3 space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} height="24px" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No recent public events
            </div>
        );
    }

    const getEventDescription = (event) => {
        const repo = event.repo?.name?.split("/")[1] || event.repo?.name || "—";
        switch (event.type) {
            case "PushEvent": {
                const count = event.payload?.commits?.length || 0;
                return `Pushed ${count} commit${count !== 1 ? "s" : ""} to ${repo}`;
            }
            case "PullRequestEvent":
                return `${event.payload?.action || "Opened"} PR #${event.payload?.pull_request?.number || "?"} in ${repo}`;
            case "IssuesEvent":
                return `${event.payload?.action || "Opened"} issue #${event.payload?.issue?.number || "?"} in ${repo}`;
            case "WatchEvent":
                return `Starred ${repo}`;
            case "ForkEvent":
                return `Forked ${repo}`;
            case "CreateEvent":
                return `Created ${event.payload?.ref_type || "ref"} ${event.payload?.ref ? `"${event.payload.ref}" in ` : ""}${repo}`;
            case "DeleteEvent":
                return `Deleted ${event.payload?.ref_type || "ref"} "${event.payload?.ref || "?"}" in ${repo}`;
            case "IssueCommentEvent":
                return `Commented on issue #${event.payload?.issue?.number || "?"} in ${repo}`;
            case "ReleaseEvent":
                return `Released ${event.payload?.release?.tag_name || "?"} in ${repo}`;
            default:
                return `${event.type.replace("Event", "")} in ${repo}`;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* ── Header ── */}
            <div className="flex items-center border-b border-[#404040] bg-[#1e1e1e] text-[10px] text-gray-400 uppercase tracking-wider select-none shrink-0">
                <div className="px-2.5 py-2" style={{ flex: "0.3" }}></div>
                <div className="px-2.5 py-2" style={{ flex: "0.9" }}>Type</div>
                <div className="px-2.5 py-2" style={{ flex: "3" }}>Description</div>
                <div className="px-2.5 py-2" style={{ flex: "0.9" }}>Time</div>
            </div>

            {/* ── Rows ── */}
            <div className="flex-1 overflow-auto">
                {events.map((event, i) => (
                    <div
                        key={event.id || i}
                        className={`flex items-center text-xs border-b border-[#2a2a2a] transition-colors hover:bg-white/[0.04]
                            ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}
                    >
                        <div className="px-2.5 py-2 text-center" style={{ flex: "0.3" }}>
                            {EVENT_ICONS[event.type] || "📌"}
                        </div>
                        <div className="px-2.5 py-2 text-[#76b9ed]" style={{ flex: "0.9" }}>
                            {EVENT_LABELS[event.type] || event.type.replace("Event", "")}
                        </div>
                        <div
                            className="px-2.5 py-2 text-gray-300 truncate"
                            style={{ flex: "3" }}
                            title={getEventDescription(event)}
                        >
                            {getEventDescription(event)}
                        </div>
                        <div className="px-2.5 py-2 text-gray-500" style={{ flex: "0.9" }}>
                            {timeAgo(event.created_at)}
                        </div>
                    </div>
                ))}

                {/* ── Load More ── */}
                {hasMore && (
                    <div className="flex justify-center py-3">
                        <button
                            className="px-4 py-1.5 text-[11px] text-gray-300 bg-[#2a2a2a] border border-[#444] rounded hover:bg-[#333] hover:border-[#0078d7] transition-colors disabled:opacity-50"
                            onClick={loadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? "Loading…" : `Load More Events (page ${page + 1})`}
                        </button>
                    </div>
                )}
                {!hasMore && events.length > 30 && (
                    <div className="text-center py-2 text-[10px] text-gray-600">
                        End of available events (GitHub keeps ~90 days)
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════
// MAIN TASK MANAGER COMPONENT
// ═══════════════════════════════════════════
const GitHubTaskManager = () => {
    const [activeTab, setActiveTab] = useState("performance");
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [events, setEvents] = useState([]);
    const [contributions, setContributions] = useState(null);
    const [allTimeData, setAllTimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, reposData, eventsData, contribData] = await Promise.all([
                fetchUserProfile(),
                fetchRepos(),
                fetchEvents(1),
                fetchContributions().catch(() => null),
            ]);
            setProfile(profileData);
            setRepos(reposData);
            setEvents(eventsData);
            setContributions(contribData);

            // Fetch all-time contributions in background (non-blocking)
            if (profileData?.created_at) {
                fetchAllTimeContributions(profileData.created_at)
                    .then((data) => setAllTimeData(data))
                    .catch(() => {});
            }
        } catch (err) {
            console.error("GitHub API Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const tabs = [
        { id: "performance", label: "Performance" },
        { id: "processes", label: "Processes" },
        { id: "activity", label: "Activity" },
    ];

    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    return (
        <div className="flex flex-col h-full bg-[#191919] text-white select-none">
            <SpinKeyframe />
            {/* ── Tab Bar ── */}
            <div className="flex items-end bg-[#1e1e1e] border-b border-[#333] shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`px-4 py-2 text-xs font-medium transition-colors relative
                            ${
                                activeTab === tab.id
                                    ? "text-white bg-[#191919] border-t-2 border-t-[#0078d7] border-x border-x-[#333] border-b-0 -mb-px"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}

                {/* Refresh button */}
                <button
                    className="ml-auto px-2.5 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={loadData}
                    title="Refresh"
                    disabled={loading}
                >
                    <svg
                        className="w-3.5 h-3.5"
                        style={loading ? { animation: "spin 1s linear infinite" } : {}}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21.5 2v6h-6" />
                        <path d="M2.5 22v-6h6" />
                        <path d="M2.7 10.3a10 10 0 0 1 17.2-3.7L21.5 8" />
                        <path d="M21.3 13.7a10 10 0 0 1-17.2 3.7L2.5 16" />
                    </svg>
                </button>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="bg-[#442222] text-red-300 text-xs px-3 py-2 flex items-center gap-2 shrink-0">
                    <span>⚠️ {error}</span>
                    <button
                        className="ml-auto text-[10px] underline hover:text-red-200"
                        onClick={loadData}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ── Tab Content ── */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "performance" && (
                    <PerformanceTab
                        profile={profile}
                        repos={repos}
                        contributions={contributions}
                        allTimeData={allTimeData}
                        loading={loading}
                    />
                )}
                {activeTab === "processes" && (
                    <ProcessesTab repos={repos} loading={loading} />
                )}
                {activeTab === "activity" && (
                    <ActivityTab events={events} loading={loading} />
                )}
            </div>

            {/* ── Status Bar ── */}
            <div className="flex items-center justify-between bg-[#1e1e1e] border-t border-[#333] px-3 py-1.5 text-[10px] text-gray-500 shrink-0">
                <span>
                    {profile?.name || GITHUB_USERNAME_EXPORT} • {repos.length} repositories • {totalStars} stars
                    {allTimeData ? ` • ${allTimeData.allTimeTotal} contributions` : ""}
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            loading ? "bg-yellow-500 animate-pulse" : error ? "bg-red-500" : "bg-green-500"
                        }`}
                    />
                    {loading ? "Fetching…" : error ? "API Error" : "Connected"}
                </span>
            </div>
        </div>
    );
};

export default GitHubTaskManager;

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { GitHubCalendar } from "react-github-calendar";
import { FaCodeBranch, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { Code2, GitFork, LoaderCircle, Star } from "lucide-react";
import MacWindow from "./MacWindow";

const USER = "harshit-tiwari-codebase";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

// One palette shared by the donut, the bars and the repo rows
const LANG_COLORS = {
  JavaScript: "#f5d547",
  TypeScript: "#4a90e2",
  CSS: "#9b72e0",
  HTML: "#f06a4b",
  Python: "#4f9d7e",
  Java: "#c98a3a",
};
const FALLBACK_COLOR = "#8e99a8";

const glassCard = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.04) 100%)",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.3), 0 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.25)",
};

const tileStyle = (gradient) => ({
  background: gradient,
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.55), 0 0 0 0.5px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)",
});

const GitHubStatsWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const { t } = useTranslation();
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      axios.get(`https://api.github.com/users/${USER}`),
      axios.get(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`),
    ]).then(([userResponse, repoResponse]) => {
      if (cancelled) return;
      setProfile(userResponse.data);
      setRepos(repoResponse.data.filter((repo) => !repo.fork));
    }).catch(() => {
      if (!cancelled) setError(true);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const forks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const languages = repos.reduce((counts, repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
      return counts;
    }, {});
    const items = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = items.reduce((sum, [, count]) => sum + count, 0) || 1;
    const stops = items.map(([name, count], index) => {
      const start = items
        .slice(0, index)
        .reduce((sum, [, previousCount]) => sum + previousCount, 0) / total * 100;
      const end = start + (count / total) * 100;
      return `${LANG_COLORS[name] || FALLBACK_COLOR} ${start}% ${end}%`;
    });
    return { stars, forks, items, gradient: `conic-gradient(${stops.join(",")})` };
  }, [repos]);

  const featured = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

  const summary = [
    { label: "Public repositories", value: profile?.public_repos ?? (loading ? "…" : repos.length), Icon: Code2, gradient: "linear-gradient(180deg, #4aa8ff 0%, #0a64e8 100%)" },
    { label: "Stars", value: stats.stars, Icon: Star, gradient: "linear-gradient(180deg, #ffd25a 0%, #f59e0b 100%)" },
    { label: "Forks", value: stats.forks, Icon: GitFork, gradient: "linear-gradient(180deg, #5fe08a 0%, #1fa855 100%)" },
    { label: "Followers", value: profile?.followers ?? "…", image: "/doc-icons/github.svg", gradient: "linear-gradient(180deg, #8e9bb0 0%, #4b566a 100%)" },
  ];

  return (
    <MacWindow windowName={windowName} setWindowState={setWindowState} WindowState={WindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} title="GitHub Stats" initialWidth={900} initialHeight={650}>
      <div
        className="h-full overflow-y-auto px-4 py-5 text-white [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin] sm:px-6"
        style={{
          fontFamily: FONT_STACK,
          background:
            "radial-gradient(100% 50% at 0% 0%, rgba(10,132,255,0.13) 0%, rgba(10,132,255,0) 60%), linear-gradient(180deg, #14171d 0%, #0d1015 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <header className="flex flex-wrap items-center justify-between gap-3 pb-5">
            <div className="flex items-center gap-3.5">
              <img src="/doc-icons/github-stats.svg" alt="" className="h-12 w-12 shrink-0 rounded-[12px] object-contain" />
              <div className="min-w-0">
                <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[30px]">{t("stats")}</h1>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-white/50">
                  <span>@{USER}</span>
                  {loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-label="Loading GitHub stats" />}
                </p>
              </div>
            </div>
            <a
              href={`https://github.com/${USER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-white/[0.08] px-4 text-[12.5px] font-medium text-white/85 ring-1 ring-inset ring-white/[0.12] transition-colors hover:bg-white/[0.14] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
            >
              <img src="/doc-icons/github.svg" alt="" className="h-4 w-4" />
              View profile
              <FaExternalLinkAlt className="text-[10px] opacity-70" aria-hidden="true" />
            </a>
          </header>
          <p className="-mt-2 mb-5 max-w-[60ch] text-[13.5px] leading-relaxed text-white/55">{t("statsSubtitle")}</p>

          {error && (
            <p
              role="status"
              className="mb-4 rounded-[14px] px-4 py-3 text-[13px] text-[#ffd98a] ring-1 ring-inset ring-amber-300/25"
              style={{ background: "rgba(245,176,33,0.12)" }}
            >
              GitHub is temporarily unavailable. Refresh later to load current stats.
            </p>
          )}

          {/* Summary widgets */}
          <section aria-label="Repository summary" className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {summary.map(({ label, value, Icon, image, gradient }) => (
              <div key={label} className="rounded-[18px] p-3.5" style={glassCard}>
                <div className="flex h-8 w-8 items-center justify-center rounded-[9px] text-white" style={tileStyle(gradient)}>
                  {image ? <img src={image} alt="" className="h-4 w-4 invert" /> : <Icon className="h-4 w-4" strokeWidth={2.3} aria-hidden="true" />}
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{value}</p>
                <p className="mt-1.5 text-[12px] text-white/50">{label}</p>
              </div>
            ))}
          </section>

          {/* Contribution calendar */}
          <section className="mt-5 rounded-[20px] p-4 sm:p-5" style={glassCard}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{t("contributionActivity")}</h2>
              <span className="text-[12px] text-white/40">Public activity</span>
            </div>
            <div className="overflow-x-auto rounded-[12px] bg-black/20 px-3 py-4 ring-1 ring-inset ring-white/[0.06] sm:px-4">
              <GitHubCalendar username={USER} colorScheme="dark" fontSize={11} blockSize={11} blockMargin={4} blockRadius={3} />
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-white/40">
              Contribution calendar is provided by GitHub; streak totals are not exposed by the public REST API.
            </p>
          </section>

          {/* Languages */}
          <section className="mt-5 grid gap-5 rounded-[20px] p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_200px]" style={glassCard}>
            <div>
              <h2 className="mb-4 text-[15px] font-semibold tracking-[-0.01em]">{t("languagesByRepo")}</h2>
              {stats.items.length ? (
                <div className="space-y-3.5">
                  {stats.items.map(([name, count]) => (
                    <div key={name}>
                      <div className="mb-1.5 flex justify-between text-[12.5px]">
                        <span className="font-medium text-white/90">{name}</span>
                        <span className="text-white/45 tabular-nums">{count} repos</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max((count / (repos.length || 1)) * 100, 3)}%`,
                            backgroundColor: LANG_COLORS[name] || FALLBACK_COLOR,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-white/45">{loading ? "Loading languages…" : "No language data available."}</p>
              )}
              <p className="mt-4 text-[12px] text-white/35">Based on the primary language of each public repository.</p>
            </div>

            <div className="flex items-center gap-4 border-t border-white/[0.08] pt-4 md:flex-col md:justify-center md:border-l md:border-t-0 md:pl-5 md:pt-0">
              <div
                className="relative h-[104px] w-[104px] shrink-0 rounded-full"
                style={{ background: stats.items.length ? stats.gradient : "rgba(255,255,255,0.1)" }}
                role="img"
                aria-label="Language share by repository"
              >
                <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-[#12151b]">
                  <span className="text-[20px] font-semibold leading-none tabular-nums">{repos.length}</span>
                  <span className="mt-1 text-[10.5px] text-white/45">repos</span>
                </div>
              </div>
              <div className="min-w-0 space-y-1.5">
                {stats.items.map(([name]) => (
                  <p key={name} className="flex items-center gap-2 truncate text-[12px] text-white/70">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: LANG_COLORS[name] || FALLBACK_COLOR }} />
                    {name}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* Top repositories, grouped inset list */}
          <section className="mt-5 pb-2">
            <h2 className="mb-2.5 px-1 text-[15px] font-semibold tracking-[-0.01em]">{t("topRepos")}</h2>
            <div className="overflow-hidden rounded-[16px] bg-white/[0.055] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/[0.09] divide-y divide-white/[0.08]">
              {featured.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.06] focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-[13.5px] font-semibold text-[#64b0ff]">{repo.name}</h3>
                    <p className="mt-0.5 line-clamp-1 text-[12.5px] text-white/50">{repo.description || "Public GitHub project"}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-[12px] text-white/55 tabular-nums">
                    <span className="flex items-center gap-1.5"><FaStar className="text-[#f5c542]" aria-hidden="true" />{repo.stargazers_count}</span>
                    <span className="flex items-center gap-1.5"><FaCodeBranch aria-hidden="true" />{repo.forks_count}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] || FALLBACK_COLOR }} />
                      {repo.language || "Code"}
                    </span>
                  </div>
                </a>
              ))}
            </div>
            {!loading && !featured.length && <p className="py-4 text-[13px] text-white/45">No public repositories were returned.</p>}
          </section>
        </div>
      </div>
    </MacWindow>
  );
};

export default GitHubStatsWindow;
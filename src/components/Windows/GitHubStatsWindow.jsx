import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { GitHubCalendar } from "react-github-calendar";
import { FaCodeBranch, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { Code2, GitFork, LoaderCircle, Star } from "lucide-react";
import MacWindow from "./MacWindow";

const USER = "harshit-tiwari-codebase";
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
    const colors = { JavaScript: "#f1e05a", TypeScript: "#3178c6", CSS: "#563d7c", HTML: "#e34c26", Python: "#3572a5", Java: "#b07219" };
    const items = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = items.reduce((sum, [, count]) => sum + count, 0) || 1;
    const stops = items.map(([name, count], index) => {
      const start = items
        .slice(0, index)
        .reduce((sum, [, previousCount]) => sum + previousCount, 0) / total * 100;
      const end = start + (count / total) * 100;
      return `${colors[name] || "#8b949e"} ${start}% ${end}%`;
    });
    return { stars, forks, items, gradient: `conic-gradient(${stops.join(",")})` };
  }, [repos]);

  const featured = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

  return (
    <MacWindow windowName={windowName} setWindowState={setWindowState} WindowState={WindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} title="GitHub Stats" initialWidth={900} initialHeight={650}>
      <div className="h-full overflow-y-auto bg-[#10141a] px-4 py-5 text-[#e9edf3] sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[#2a313c] pb-5">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs text-[#8793a2]">
              <img src="/doc-icons/github.svg" alt="" className="h-3.5 w-3.5" /> @{USER}
              {loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-label="Loading GitHub stats" />}
            </p>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              <img src="/doc-icons/github-stats.svg" alt="" className="h-7 w-7 rounded-md sm:h-8 sm:w-8" />
              {t("stats")}
            </h1>
            <p className="mt-1 text-sm text-[#9ba6b4]">{t("statsSubtitle")}</p>
          </div>
          <a
            href={`https://github.com/${USER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#343d49] bg-[#1a2029] px-3 py-2 text-sm font-medium text-[#c8d0db] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
          >
            <img src="/doc-icons/github.svg" alt="" className="h-4 w-4" />
            Profile
            <FaExternalLinkAlt className="text-[10px]" />
          </a>
        </header>

        {error && (
          <p role="status" className="mt-4 border-l-2 border-[#b99a50] bg-[#282318] px-3 py-2 text-sm text-[#e0c989]">
            GitHub is temporarily unavailable. Refresh later to load current stats.
          </p>
        )}

        <section aria-label="Repository summary" className="grid grid-cols-2 border-b border-[#2a313c] py-3 md:grid-cols-4">
          {[
            { label: "Public repositories", value: profile?.public_repos ?? (loading ? "…" : repos.length), Icon: Code2 },
            { label: "Stars", value: stats.stars, Icon: Star },
            { label: "Forks", value: stats.forks, Icon: GitFork },
            { label: "Followers", value: profile?.followers ?? "…", image: "/doc-icons/github.svg" },
          ].map(({ label, value, Icon, image }, index) => (
            <div key={label} className={`py-3 ${index % 2 ? "pl-4 md:pl-5" : "pr-4"} ${index > 1 ? "border-t border-[#29313b] md:border-t-0" : ""} ${index % 4 ? "md:border-l md:border-[#29313b] md:pl-5" : ""}`}>
              {image ? (
                <img src={image} alt="" className="mb-2 h-4 w-4" />
              ) : (
                <Icon className="mb-2 h-4 w-4 text-[#a6b7ff]" />
              )}
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              <p className="mt-0.5 text-xs text-[#8793a2]">{label}</p>
            </div>
          ))}
        </section>

        <section className="border-b border-[#2a313c] py-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold">{t("contributionActivity")}</h2>
            <span className="text-xs text-[#8793a2]">Public activity</span>
          </div>
          <div className="overflow-x-auto border border-[#2b333d] bg-[#151b24] px-3 py-4 sm:px-5">
            <GitHubCalendar username={USER} colorScheme="dark" fontSize={11} blockSize={11} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#8793a2]">
            Contribution calendar is provided by GitHub; streak totals are not exposed by the public REST API.
          </p>
        </section>

        <section className="grid gap-6 border-b border-[#2a313c] py-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <h2 className="mb-4 text-base font-semibold">{t("languagesByRepo")}</h2>
            {stats.items.length ? (
              <div className="space-y-3">
                {stats.items.map(([name, count]) => (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-[#d6dce5]">{name}</span>
                      <span className="text-[#8793a2]">{count} repos</span>
                    </div>
                    <div className="h-1.5 overflow-hidden bg-[#252c36]">
                      <div
                        className="h-full"
                        style={{
                          width: `${Math.max((count / (repos.length || 1)) * 100, 3)}%`,
                          backgroundColor: ({ JavaScript: "#d8bd45", TypeScript: "#527fb5", CSS: "#75629a", HTML: "#cf674a", Python: "#58816e" })[name] || "#87919d",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8793a2]">{loading ? "Loading languages…" : "No language data available."}</p>
            )}
            <p className="mt-3 text-xs text-[#788493]">Based on the primary language of each public repository.</p>
          </div>

          <div className="flex items-center gap-4 border-t border-[#2b333d] pt-4 md:flex-col md:justify-center md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <div className="relative h-24 w-24 shrink-0 rounded-full" style={{ background: stats.items.length ? stats.gradient : "#252c36" }}>
              <div className="absolute inset-3 rounded-full bg-[#10141a]" />
            </div>
            <div className="min-w-0 space-y-1">
              {stats.items.map(([name]) => (
                <p key={name} className="truncate text-xs text-[#aab4c1]">
                  <span className="mr-1.5 text-[#a6b7ff]">●</span>{name}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5">
          <h2 className="mb-2 text-base font-semibold">{t("topRepos")}</h2>
          <div className="divide-y divide-[#29313b] border-y border-[#29313b]">
            {featured.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-2 py-3 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-2"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[#b8c7ff]">{repo.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-[#8793a2]">{repo.description || "Public GitHub project"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs text-[#9ba6b4]">
                  <span className="flex items-center gap-1"><FaStar className="text-[#d2b76f]" />{repo.stargazers_count}</span>
                  <span className="flex items-center gap-1"><FaCodeBranch />{repo.forks_count}</span>
                  <span>{repo.language || "Code"}</span>
                </div>
              </a>
            ))}
          </div>
          {!loading && !featured.length && <p className="py-4 text-sm text-[#8793a2]">No public repositories were returned.</p>}
        </section>
      </div>
    </MacWindow>
  );
};

export default GitHubStatsWindow;

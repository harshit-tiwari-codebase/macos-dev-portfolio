import { useEffect, useState } from "react";
import axios from "axios";
import MacWindow from "./MacWindow";
import { GitHubCalendar } from "react-github-calendar";
import {
  FaStar,
  FaCodeBranch,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { LoaderCircle } from "lucide-react";

const username = "harshit-tiwari-codebase";
const HIDDEN_PROJECTS = new Set(["tracemail", "tracemail-", "blocktraceai", "blocktrace"]);
const PINNED_PROJECTS = ["argus", "pixlify-mern", "nexora"];

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

const LANG_COLORS = {
  JavaScript: "#f5d547",
  TypeScript: "#4a90e2",
  CSS: "#9b72e0",
  HTML: "#f06a4b",
  Python: "#4f9d7e",
  Java: "#c98a3a",
};

const glassCard = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.04) 100%)",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.3), 0 0 0 0.5px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.25)",
};

const FALLBACK_FEATURED = [
  {
    id: 1,
    name: "Argus",
    description: "Project repository for Argus.",
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Argus",
  },
  {
    id: 2,
    name: "VerifAi",
    description: "AI verification engine designed for authenticity analysis and digital trust.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/VerifAi",
    homepage: "https://verif-ai-six.vercel.app/",
  },
  {
    id: 3,
    name: "macos-dev-portfolio",
    description: "Interactive macOS-styled desktop developer portfolio built with React & Tailwind.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/macos-dev-portfolio",
  },
  {
    id: 4,
    name: "Nexora",
    description: "Modern web application platform with a fluid, animated interface.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Nexora",
    homepage: "https://nexora-kappa-gules.vercel.app/",
  },
  {
    id: 5,
    name: "pixlify-mern",
    description: "Full-stack MERN image editing and photo sharing web app with cloud storage.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/pixlify-mern",
    homepage: "https://pixlify-mern-1.onrender.com/",
  },
  {
    id: 6,
    name: "Refokus-Clone",
    description: "Pixel-perfect clone of Refokus agency website featuring award-winning GSAP animations.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Refokus-Clone",
  },
];

const GitHubWindow = ({
  windowName,
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          const ownedRepos = data
            .filter((repo) => !repo.fork && !HIDDEN_PROJECTS.has(repo.name.toLowerCase()))
            .map((repo) => {
              const fallback = FALLBACK_FEATURED.find(
                (item) => item.name.toLowerCase() === repo.name.toLowerCase()
              );
              return { ...repo, homepage: repo.homepage || fallback?.homepage || "" };
            });
          const reposWithPinnedFallbacks = [...ownedRepos];
          for (const name of PINNED_PROJECTS) {
            if (!reposWithPinnedFallbacks.some((repo) => repo.name.toLowerCase() === name)) {
              const fallback = FALLBACK_FEATURED.find((repo) => repo.name.toLowerCase() === name);
              if (fallback) reposWithPinnedFallbacks.push(fallback);
            }
          }
          const featuredRepos = [
            ...PINNED_PROJECTS
              .map((name) => reposWithPinnedFallbacks.find((repo) => repo.name.toLowerCase() === name))
              .filter(Boolean),
            ...reposWithPinnedFallbacks
              .filter((repo) => !PINNED_PROJECTS.includes(repo.name.toLowerCase()))
              .sort((a, b) => b.stargazers_count - a.stargazers_count),
          ].slice(0, 6);
          setRepos(featuredRepos.length > 0 ? featuredRepos : FALLBACK_FEATURED);
        } else {
          setRepos(FALLBACK_FEATURED);
        }
      } catch (error) {
        console.warn("GitHub API Error, using fallback:", error);
        setRepos(FALLBACK_FEATURED);
      } finally {
        setLoading(false);
      }
    };

    getRepos();
  }, []);

  const openProjects = () => {
    setWindowState((prev) => ({ ...prev, projects: true }));
    if (setActiveWindow) setActiveWindow("projects");
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: "projects" }));
  };

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="GitHub Workspace — Harshit Tiwari"
      initialWidth={820}
      initialHeight={540}
    >
      <div
        className="h-full w-full overflow-y-auto p-4 text-white [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin] sm:p-6"
        style={{
          fontFamily: FONT_STACK,
          background:
            "radial-gradient(100% 50% at 100% 0%, rgba(10,132,255,0.13) 0%, rgba(10,132,255,0) 60%), linear-gradient(180deg, #14171d 0%, #0d1015 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <header className="flex flex-wrap items-center justify-between gap-4 pb-5">
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px]"
                style={{
                  background: "linear-gradient(180deg, #8e9bb0 0%, #3b4558 100%)",
                  boxShadow:
                    "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.35)",
                }}
              >
                <img src="/doc-icons/github.svg" alt="" className="h-6 w-6 invert" />
              </div>
              <div className="min-w-0">
                <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[30px]">GitHub Workspace</h1>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-white/50">
                  <span>@{username}</span>
                  {loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-label="Loading GitHub data" />}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openProjects}
                className="flex h-8 cursor-pointer items-center gap-2 rounded-full px-4 text-[12.5px] font-medium text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
                style={{
                  background: "linear-gradient(180deg, #3d9bff 0%, #0a74f0 100%)",
                  boxShadow:
                    "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(0,60,140,0.6), 0 4px 12px rgba(10,116,240,0.3)",
                }}
              >
                <img src="/doc-icons/projects.svg" alt="" className="h-4 w-4" />
                All projects
              </button>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 items-center gap-2 rounded-full bg-white/[0.08] px-4 text-[12.5px] font-medium text-white/85 ring-1 ring-inset ring-white/[0.12] transition-colors hover:bg-white/[0.14] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
              >
                Visit profile
                <FaExternalLinkAlt className="text-[10px] opacity-70" aria-hidden="true" />
              </a>
            </div>
          </header>
          <p className="-mt-2 mb-5 text-[13.5px] text-white/55">Repositories and contribution activity.</p>

          <section className="rounded-[20px] p-4 sm:p-5" style={glassCard}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Contribution activity</h2>
              <span className="text-[12px] text-white/40">Public activity · @{username}</span>
            </div>
            <div className="overflow-x-auto rounded-[12px] bg-black/20 px-3 py-4 ring-1 ring-inset ring-white/[0.06] sm:px-4">
              <GitHubCalendar username={username} colorScheme="dark" fontSize={11} blockSize={11} blockMargin={4} blockRadius={3} />
            </div>
          </section>

          <section className="pt-6">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3 px-1">
              <div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Featured repositories</h2>
                <p className="mt-0.5 text-[12.5px] text-white/45">A selection from the public workspace.</p>
              </div>
              <button
                type="button"
                onClick={openProjects}
                className="cursor-pointer text-[13px] font-medium text-[#64b0ff] transition-colors hover:text-[#9ccbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
              >
                Browse all projects
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(repos.length > 0 ? repos : FALLBACK_FEATURED).map((repo) => {
                const language = repo.language || "JavaScript";
                return (
                  <article key={repo.id} className="flex flex-col justify-between gap-4 rounded-[18px] p-4" style={glassCard}>
                    <div className="min-w-0">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-2 text-[14px] font-semibold tracking-[-0.01em] text-[#64b0ff] transition-colors hover:text-[#9ccbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
                      >
                        <span className="truncate">{repo.name}</span>
                        <FaExternalLinkAlt className="shrink-0 text-[9px] opacity-70" aria-hidden="true" />
                      </a>
                      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-white/60">
                        {repo.description || "Interactive software project and codebase."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-white/55 tabular-nums">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LANG_COLORS[language] || "#8e99a8" }} />
                          {language}
                        </span>
                        <span className="flex items-center gap-1.5"><FaStar className="text-[#f5c542]" aria-hidden="true" />{repo.stargazers_count ?? 0}</span>
                        <span className="flex items-center gap-1.5"><FaCodeBranch aria-hidden="true" />{repo.forks_count ?? 0}</span>
                      </div>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-6 items-center rounded-full bg-white/[0.1] px-3 text-[11.5px] font-medium text-white/85 ring-1 ring-inset ring-white/[0.12] transition-colors hover:bg-white/[0.18] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                        >
                          Live site
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </MacWindow>
  );
};

export default GitHubWindow;
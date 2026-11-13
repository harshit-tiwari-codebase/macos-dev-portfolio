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
  },
  {
    id: 5,
    name: "pixlify-mern",
    description: "Full-stack MERN image editing and photo sharing web app with cloud storage.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/pixlify-mern",
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
          const ownedRepos = data.filter(
            (repo) => !repo.fork && !HIDDEN_PROJECTS.has(repo.name.toLowerCase())
          );
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
      <div className="h-full w-full overflow-y-auto bg-[#10141a] p-4 text-[#e9edf3] sm:p-6">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2a313c] pb-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#9ba6b4]">
              <img src="/doc-icons/github.svg" alt="" className="h-4 w-4" />
              <span>@{username}</span>
              {loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-label="Loading GitHub data" />}
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">GitHub Workspace</h1>
            <p className="mt-1 text-sm text-[#9ba6b4]">Repositories and contribution activity.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openProjects}
              className="flex items-center gap-2 rounded-lg bg-[#d5defd] px-3.5 py-2 text-sm font-semibold text-[#19233a] transition-colors hover:bg-[#bdcbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
            >
              <img src="/doc-icons/projects.svg" alt="" className="h-5 w-5 brightness-0" />
              All projects
            </button>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[#343d49] bg-[#1a2029] px-3.5 py-2 text-sm font-medium text-[#c8d0db] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
            >
              Visit profile
              <FaExternalLinkAlt className="text-[10px]" />
            </a>
          </div>
        </header>

        <section className="border-b border-[#2a313c] py-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight">Contribution activity</h2>
            <span className="text-xs text-[#8793a2]">Public activity · @{username}</span>
          </div>
          <div className="overflow-x-auto border border-[#2b333d] bg-[#151b24] px-3 py-4 sm:px-5">
            <GitHubCalendar username={username} colorScheme="dark" fontSize={11} blockSize={11} />
          </div>
        </section>

        <section className="pt-5">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Featured repositories</h2>
              <p className="mt-1 text-xs text-[#8793a2]">A selection from the public workspace.</p>
            </div>
            <button
              type="button"
              onClick={openProjects}
              className="text-sm font-medium text-[#b8c7ff] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
            >
              Browse all projects
            </button>
          </div>

          <div className="divide-y divide-[#2b333d] border-y border-[#2b333d]">
            {(repos.length > 0 ? repos : FALLBACK_FEATURED).map((repo) => (
              <article key={repo.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-2 text-sm font-semibold text-[#b8c7ff] hover:underline"
                  >
                    <span className="truncate">{repo.name}</span>
                    <FaExternalLinkAlt className="shrink-0 text-[9px]" />
                  </a>
                  <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#a2adba]">
                    {repo.description || "Interactive software project and codebase."}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#9ba6b4]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e3c54a]" />
                    {repo.language || "JavaScript"}
                  </span>
                  <span className="flex items-center gap-1.5"><FaStar className="text-[#d2b76f]" />{repo.stargazers_count ?? 0}</span>
                  <span className="flex items-center gap-1.5"><FaCodeBranch />{repo.forks_count ?? 0}</span>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noreferrer" className="font-medium text-[#b8c7ff] hover:underline">
                      Live site
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MacWindow>
  );
};

export default GitHubWindow;

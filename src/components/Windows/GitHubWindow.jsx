import React, { useEffect, useState } from "react";
import axios from "axios";
import MacWindow from "./MacWindow";
import { GitHubCalendar } from "react-github-calendar";
import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FolderGit2 } from "lucide-react";

const username = "harshit-tiwari-codebase";

const FALLBACK_FEATURED = [
  {
    id: 1,
    name: "BlockTraceAI",
    description: "AI-assisted blockchain transaction intelligence and tracking application.",
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/BlockTraceAI",
  },
  {
    id: 2,
    name: "TraceMail-",
    description: "Robust email intelligence, verification, and automated analytics platform.",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/TraceMail-",
  },
  {
    id: 3,
    name: "VerifAi",
    description: "AI verification engine designed for authenticity analysis and digital trust.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/VerifAi",
  },
  {
    id: 4,
    name: "macos-dev-portfolio",
    description: "Interactive macOS-styled desktop developer portfolio built with React & Tailwind.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/macos-dev-portfolio",
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
          const featuredRepos = data
            .filter((repo) => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);
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
      <div className="w-full h-full overflow-y-auto bg-[#0d1117] text-white p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <FaGithub className="text-white" />
              GitHub Workspace
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Explore my development projects and GitHub activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openProjects}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>All Projects</span>
            </button>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium transition flex items-center gap-2"
            >
              <span>Visit Profile</span>
              <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>

        {/* Contribution Calendar */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-semibold">
              Contribution Activity
            </h2>
            <span className="text-xs text-gray-400">@{username}</span>
          </div>

          <div className="overflow-x-auto py-2">
            <GitHubCalendar
              username={username}
              colorScheme="dark"
              fontSize={12}
              blockSize={12}
            />
          </div>
        </div>

        {/* Featured Repositories Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <span>Featured Repositories</span>
          </h2>
          <button
            onClick={openProjects}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition"
          >
            View all repositories →
          </button>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(repos.length > 0 ? repos : FALLBACK_FEATURED).map((repo) => (
            <div
              key={repo.id}
              className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Repo Title */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold truncate text-white" title={repo.name}>
                    {repo.name}
                  </h3>
                  <FaGithub className="text-gray-400 shrink-0 text-sm" />
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {repo.description || "Interactive software project and codebase."}
                </p>

                {/* Language */}
                <div className="mb-3">
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                    {repo.language || "JavaScript"}
                  </span>
                </div>
              </div>

              {/* Bottom stats and link */}
              <div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 pt-2 border-t border-[#30363d]/60">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-amber-400" />
                    <span>{repo.stargazers_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCodeBranch />
                    <span>{repo.forks_count ?? 0}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition"
                  >
                    <FaGithub />
                    Code
                  </a>

                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium transition"
                    >
                      <FaExternalLinkAlt />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MacWindow>
  );
};

export default GitHubWindow;

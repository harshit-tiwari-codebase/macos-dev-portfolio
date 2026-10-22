import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MacWindow from "./MacWindow";
import {
  FolderGit2,
  Search,
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Code2,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const GITHUB_USERNAME = "harshit-tiwari-codebase";

// Curated fallbacks with friendly descriptions if GitHub API is rate-limited or descriptions are empty
const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "BlockTraceAI",
    description: "AI-assisted blockchain transaction intelligence and tracking application.",
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/BlockTraceAI",
    homepage: "",
    topics: ["ai", "blockchain", "javascript", "security"],
    updated_at: "2026-04-15T00:00:00Z",
  },
  {
    id: 2,
    name: "TraceMail-",
    description: "Robust email intelligence, verification, and automated delivery analytics platform.",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/TraceMail-",
    homepage: "",
    topics: ["typescript", "email-api", "automation"],
    updated_at: "2026-04-12T00:00:00Z",
  },
  {
    id: 3,
    name: "VerifAi",
    description: "AI verification engine designed for authenticity analysis and digital trust evaluation.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/VerifAi",
    homepage: "",
    topics: ["ai", "verification", "react", "fullstack"],
    updated_at: "2026-04-10T00:00:00Z",
  },
  {
    id: 4,
    name: "macos-dev-portfolio",
    description: "Interactive macOS-styled desktop developer portfolio built with React and Tailwind CSS.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/macos-dev-portfolio",
    homepage: "",
    topics: ["react", "tailwind", "macos-theme", "portfolio"],
    updated_at: "2026-05-10T00:00:00Z",
  },
  {
    id: 5,
    name: "Nexora",
    description: "Next-gen web application platform with modern fluid UI, animations, and high performance.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Nexora",
    homepage: "",
    topics: ["javascript", "web-app", "ui-ux"],
    updated_at: "2026-03-20T00:00:00Z",
  },
  {
    id: 6,
    name: "pixlify-mern",
    description: "Full-stack MERN image editing and photo sharing web app with cloud asset storage.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/pixlify-mern",
    homepage: "",
    topics: ["mern", "mongodb", "express", "react", "nodejs"],
    updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: 7,
    name: "Refokus-Clone",
    description: "Pixel-perfect clone of Refokus agency website featuring award-winning GSAP animations.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Refokus-Clone",
    homepage: "",
    topics: ["gsap", "animation", "react", "tailwind"],
    updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: 8,
    name: "emotify",
    description: "Real-time facial expression and mood-based music and content recommendation app.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/emotify",
    homepage: "",
    topics: ["ai", "emotion-detection", "spotify-api", "javascript"],
    updated_at: "2026-02-28T00:00:00Z",
  },
  {
    id: 9,
    name: "Productivity-Dashboard",
    description: "Personal productivity suite with Pomodoro timer, task manager, and progress charts.",
    language: "CSS",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Productivity-Dashboard",
    homepage: "",
    topics: ["productivity", "dashboard", "css", "javascript"],
    updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: 10,
    name: "CSS-UI-CLONE-PROJECTS",
    description: "Curated collection of responsive UI component clones and modern CSS layout patterns.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/CSS-UI-CLONE-PROJECTS",
    homepage: "",
    topics: ["css", "html", "ui-clones", "frontend"],
    updated_at: "2026-02-10T00:00:00Z",
  },
  {
    id: 11,
    name: "JS-MINI-PROJECT",
    description: "Collection of interactive JavaScript mini-games, algorithms, and DOM utility experiments.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/JS-MINI-PROJECT",
    homepage: "",
    topics: ["javascript", "mini-projects", "games", "dom"],
    updated_at: "2026-01-25T00:00:00Z",
  },
  {
    id: 12,
    name: "LEARNINGS",
    description: "Structured repository of daily coding practice, algorithms, and full-stack learnings.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/LEARNINGS",
    homepage: "",
    topics: ["dsa", "javascript", "notes", "learning"],
    updated_at: "2026-01-10T00:00:00Z",
  },
  {
    id: 13,
    name: "harshit-tiwari-codebase",
    description: "GitHub Profile documentation, stats, and personal open-source portfolio overview.",
    language: "Markdown",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/harshit-tiwari-codebase",
    homepage: "",
    topics: ["github-profile", "developer"],
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Markdown: "#083fa1",
  Shell: "#89e051",
};

const ProjectsWindow = ({
  windowName = "projects",
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Enrich repos with descriptions from fallback if empty
        const fallbackMap = new Map(FALLBACK_PROJECTS.map((p) => [p.name.toLowerCase(), p]));

        const enriched = response.data.map((repo) => {
          const fb = fallbackMap.get(repo.name.toLowerCase());
          return {
            id: repo.id,
            name: repo.name,
            description:
              repo.description ||
              (fb && fb.description) ||
              "Modern open-source software project and interactive codebase.",
            language: repo.language || (fb && fb.language) || "Code",
            stargazers_count: repo.stargazers_count ?? 0,
            forks_count: repo.forks_count ?? 0,
            html_url: repo.html_url,
            homepage: repo.homepage || (fb && fb.homepage) || "",
            topics:
              repo.topics && repo.topics.length > 0
                ? repo.topics
                : (fb && fb.topics) || [],
            updated_at: repo.updated_at || new Date().toISOString(),
          };
        });

        setProjects(enriched);
      } else {
        setProjects(FALLBACK_PROJECTS);
      }
    } catch (err) {
      console.warn("GitHub API error, using curated projects list:", err);
      setError("GitHub API rate limit reached. Displaying cached projects.");
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesQuery =
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.description &&
            project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.language &&
            project.language.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.topics &&
            project.topics.some((t) =>
              t.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        if (!matchesQuery) return false;

        if (selectedTag === "all") return true;
        if (selectedTag === "javascript")
          return project.language?.toLowerCase() === "javascript";
        if (selectedTag === "typescript")
          return project.language?.toLowerCase() === "typescript";
        if (selectedTag === "ai")
          return (
            project.name.toLowerCase().includes("ai") ||
            project.description?.toLowerCase().includes("ai") ||
            project.topics?.includes("ai")
          );
        if (selectedTag === "web")
          return (
            project.language === "JavaScript" ||
            project.language === "TypeScript" ||
            project.language === "CSS" ||
            project.language === "HTML"
          );

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [projects, searchQuery, selectedTag, sortBy]);

  const totalStars = projects.reduce((acc, p) => acc + (p.stargazers_count || 0), 0);

  return (
    <MacWindow
      windowName={windowName}
      WindowState={WindowState}
      setWindowState={setWindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Projects — Harshit Tiwari"
      initialWidth={880}
      initialHeight={560}
      initialX={220}
      initialY={70}
    >
      <div className="w-full h-full flex flex-col bg-[#0d1117] text-gray-100 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  All Projects
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {projects.length} Repositories
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Fetched live from GitHub (@{GITHUB_USERNAME})
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchProjects}
              disabled={loading}
              title="Refresh from GitHub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:px-5 sm:py-3 border-b border-[#30363d] bg-[#161b22]/50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, tech, or topic..."
              className="w-full bg-[#0d1117] border border-[#30363d] focus:border-blue-500 focus:outline-none rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-gray-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: "all", label: "All" },
              { id: "javascript", label: "JavaScript" },
              { id: "typescript", label: "TypeScript" },
              { id: "ai", label: "AI & ML" },
              { id: "web", label: "Full Stack" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`px-2.5 py-1 rounded-md transition whitespace-nowrap font-medium ${
                  selectedTag === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-blue-500 ml-1 cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Notice banner if rate limited */}
        {error && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-amber-400 hover:text-amber-200 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 animate-pulse space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 bg-gray-700/50 rounded" />
                    <div className="h-4 w-10 bg-gray-700/50 rounded" />
                  </div>
                  <div className="h-10 bg-gray-700/30 rounded" />
                  <div className="flex gap-2">
                    <div className="h-4 w-16 bg-gray-700/40 rounded-full" />
                    <div className="h-4 w-12 bg-gray-700/40 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FolderGit2 className="w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-base font-semibold text-gray-300">
                No matching projects found
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Try searching with a different keyword or resetting your filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("all");
                }}
                className="mt-4 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProjects.map((project) => {
                const langColor =
                  LANGUAGE_COLORS[project.language] || "#8b949e";

                return (
                  <div
                    key={project.id}
                    className="group bg-[#161b22] hover:bg-[#1a202c] border border-[#30363d] hover:border-blue-500/50 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Top Row: Name & Tag */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <h3
                            className="font-semibold text-sm sm:text-base text-white truncate group-hover:text-blue-400 transition"
                            title={project.name}
                          >
                            {project.name}
                          </h3>
                        </div>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 shrink-0">
                          Public
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3">
                        {project.description}
                      </p>

                      {/* Topics / Tags */}
                      {project.topics && project.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            >
                              #{topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Metadata & Action Links */}
                    <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between text-xs text-gray-400">
                      {/* Language & Stats */}
                      <div className="flex items-center gap-3">
                        {project.language && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-300">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: langColor }}
                            />
                            <span>{project.language}</span>
                          </div>
                        )}
                        {project.stargazers_count > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{project.stargazers_count}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noreferrer"
                          title="View Source on GitHub"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-200 transition text-xs border border-white/10"
                        >
                          <FaGithub className="w-3 h-3" />
                          <span>Code</span>
                        </a>

                        {project.homepage && (
                          <a
                            href={project.homepage}
                            target="_blank"
                            rel="noreferrer"
                            title="Open Live Preview"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition text-xs font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-4 py-2 bg-[#161b22] border-t border-[#30363d] text-xs text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Showing {filteredProjects.length} of {projects.length} repositories</span>
            {totalStars > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                • <Star className="w-3 h-3 fill-amber-400 inline" /> {totalStars} Stars
              </span>
            )}
          </div>
          <div className="text-gray-500 text-[11px] hidden sm:block">
            Harshit Tiwari • Devfolio
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default ProjectsWindow;

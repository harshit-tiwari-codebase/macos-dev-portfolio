import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MacWindow from "./MacWindow";
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Code2,
  ArrowUpRight,
} from "lucide-react";

const GITHUB_USERNAME = "harshit-tiwari-codebase";
const HIDDEN_PROJECTS = new Set(["tracemail", "tracemail-", "blocktraceai", "blocktrace"]);

// Curated fallbacks with friendly descriptions if GitHub API is rate-limited or descriptions are empty
const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "Argus",
    description: "Project repository for Argus.",
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/harshit-tiwari-codebase/Argus",
    homepage: "",
    topics: ["argus"],
    updated_at: "2026-04-15T00:00:00Z",
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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

        const enriched = response.data
          .filter((repo) => !HIDDEN_PROJECTS.has(repo.name.toLowerCase()))
          .map((repo) => {
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

        const preservedProjects = FALLBACK_PROJECTS.filter((project) =>
          ["argus", "nexora", "pixlify-mern"].includes(project.name.toLowerCase()) &&
          !enriched.some((repo) => repo.name.toLowerCase() === project.name.toLowerCase())
        );
        setProjects([...preservedProjects, ...enriched]);
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
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#10141a] text-[#e9edf3]">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2a313c] bg-[#141922] px-4 py-4 sm:px-6">
          <div>
            <p className="mb-1 text-xs text-[#8f9aaa]">GitHub · @{GITHUB_USERNAME}</p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Projects</h1>
            <p className="mt-1 text-sm text-[#9ba6b4]">A working collection of experiments and products.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-[#8f9aaa]">{projects.length} public repositories</span>
            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              title="Refresh from GitHub"
              className="flex items-center gap-1.5 rounded-lg border border-[#343d49] bg-[#1a2029] px-3 py-2 text-sm font-medium text-[#c8d0db] transition-colors hover:bg-[#252d38] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync
            </button>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-[#d5defd] px-3 py-2 text-sm font-semibold text-[#19233a] transition-colors hover:bg-[#bdcbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
            >
              <img src="/doc-icons/github.svg" alt="" className="h-3.5 w-3.5 brightness-0" />
              Profile
              <ArrowUpRight className="h-3 w-3 text-white/65" />
            </a>
          </div>
        </header>

        <div className="flex flex-col gap-3 border-b border-[#2a313c] bg-[#121720] px-4 py-3 sm:flex-row sm:items-center sm:px-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7f8a98]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="w-full rounded-lg border border-[#303a47] bg-[#171d26] py-2 pl-9 pr-3 text-sm text-[#e9edf3] outline-none transition focus:border-[#8097e7] focus:ring-2 focus:ring-[#8097e7]/20 placeholder:text-[#7f8a98]"
            />
          </div>

          <div className="flex min-w-0 items-center gap-4 overflow-x-auto sm:ml-auto">
            <div className="flex shrink-0 items-center gap-4">
              {[
                { id: "all", label: "All" },
                { id: "javascript", label: "JavaScript" },
                { id: "typescript", label: "TypeScript" },
                { id: "ai", label: "AI & ML" },
                { id: "web", label: "Full Stack" },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setSelectedTag(tab.id)}
                  aria-pressed={selectedTag === tab.id}
                  className={`whitespace-nowrap border-b-2 py-2 text-sm transition-colors ${
                    selectedTag === tab.id
                      ? "border-[#9aacf5] font-semibold text-[#c1ceff]"
                      : "border-transparent text-[#9ba6b4] hover:text-[#e9edf3]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <select
              aria-label="Sort projects"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shrink-0 rounded-lg border border-[#303a47] bg-[#171d26] px-2.5 py-2 text-xs text-[#c5ccd6] outline-none focus:border-[#8097e7]"
            >
              <option value="updated">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Notice banner if rate limited */}
        {error && (
          <div role="status" className="flex items-center justify-between border-b border-[#4c4027] bg-[#282318] px-4 py-2 text-xs text-[#e0c989]">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-[#c9b36f] hover:text-[#fff0bd]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
          {loading ? (
            <div className="divide-y divide-[#29313b]">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="animate-pulse space-y-2 py-5">
                  <div className="h-4 w-40 rounded bg-[#27303b]" />
                  <div className="h-3 w-3/4 rounded bg-[#202832]" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <img src="/doc-icons/projects.svg" alt="" className="mb-3 h-10 w-10" />
              <h3 className="text-base font-semibold text-[#dfe4ec]">
                No matching projects found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-[#9ba6b4]">
                Try searching with a different keyword or resetting your filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("all");
                }}
                className="mt-4 rounded-lg border border-[#343d49] bg-[#1a2029] px-3 py-2 text-sm font-medium text-[#c1ceff] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#29313b] border-y border-[#29313b]">
              {filteredProjects.map((project) => {
                const langColor =
                  LANGUAGE_COLORS[project.language] || "#8b949e";

                return (
                  <article key={project.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 shrink-0 text-[#8a98af]" />
                        <h3 className="truncate text-sm font-semibold text-[#b8c7ff] sm:text-base" title={project.name}>
                          {project.name}
                        </h3>
                        <span className="text-xs text-[#798493]">Public</span>
                      </div>
                      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#a2adba]">
                        {project.description}
                      </p>
                      {project.topics?.length > 0 && (
                        <p className="mt-2 truncate text-xs text-[#8995a4]">
                          {project.topics.slice(0, 3).join(" · ")}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#9ba6b4]">
                      {project.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                          {project.language}
                        </span>
                      )}
                      {project.stargazers_count > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Star className="h-3 w-3 text-[#d2b76f]" />
                          {project.stargazers_count}
                        </span>
                      )}
                      {project.forks_count > 0 && (
                        <span className="flex items-center gap-1.5">
                          <GitFork className="h-3 w-3" />
                          {project.forks_count}
                        </span>
                      )}
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noreferrer"
                        title="View source on GitHub"
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#343d49] bg-[#191f28] px-2.5 py-1.5 font-medium text-[#c4ccd7] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
                      >
                        <img src="/doc-icons/github.svg" alt="" className="h-3 w-3" />
                        Code
                      </a>

                      {project.homepage && (
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noreferrer"
                          title="Open live preview"
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#343d49] bg-[#191f28] px-2.5 py-1.5 font-medium text-[#c4ccd7] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="flex items-center justify-between border-t border-[#2a313c] bg-[#141922] px-4 py-2 text-xs text-[#8f9aaa]">
          <div className="flex items-center gap-2">
            <span>Showing {filteredProjects.length} of {projects.length} repositories</span>
            {totalStars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="inline h-3 w-3 text-[#d2b76f]" /> {totalStars} stars
              </span>
            )}
          </div>
          <div className="hidden text-[11px] text-[#87919d] sm:block">
            Harshit Tiwari • Devfolio
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default ProjectsWindow;

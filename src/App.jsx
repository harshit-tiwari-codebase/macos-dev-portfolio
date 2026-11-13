import { useState, useMemo } from "react";
import Wallpaper from "./components/Wallpaper";
import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import ControlCenter from "./components/ControlCenter";
import Notification from "./components/Notification";
import Spotlight, { Palette } from "./components/Spotlight";
import ProjectsWindow from "./components/Windows/ProjectsWindow";
import GitHubWindow from "./components/Windows/GitHubWindow";
import SpotifyWindow from "./components/Windows/SpotifyWindow";
import Note from "./components/Windows/Note";
import Resume from "./components/Windows/Resume";
import Cli from "./components/Windows/Cli";
import GitHubStatsWindow from "./components/Windows/GitHubStatsWindow";
import AchievementsWindow from "./components/Windows/AchievementsWindow";
import ContactWindow from "./components/Windows/ContactWindow";
import BlogWindow from "./components/Windows/BlogWindow";
import DesktopIcons from "./components/DesktopIcons";
import StoryPage from "./components/Story/StoryPage";
import BootScreen from "./components/BootScreen";
import { AnimatePresence, motion } from "framer-motion";
import { AppWindow, ExternalLink } from "lucide-react";
import storyFolderIcon from "../story-folder.svg";

const DEFAULT_WALLPAPER = "/images/macos-dark-abstract.jpg";

const App = () => {
  // ── Boot screen: show on first visit per browser session ──────────────────
  const [booting, setBooting] = useState(() => {
    try {
      return !sessionStorage.getItem("harshitos_booted");
    } catch {
      return true;
    }
  });

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem("harshitos_booted", "1");
    } catch { /* ignore */ }
    setBooting(false);
  };

  // All windows start closed — clean desktop after boot animation
  const [WindowState, setWindowState] = useState({
    projects: false,
    github: false,
    spotify: false,
    note: false,
    resume: false,
    cli: false,
    stats: false,
    achievements: false,
    contact: false,
    blog: false,
  });

  const [storyOpen, setStoryOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState("projects");
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Wallpaper state with localStorage persistence
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    try {
      return (
        localStorage.getItem("macos_wallpaper") ||
        DEFAULT_WALLPAPER
      );
    } catch {
      return DEFAULT_WALLPAPER;
    }
  });

  const handleSelectWallpaper = (url) => {
    setCurrentWallpaper(url);
    try {
      localStorage.setItem("macos_wallpaper", url);
    } catch (e) {
      console.warn("Could not save wallpaper preference", e);
    }
  };

  const handleOpenWindow = (name) => {
    setWindowState((prev) => ({ ...prev, [name]: true }));
    setActiveWindow(name);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: name }));
  };

  const handleOpenProjects = () => handleOpenWindow("projects");
  const handleOpenCli = () => handleOpenWindow("cli");

  // Spotlight search items (Applications & Commands)
  const spotlightItems = useMemo(
    () => [
      {
        id: "app-projects",
        title: "All Projects",
        subtitle: "Explore 13+ GitHub repositories",
        group: "Applications",
        keywords: "projects code github repos portfolio",
        image: "/doc-icons/projects.svg",
        action: () => handleOpenProjects(),
      },
      {
        id: "app-cli",
        title: "Terminal",
        subtitle: "zsh command emulator",
        group: "Applications",
        keywords: "terminal cli shell console zsh bash",
        image: "/doc-icons/cli.svg",
        action: () => handleOpenCli(),
      },
      {
        id: "app-resume",
        title: "Resume",
        subtitle: "Harshit Tiwari Professional CV",
        group: "Applications",
        keywords: "resume cv pdf education experience",
        image: "/doc-icons/pdf.svg",
        action: () => handleOpenWindow("resume"),
      },
      {
        id: "app-note",
        title: "Notes.js",
        subtitle: "Developer notes and skills overview",
        group: "Applications",
        keywords: "notes code dsa learning skills stack",
        image: "/doc-icons/note.svg",
        action: () => handleOpenWindow("note"),
      },
      {
        id: "app-spotify",
        title: "Spotify",
        subtitle: "Background music player",
        group: "Applications",
        keywords: "spotify music playlist songs audio",
        image: "/doc-icons/spotify.svg",
        action: () => handleOpenWindow("spotify"),
      },
      {
        id: "app-github",
        title: "GitHub Workspace",
        subtitle: "GitHub activity calendar and repos",
        group: "Applications",
        keywords: "github profile contributions calendar",
        image: "/doc-icons/github.svg",
        action: () => handleOpenWindow("github"),
      },
      {
        id: "app-github-stats",
        title: "GitHub Stats",
        subtitle: "Languages, repositories, stars, forks, and activity",
        group: "Applications",
        keywords: "github stats languages stars forks contributions",
        image: "/doc-icons/github-stats.svg",
        action: () => handleOpenWindow("stats"),
      },
      {
        id: "app-achievements",
        title: "Achievements & Certificates",
        subtitle: "Academic record and verified certificates",
        group: "Applications",
        keywords: "trophy achievements certificate ey techathon",
        image: "/doc-icons/achievements.svg",
        action: () => handleOpenWindow("achievements"),
      },
      {
        id: "app-contact",
        title: "Contact",
        subtitle: "Send Harshit a message",
        group: "Applications",
        keywords: "contact email message mail",
        image: "/doc-icons/mail.svg",
        action: () => handleOpenWindow("contact"),
      },
      {
        id: "app-blog",
        title: "Blog & Articles",
        subtitle: "Read published developer articles",
        group: "Applications",
        keywords: "blog articles devto writing",
        image: "/doc-icons/blog.svg",
        action: () => handleOpenWindow("blog"),
      },
      {
        id: "app-story",
        title: "My Story (storyfolder)",
        subtitle: "Hero, About, Skills Arsenal & Animated Journey",
        group: "Applications",
        keywords: "story storyfolder hero about skills portfolio journey roadmap",
        image: storyFolderIcon,
        action: () => setStoryOpen(true),
      },
      {
        id: "cmd-wallpaper",
        title: "Change Wallpaper",
        subtitle: "Open Control Center wallpaper picker",
        group: "Commands",
        keywords: "wallpaper background theme customize sonoma",
        icon: Palette,
        action: () => setControlCenterOpen(true),
      },
      {
        id: "cmd-control-center",
        title: "Open Control Center",
        subtitle: "Quick toggles, wallpapers & system status",
        group: "Commands",
        keywords: "control center settings quick toggles",
        icon: AppWindow,
        action: () => setControlCenterOpen(true),
      },
      {
        id: "cmd-close-all",
        title: "Close All Windows",
        subtitle: "Minimize all active applications",
        group: "Commands",
        keywords: "close hide clear desktop windows",
        icon: AppWindow,
        action: () => {
          setWindowState({
            projects: false,
            github: false,
            spotify: false,
            note: false,
            resume: false,
            cli: false,
            stats: false,
            achievements: false,
            contact: false,
            blog: false,
          });
          setStoryOpen(false);
        },
      },
      {
        id: "cmd-github-profile",
        title: "Visit GitHub Profile",
        subtitle: "github.com/harshit-tiwari-codebase",
        group: "Commands",
        keywords: "github link web url profile",
        icon: ExternalLink,
        image: "/doc-icons/github.svg",
        action: () =>
          window.open("https://github.com/harshit-tiwari-codebase", "_blank", "noopener"),
        external: true,
      },
      {
        id: "cmd-linkedin",
        title: "Open LinkedIn",
        subtitle: "linkedin.com/in/harshit-tiwari-48830b3b4",
        group: "Commands",
        keywords: "linkedin social profile network",
        icon: ExternalLink,
        image: "/doc-icons/link.svg",
        action: () =>
          window.open(
            "https://www.linkedin.com/in/harshit-tiwari-48830b3b4/",
            "_blank",
            "noopener"
          ),
        external: true,
      },
      {
        id: "cmd-leetcode",
        title: "Open LeetCode",
        subtitle: "leetcode.com/u/vision0808",
        group: "Commands",
        keywords: "leetcode dsa problems coding",
        icon: ExternalLink,
        action: () =>
          window.open("https://leetcode.com/u/vision0808/", "_blank", "noopener"),
        external: true,
      },
    ],
    []
  );

  return (
    <>
      {/* Boot screen (first visit only) */}
      {booting && <BootScreen onComplete={handleBootComplete} />}

      {/* ── Desktop (fades in after boot) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={!booting ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-screen relative bg-zinc-950 overflow-hidden select-none font-[-apple-system,BlinkMacSystemFont,sans-serif]"
      >
      {/* Background Wallpaper */}
      <Wallpaper currentWallpaper={currentWallpaper} />

      {/* Desktop Icons (including storyfolder) */}
      <DesktopIcons
        WindowState={WindowState}
        setWindowState={setWindowState}
        setActiveWindow={setActiveWindow}
        onOpenStory={() => setStoryOpen(true)}
      />

      {/* Top macOS Menu Bar */}
      <Navbar
        WindowState={WindowState}
        setWindowState={setWindowState}
        setActiveWindow={setActiveWindow}
        controlCenterOpen={controlCenterOpen}
        setControlCenterOpen={setControlCenterOpen}
        setSpotlightOpen={setSpotlightOpen}
      />

      {/* Control Center & Wallpaper Switcher Panel */}
      <ControlCenter
        isOpen={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
        currentWallpaper={currentWallpaper}
        onSelectWallpaper={handleSelectWallpaper}
        onOpenProjects={handleOpenProjects}
        onOpenCli={handleOpenCli}
      />

      {/* macOS Spotlight Search Modal */}
      <Spotlight
        open={spotlightOpen}
        setOpen={setSpotlightOpen}
        items={spotlightItems}
      />

      {/* Entry Notification Banner */}
      <Notification onOpenProjects={handleOpenProjects} />

      {/* Floating macOS Windows */}
      <AnimatePresence>
      {WindowState.projects && (
        <ProjectsWindow
          windowName="projects"
          WindowState={WindowState}
          setWindowState={setWindowState}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
        />
      )}

      {WindowState.github && (
        <GitHubWindow
          windowName="github"
          WindowState={WindowState}
          setWindowState={setWindowState}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
        />
      )}

      {WindowState.note && (
        <Note
          windowName="note"
          WindowState={WindowState}
          setWindowState={setWindowState}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
        />
      )}

      {WindowState.resume && (
        <Resume
          windowName="resume"
          WindowState={WindowState}
          setWindowState={setWindowState}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
        />
      )}

      {WindowState.spotify && (
        <SpotifyWindow
          windowName="spotify"
          WindowState={WindowState}
          setWindowState={setWindowState}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
        />
      )}

      {WindowState.cli && (
        <Cli
          windowName="cli"
          WindowState={WindowState}
          setWindowState={setWindowState}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
        />
      )}

      {WindowState.stats && <GitHubStatsWindow windowName="stats" WindowState={WindowState} setWindowState={setWindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} />}
      {WindowState.achievements && <AchievementsWindow windowName="achievements" WindowState={WindowState} setWindowState={setWindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} />}
      {WindowState.contact && <ContactWindow windowName="contact" WindowState={WindowState} setWindowState={setWindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} />}
      {WindowState.blog && <BlogWindow windowName="blog" WindowState={WindowState} setWindowState={setWindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} />}
      </AnimatePresence>

      {/* Dedicated Immersive Story Page (Hero, About, Skills & VerifAi Path Animation) */}
      <AnimatePresence>
        {storyOpen && (
          <StoryPage
            onClose={() => setStoryOpen(false)}
            onOpenWindow={handleOpenWindow}
          />
        )}
      </AnimatePresence>

      {/* Bottom macOS Dock */}
      <Dock
        WindowState={WindowState}
        setWindowState={setWindowState}
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        onOpenStory={() => setStoryOpen(true)}
        isStoryOpen={storyOpen}
      />
      </motion.div>
    </>
  );
};

export default App;

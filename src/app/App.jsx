import { useState, useMemo } from "react";
import Wallpaper from "../features/desktop/Wallpaper";
import DesktopWidgets from "../features/desktop/DesktopWidgets";
import Dock from "../features/desktop/Dock";
import Navbar from "../features/desktop/Navbar";
import ControlCenter from "../features/desktop/ControlCenter";
import Notification from "../features/desktop/Notification";
import Spotlight, { Palette } from "../features/desktop/Spotlight";
import ProjectsWindow from "../features/windows/ProjectsWindow";
import GitHubWindow from "../features/windows/GitHubWindow";
import MusicWindow from "../features/windows/MusicWindow";
import Note from "../features/windows/Note";
import Resume from "../features/windows/Resume";
import Cli from "../features/windows/Cli";
import GitHubStatsWindow from "../features/windows/GitHubStatsWindow";
import AchievementsWindow from "../features/windows/AchievementsWindow";
import ContactWindow from "../features/windows/ContactWindow";
import BlogWindow from "../features/windows/BlogWindow";
import AiChatWindow from "../features/windows/AiChatWindow";
import CalendarWindow from "../features/windows/CalendarWindow";
import DesktopIcons from "../features/desktop/DesktopIcons";
import StoryPage from "../features/story/StoryPage";
import BootScreen from "../features/desktop/BootScreen";
import { AnimatePresence, motion } from "framer-motion";
import { AppWindow, ExternalLink } from "lucide-react";

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
    music: false,
    spotify: false,
    note: false,
    resume: false,
    cli: false,
    stats: false,
    achievements: false,
    contact: false,
    blog: false,
    ai: false,
    calendar: false,
  });

  const [storyOpen, setStoryOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState("projects");
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Check if any window or story is active (for macOS widget ambient fading)
  const isAnyWindowOpen = useMemo(
    () => Object.values(WindowState).some(Boolean) || storyOpen,
    [WindowState, storyOpen]
  );

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
    const target = name === "spotify" ? "music" : name;
    setWindowState((prev) => ({ ...prev, [target]: true, [name]: true }));
    setActiveWindow(target);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: target }));
  };

  const handleOpenProjects = () => handleOpenWindow("projects");
  const handleOpenCli = () => handleOpenWindow("cli");

  // Spotlight search items (Applications & Commands)
  const spotlightItems = useMemo(
    () => [
      {
        id: "app-ai",
        title: "Ask Harshit AI",
        subtitle: "Interactive AI assistant powered by Gemini",
        group: "Applications",
        keywords: "ai bot assistant chat gemini prompt ask harshit",
        image: "/doc-icons/harshit-ai.svg",
        action: () => handleOpenWindow("ai"),
      },
      {
        id: "app-calendar",
        title: "Calendar",
        subtitle: "macOS Calendar & developer schedule",
        group: "Applications",
        keywords: "calendar schedule events date meetings exams tasks agenda",
        image: "/doc-icons/calendar.svg",
        action: () => handleOpenWindow("calendar"),
      },
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
        id: "app-music",
        title: "Vision Music",
        subtitle: "Vision Music player with offline tracks & artists",
        group: "Applications",
        keywords: "vision music music player songs audio playlist billie eilish seedhe maut ed sheeran lovely raat ki rani",
        image: "/doc-icons/apple-music-app.svg",
        action: () => handleOpenWindow("music"),
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
        title: "My Journey",
        subtitle: "Hero, About, Skills & Animated Developer Timeline",
        group: "Applications",
        keywords: "journey story hero about skills portfolio timeline roadmap compass",
        image: "/images/my-journey.svg",
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
            music: false,
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
        image: "/doc-icons/linkedin.svg",
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

      {/* Desktop Widgets: Exact macOS Sonoma Analog Clock & Calendar */}
      <DesktopWidgets
        isAnyWindowOpen={isAnyWindowOpen}
        onOpenCalendar={() => handleOpenWindow("calendar")}
      />

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

      {(WindowState.music || WindowState.spotify) && (
        <MusicWindow
          windowName="music"
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
      {WindowState.ai && <AiChatWindow windowName="ai" WindowState={WindowState} setWindowState={setWindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} />}
      {WindowState.calendar && <CalendarWindow windowName="calendar" WindowState={WindowState} setWindowState={setWindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} />}
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

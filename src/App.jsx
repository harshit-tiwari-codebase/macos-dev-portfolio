import React, { useState, useMemo } from "react";
import Wallpaper from "./components/Wallpaper";
import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import DesktopIcons from "./components/DesktopIcons";
import ControlCenter from "./components/ControlCenter";
import Notification from "./components/Notification";
import Spotlight, { Palette } from "./components/Spotlight";
import ProjectsWindow from "./components/Windows/ProjectsWindow";
import GitHubWindow from "./components/Windows/GitHubWindow";
import SpotifyWindow from "./components/Windows/SpotifyWindow";
import Note from "./components/Windows/Note";
import Resume from "./components/Windows/Resume";
import Cli from "./components/Windows/Cli";
import { FolderGit2, Terminal as TerminalIcon, AppWindow, ExternalLink } from "lucide-react";

const App = () => {
  // Start with the Projects window open so visitors immediately see all repositories!
  const [WindowState, setWindowState] = useState({
    projects: true,
    github: false,
    spotify: false,
    note: false,
    resume: false,
    cli: false,
  });

  const [activeWindow, setActiveWindow] = useState("projects");
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Wallpaper state with localStorage persistence
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    try {
      return (
        localStorage.getItem("macos_wallpaper") ||
        "/images/stranger-things-3840x2160-18568.jpg"
      );
    } catch {
      return "/images/stranger-things-3840x2160-18568.jpg";
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

  const handleOpenProjects = () => {
    setWindowState((prev) => ({ ...prev, projects: true }));
    setActiveWindow("projects");
  };

  const handleOpenCli = () => {
    setWindowState((prev) => ({ ...prev, cli: true }));
    setActiveWindow("cli");
  };

  // Spotlight search items (Applications & Commands)
  const spotlightItems = useMemo(
    () => [
      {
        id: "app-projects",
        title: "All Projects",
        subtitle: "Explore 13+ GitHub repositories",
        group: "Applications",
        keywords: "projects code github repos portfolio",
        icon: FolderGit2,
        action: () => handleOpenProjects(),
      },
      {
        id: "app-cli",
        title: "Terminal",
        subtitle: "zsh command emulator",
        group: "Applications",
        keywords: "terminal cli shell console zsh bash",
        icon: TerminalIcon,
        action: () => handleOpenCli(),
      },
      {
        id: "app-resume",
        title: "Resume",
        subtitle: "Harshit Tiwari Professional CV",
        group: "Applications",
        keywords: "resume cv pdf education experience",
        icon: AppWindow,
        action: () => {
          setWindowState((s) => ({ ...s, resume: true }));
          setActiveWindow("resume");
        },
      },
      {
        id: "app-note",
        title: "Notes.js",
        subtitle: "Developer notes and skills overview",
        group: "Applications",
        keywords: "notes code dsa learning skills stack",
        icon: AppWindow,
        action: () => {
          setWindowState((s) => ({ ...s, note: true }));
          setActiveWindow("note");
        },
      },
      {
        id: "app-spotify",
        title: "Spotify",
        subtitle: "Background music player",
        group: "Applications",
        keywords: "spotify music playlist songs audio",
        icon: AppWindow,
        action: () => {
          setWindowState((s) => ({ ...s, spotify: true }));
          setActiveWindow("spotify");
        },
      },
      {
        id: "app-github",
        title: "GitHub Workspace",
        subtitle: "GitHub activity calendar and repos",
        group: "Applications",
        keywords: "github profile contributions calendar",
        icon: AppWindow,
        action: () => {
          setWindowState((s) => ({ ...s, github: true }));
          setActiveWindow("github");
        },
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
        action: () =>
          setWindowState({
            projects: false,
            github: false,
            spotify: false,
            note: false,
            resume: false,
            cli: false,
          }),
      },
      {
        id: "cmd-github-profile",
        title: "Visit GitHub Profile",
        subtitle: "github.com/harshit-tiwari-codebase",
        group: "Commands",
        keywords: "github link web url profile",
        icon: ExternalLink,
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
    <div className="w-full h-screen relative bg-zinc-950 overflow-hidden select-none font-[-apple-system,BlinkMacSystemFont,sans-serif]">
      {/* Background Wallpaper */}
      <Wallpaper currentWallpaper={currentWallpaper} />

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

      {/* Desktop Folders & Shortcuts */}
      <DesktopIcons
        WindowState={WindowState}
        setWindowState={setWindowState}
        setActiveWindow={setActiveWindow}
      />

      {/* Floating macOS Windows */}
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

      {/* Bottom macOS Dock */}
      <Dock
        WindowState={WindowState}
        setWindowState={setWindowState}
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import Wallpaper from "./components/Wallpaper";
import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import DesktopIcons from "./components/DesktopIcons";
import ControlCenter, { WALLPAPERS } from "./components/ControlCenter";
import Notification from "./components/Notification";
import ProjectsWindow from "./components/Windows/ProjectsWindow";
import GitHubWindow from "./components/Windows/GitHubWindow";
import SpotifyWindow from "./components/Windows/SpotifyWindow";
import Note from "./components/Windows/Note";
import Resume from "./components/Windows/Resume";
import Cli from "./components/Windows/Cli";

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

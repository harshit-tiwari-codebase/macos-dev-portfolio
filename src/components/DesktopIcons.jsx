import React from "react";
import { FolderGit2, FileText, Terminal, Code2, Disc3, FileCode } from "lucide-react";

const DesktopIcons = ({ WindowState, setWindowState, setActiveWindow }) => {
  const openApp = (name) => {
    setWindowState((prev) => ({ ...prev, [name]: true }));
    if (setActiveWindow) setActiveWindow(name);
  };

  const icons = [
    {
      id: "projects",
      label: "All Projects",
      badge: "13 Repos",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-500/30 transition shadow-lg backdrop-blur-md">
          <FolderGit2 className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "resume",
      label: "Resume.pdf",
      badge: "PDF",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 group-hover:scale-105 group-hover:bg-red-500/30 transition shadow-lg backdrop-blur-md">
          <FileText className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "note",
      label: "Notes.js",
      badge: "Code",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 group-hover:scale-105 group-hover:bg-yellow-500/30 transition shadow-lg backdrop-blur-md">
          <FileCode className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "cli",
      label: "Terminal",
      badge: "zsh",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/30 transition shadow-lg backdrop-blur-md">
          <Terminal className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "github",
      label: "GitHub",
      badge: "Profile",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/30 transition shadow-lg backdrop-blur-md">
          <Code2 className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "spotify",
      label: "Spotify",
      badge: "Music",
      icon: (
        <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/40 flex items-center justify-center text-green-400 group-hover:scale-105 group-hover:bg-green-500/30 transition shadow-lg backdrop-blur-md">
          <Disc3 className="w-6 h-6" />
        </div>
      ),
    },
  ];

  return (
    <div className="absolute top-12 left-4 z-10 flex flex-col gap-4 select-none">
      {icons.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => openApp(item.id)}
          onDoubleClick={() => openApp(item.id)}
          className="group flex flex-col items-center gap-1 w-20 p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer text-center"
        >
          {item.icon}
          <span className="text-[11px] font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide line-clamp-1">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DesktopIcons;

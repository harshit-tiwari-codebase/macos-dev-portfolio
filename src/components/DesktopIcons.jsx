import React from "react";
import { useTranslation } from "react-i18next";
import storyFolderIcon from "../../story-folder.svg";

const StoryFolderIcon = () => (
  <div className="relative">
    <img
      src={storyFolderIcon}
      alt=""
      draggable="false"
      className="h-11 w-11 select-none object-contain drop-shadow-[0_4px_14px_rgba(56,87,242,0.4)] transition-transform group-hover:scale-105 sm:h-14 sm:w-14"
    />
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-[9px] font-bold text-zinc-950 shadow-md">
      ✦
    </span>
  </div>
);

const FolderIcon = () => (
  <img
    src="/images/projects-folder-icon.svg"
    alt=""
    draggable="false"
    className="h-11 w-11 select-none object-contain transition-transform group-hover:scale-105 sm:h-14 sm:w-14"
  />
);

const AppIcon = ({ children, className = "bg-white/95" }) => (
  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover:scale-105 ${className}`}>
    {children}
  </div>
);

const DesktopIcons = ({ WindowState, setWindowState, setActiveWindow, onOpenStory }) => {
  const { t } = useTranslation();
  const openApp = (name) => {
    if (name === "storyfolder") {
      onOpenStory?.();
      return;
    }
    setWindowState((prev) => ({ ...prev, [name]: true }));
    if (setActiveWindow) setActiveWindow(name);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: name }));
  };

  const icons = [
    {
      id: "storyfolder",
      label: "storyfolder",
      badge: "Story",
      isPrimary: true,
      icon: <StoryFolderIcon />,
    },
    {
      id: "projects",
      label: t("projects"),
      badge: "13 Repos",
      icon: <FolderIcon />,
    },
  ];

  return (
    <div
      className="absolute top-10 sm:top-12 left-2 sm:left-4 z-10 flex flex-col gap-2.5 sm:gap-4 select-none"
    >
      {icons.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => openApp(item.id)}
          onDoubleClick={() => openApp(item.id)}
          className={`group flex flex-col items-center gap-1 w-16 sm:w-20 p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer text-center ${
            item.isPrimary ? "relative" : ""
          }`}
        >
          {item.icon}
          <span className="text-[10px] sm:text-[11px] font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide line-clamp-1">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DesktopIcons;

import React from "react";
import { useTranslation } from "react-i18next";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

const MyJourneyIcon = () => (
  <div className="relative">
    <img
      src="/images/my-journey.svg"
      alt=""
      draggable="false"
      className="h-11 w-11 select-none object-contain drop-shadow-[0_6px_16px_rgba(91,52,232,0.5)] transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
    />
    {/* Live indicator dot */}
    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-50"
        style={{ animationDuration: "2.4s" }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full bg-violet-300"
        style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.5), 0 0 6px rgba(167,139,250,0.9)" }}
      />
    </span>
  </div>
);

const FolderIcon = () => (
  <img
    src="/images/projects-folder-icon.svg"
    alt=""
    draggable="false"
    className="h-11 w-11 select-none object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
  />
);

const DesktopIcons = ({ WindowState, setWindowState, setActiveWindow, onOpenStory }) => {
  const { t } = useTranslation();
  const openApp = (name) => {
    if (name === "myjourney") {
      onOpenStory?.();
      return;
    }
    setWindowState((prev) => ({ ...prev, [name]: true }));
    if (setActiveWindow) setActiveWindow(name);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: name }));
  };

  const icons = [
    {
      id: "myjourney",
      label: "My Journey",
      isPrimary: true,
      icon: <MyJourneyIcon />,
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
      className="absolute left-2 top-10 z-10 flex select-none flex-col gap-2 sm:left-4 sm:top-12 sm:gap-3"
      style={{ fontFamily: FONT_STACK }}
    >
      {icons.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => openApp(item.id)}
          aria-label={item.label}
          className="group flex w-[68px] cursor-pointer flex-col items-center gap-1 rounded-[10px] p-0.5 text-center focus-visible:outline-none sm:w-20"
        >
          {/* Icon tile: soft grey selection plate on hover / press / keyboard focus */}
          <span className="flex items-center justify-center rounded-[14px] p-1.5 transition-colors duration-150 group-hover:bg-white/[0.12] group-active:bg-white/[0.22] group-focus-visible:bg-white/[0.2] group-focus-visible:ring-1 group-focus-visible:ring-white/40">
            {item.icon}
          </span>

          {/* Label: white with soft shadow, blue pill while pressed or focused */}
          <span
            className="line-clamp-2 max-w-full rounded-[5px] px-1.5 py-px text-[11px] font-medium leading-[14px] text-white transition-colors duration-100 group-active:bg-[#0a84ff] group-focus-visible:bg-[#0a84ff] sm:text-[12px] sm:leading-[15px]"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.4)" }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DesktopIcons;
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FolderOpen,
  Gamepad2,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import storyFolderIcon from "../../story-folder.svg";

const Dock = ({
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
  onOpenStory,
  isStoryOpen,
}) => {
  const { t } = useTranslation();
  const openWindow = (windowName) => {
    setWindowState((state) => ({ ...state, [windowName]: true }));
    setActiveWindow?.(windowName);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: windowName }));
  };

  const apps = [
    { id: "github", label: t("github"), image: "/doc-icons/github.svg", color: "#171717", action: () => openWindow("github"), running: WindowState.github },
    { id: "spotify", label: t("spotify"), image: "/doc-icons/spotify.svg", color: "#1ed760", action: () => openWindow("spotify"), running: WindowState.spotify },
    { id: "note", label: t("notes"), image: "/doc-icons/note.svg", color: "#f4c542", action: () => openWindow("note"), running: WindowState.note },
    { id: "resume", label: t("resume"), image: "/doc-icons/pdf.svg", color: "#df292f", action: () => openWindow("resume"), running: WindowState.resume },
    { id: "cli", label: t("terminal"), image: "/doc-icons/cli.svg", color: "#282b32", action: () => openWindow("cli"), running: WindowState.cli },
    { id: "linkedin", label: "LinkedIn", image: "/doc-icons/link.svg", color: "#0a66c2", action: () => window.open("https://www.linkedin.com/in/harshit-tiwari-48830b3b4/", "_blank", "noopener,noreferrer") },
    { id: "calendar", label: "Calendar", image: "/doc-icons/calender.svg", color: "#d94a32", action: () => window.open("https://calendar.google.com/calendar/u/0/r", "_blank", "noopener,noreferrer") },
  ];

  const futureApps = [
    { id: "story", label: "My Story", image: storyFolderIcon, Icon: Sparkles, color: "#2231c9", action: onOpenStory, running: isStoryOpen },
    { id: "ai", label: t("askAi"), image: "/doc-icons/harshit-bot.svg", color: "#2231c9" },
    { id: "stats", label: t("stats"), image: "/doc-icons/github-stats.svg", color: "#10141a", action: () => openWindow("stats"), running: WindowState.stats },
    { id: "contact", label: t("contact"), image: "/doc-icons/mail.svg", color: "#168de2", action: () => openWindow("contact"), running: WindowState.contact },
    { id: "blog", label: t("blog"), image: "/doc-icons/blog.svg", color: "#f7f7fa", action: () => openWindow("blog"), running: WindowState.blog },
    { id: "achievements", label: t("achievements"), image: "/doc-icons/achievements.svg", color: "#f57c0f", action: () => openWindow("achievements"), running: WindowState.achievements },
    { id: "finder", label: "Finder", Icon: FolderOpen, color: "#31a9f3" },
    { id: "game", label: "Mini Game", Icon: Gamepad2, color: "#ed6280" },
  ];

  const tileClass = "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] shadow-[0_2px_5px_rgba(0,0,0,.25)] transition duration-150 ease-out hover:-translate-y-2 hover:scale-[1.18] active:scale-95 sm:h-12 sm:w-12 sm:rounded-[14px]";

  return (
    <nav
      aria-label="Dock"
      className="absolute bottom-1.5 sm:bottom-2 left-1/2 z-50 flex max-w-[calc(100vw-12px)] -translate-x-1/2 items-end gap-1 overflow-x-auto rounded-[20px] border border-white/35 bg-white/25 px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,.28)] backdrop-blur-2xl scrollbar-none sm:gap-1.5 sm:rounded-[22px] sm:px-3 sm:py-2.5"
    >
      <button type="button" title={t("search")} aria-label={t("search")} onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))} className={`${tileClass} bg-gradient-to-br from-[#98a3b1] to-[#67717f]`}>
        <Search className="h-6 w-6 text-white drop-shadow sm:h-7 sm:w-7" strokeWidth={2.5} />
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{t("search")}</span>
      </button>

      <span aria-hidden="true" className="mx-0.5 h-8 w-px shrink-0 bg-white/45 sm:mx-1 sm:h-9" />

      {apps.map((app) => (
        <button key={app.id} type="button" title={app.label} aria-label={app.label} onClick={app.action} className={`${tileClass}`} style={{ backgroundColor: app.color }}>
          <img src={app.image} alt="" draggable="false" className="h-8 w-8 select-none object-contain drop-shadow sm:h-10 sm:w-10" />
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{app.label}</span>
          {app.running && <span aria-label="Open" className={`absolute -bottom-1 h-1 w-1 rounded-full ${activeWindow === app.id ? "bg-white" : "bg-white/65"}`} />}
        </button>
      ))}

      <span aria-hidden="true" className="mx-0.5 h-8 w-px shrink-0 bg-white/45 sm:mx-1 sm:h-9" />

      {futureApps.map(({ id, label, Icon, image, color, action, running }) => (
        <button key={id} type="button" title={action ? label : `${label} — ${t("soon")}`} aria-label={action ? label : `${label}, ${t("soon")}`} onClick={action} disabled={!action} className={`${tileClass} ${action ? "" : "cursor-not-allowed opacity-75"}`} style={{ backgroundColor: color }}>
          {image ? (
            <img src={image} alt="" draggable="false" className="h-10 w-10 select-none object-contain drop-shadow sm:h-12 sm:w-12" />
          ) : (
            <Icon className="h-6 w-6 text-white drop-shadow sm:h-7 sm:w-7" strokeWidth={2.1} />
          )}
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{action ? label : `${label} · ${t("soon")}`}</span>
          {running && <span className={`absolute -bottom-1 h-1 w-1 rounded-full ${activeWindow === id ? "bg-white" : "bg-white/65"}`} />}
        </button>
      ))}

      <span aria-hidden="true" className="mx-0.5 h-8 w-px shrink-0 bg-white/45 sm:mx-1 sm:h-9" />
      <button type="button" title="Trash" aria-label="Trash" disabled className={`${tileClass} bg-gradient-to-b from-white/80 to-white/30 opacity-80`}>
        <Trash2 className="h-6 w-6 text-white drop-shadow sm:h-7 sm:w-7" strokeWidth={1.7} />
      </button>
    </nav>
  );
};

export default Dock;

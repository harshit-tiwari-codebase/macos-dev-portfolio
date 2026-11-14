import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTime from "./DateTime";
import { SlidersHorizontal, Image, Search, Globe2 } from "lucide-react";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

const ALL_CLOSED = {
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
};

/* Tahoe menu surface: Liquid Glass with a light rim and deep shadow */
const menuStyle = {
  fontFamily: FONT_STACK,
  background: "rgba(38,38,42,0.72)",
  backdropFilter: "blur(50px) saturate(190%)",
  WebkitBackdropFilter: "blur(50px) saturate(190%)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.3), 0 0 0 0.5px rgba(255,255,255,0.14), 0 0 0 1px rgba(0,0,0,0.4), 0 18px 44px rgba(0,0,0,0.45)",
};

const menuItemClass =
  "group flex w-full cursor-pointer items-center justify-between gap-6 rounded-[6px] px-2.5 py-[3px] text-left text-[13px] text-white/90 transition-colors hover:bg-[#0a84ff] hover:text-white focus-visible:bg-[#0a84ff] focus-visible:text-white focus-visible:outline-none";

const MenuItem = ({ onClick, icon: Icon, shortcut, danger, children }) => (
  <button type="button" role="menuitem" onClick={onClick} className={`${menuItemClass} ${danger ? "!text-[#ff7a72] hover:!text-white" : ""}`}>
    <span className="flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />}
      {children}
    </span>
    {shortcut && <span className="text-[12px] text-white/40 group-hover:text-white/80">{shortcut}</span>}
  </button>
);

const MenuSeparator = () => <div role="separator" className="mx-2.5 my-1 h-px bg-white/[0.12]" />;

const barButton =
  "flex h-[22px] cursor-pointer items-center rounded-[6px] px-2 text-[13px] transition-colors hover:bg-white/[0.16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]";

const Navbar = ({
  WindowState,
  setWindowState,
  setActiveWindow,
  controlCenterOpen,
  setControlCenterOpen,
  setSpotlightOpen,
}) => {
  const { t, i18n } = useTranslation();
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const menuOpen = appleMenuOpen || fileMenuOpen;

  const openApp = (name) => {
    setWindowState((prev) => ({ ...prev, [name]: true }));
    if (setActiveWindow) setActiveWindow(name);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: name }));
    setAppleMenuOpen(false);
    setFileMenuOpen(false);
  };

  // Escape closes menus and the About dialog
  useEffect(() => {
    if (!menuOpen && !aboutModalOpen) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setAppleMenuOpen(false);
      setFileMenuOpen(false);
      setAboutModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, aboutModalOpen]);

  const isHindi = i18n.language.startsWith("hi");

  return (
    <>
      {/* Click-away layer for open menus (sits under the bar so menu buttons still work) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setAppleMenuOpen(false);
            setFileMenuOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      <nav
        className="absolute left-0 top-0 z-50 flex h-7 w-full select-none items-center justify-between px-2 text-white sm:px-3"
        style={{
          fontFamily: FONT_STACK,
          background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 100%)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Left: Apple menu and app menus */}
        <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          {/* Apple menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setAppleMenuOpen(!appleMenuOpen);
                setFileMenuOpen(false);
                if (setControlCenterOpen) setControlCenterOpen(false);
              }}
              onMouseEnter={() => {
                if (fileMenuOpen) {
                  setFileMenuOpen(false);
                  setAppleMenuOpen(true);
                }
              }}
              aria-haspopup="menu"
              aria-expanded={appleMenuOpen}
              className={`${barButton} px-2 ${appleMenuOpen ? "bg-white/[0.2]" : ""}`}
              title="Apple Menu"
            >
              <img src="/navbar-icons/apple.svg" alt="Apple" className="h-[14px] w-[14px]" />
            </button>

            {appleMenuOpen && (
              <div role="menu" className="absolute left-0 top-[30px] z-50 w-60 rounded-[14px] p-1.5" style={menuStyle}>
                <MenuItem onClick={() => { setAboutModalOpen(true); setAppleMenuOpen(false); }}>
                  About Harshit Tiwari
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  icon={Search}
                  shortcut="⌘K"
                  onClick={() => {
                    if (setSpotlightOpen) setSpotlightOpen(true);
                    setAppleMenuOpen(false);
                  }}
                >
                  Spotlight Search
                </MenuItem>
                <MenuItem
                  icon={Image}
                  onClick={() => {
                    if (setControlCenterOpen) setControlCenterOpen(true);
                    setAppleMenuOpen(false);
                  }}
                >
                  Change Wallpaper…
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={() => openApp("projects")}>Open Projects</MenuItem>
                <MenuItem onClick={() => openApp("cli")}>Open Terminal</MenuItem>
                <MenuItem onClick={() => openApp("resume")}>View Resume</MenuItem>
                <MenuSeparator />
                <MenuItem
                  onClick={() => {
                    setWindowState({ ...ALL_CLOSED, projects: true });
                    setAppleMenuOpen(false);
                  }}
                >
                  Focus Projects Only
                </MenuItem>
              </div>
            )}
          </div>

          {/* App name */}
          <button
            type="button"
            onClick={() => setAboutModalOpen(true)}
            className={`${barButton} max-w-[130px] truncate text-left font-semibold sm:max-w-none`}
          >
            Harshit Tiwari
          </button>

          <button
            type="button"
            onClick={() => openApp("projects")}
            className={`${barButton} hidden text-white/90 sm:flex`}
          >
            {t("projects")}
          </button>

          {/* File menu */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                setFileMenuOpen(!fileMenuOpen);
                setAppleMenuOpen(false);
              }}
              onMouseEnter={() => {
                if (appleMenuOpen) {
                  setAppleMenuOpen(false);
                  setFileMenuOpen(true);
                }
              }}
              aria-haspopup="menu"
              aria-expanded={fileMenuOpen}
              className={`${barButton} text-white/90 ${fileMenuOpen ? "bg-white/[0.2]" : ""}`}
            >
              File
            </button>

            {fileMenuOpen && (
              <div role="menu" className="absolute left-0 top-[30px] z-50 w-56 rounded-[14px] p-1.5" style={menuStyle}>
                <MenuItem onClick={() => openApp("projects")}>New Window: Projects</MenuItem>
                <MenuItem onClick={() => openApp("cli")}>New Window: Terminal</MenuItem>
                <MenuItem onClick={() => openApp("note")}>New Window: Notes</MenuItem>
                <MenuSeparator />
                <MenuItem
                  danger
                  onClick={() => {
                    setWindowState({ ...ALL_CLOSED });
                    setFileMenuOpen(false);
                  }}
                >
                  Close All Windows
                </MenuItem>
              </div>
            )}
          </div>

          <button type="button" onClick={() => openApp("cli")} className={`${barButton} hidden text-white/90 lg:flex`}>
            {t("terminal")}
          </button>

          <button type="button" onClick={() => openApp("resume")} className={`${barButton} hidden text-white/90 lg:flex`}>
            {t("resume")}
          </button>
        </div>

        {/* Right: status items */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <div className="mr-1.5 hidden items-center gap-1.5 text-[12px] text-white/75 lg:flex" title="Full Stack Developer">
            <span
              className="h-[7px] w-[7px] rounded-full bg-[#30d158]"
              style={{ boxShadow: "0 0 6px rgba(48,209,88,0.8)" }}
            />
            <span>{t("available")}</span>
          </div>

          <div title="Wi-Fi Connected" className="hidden h-[22px] items-center px-1.5 opacity-90 sm:flex">
            <img src="/navbar-icons/wifi.svg" alt="Wi-Fi" className="h-3.5 w-3.5" />
          </div>

          <button
            type="button"
            onClick={() => i18n.changeLanguage(isHindi ? "en" : "hi")}
            className={`${barButton} gap-1 px-1.5 text-white/90`}
            title={t("language")}
            aria-label={`${t("language")}: ${isHindi ? "हिंदी" : "English"}`}
          >
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-[11px] font-medium">{isHindi ? "हिंदी" : "EN"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (setSpotlightOpen) setSpotlightOpen((prev) => !prev);
            }}
            className={`${barButton} px-1.5 text-white/90`}
            title="Spotlight Search (⌘K)"
            aria-label="Spotlight Search"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (setControlCenterOpen) setControlCenterOpen((prev) => !prev);
            }}
            className={`${barButton} px-1.5 ${controlCenterOpen ? "bg-white/[0.22] text-white" : "text-white/90"}`}
            title={t("wallpaper")}
            aria-label={t("wallpaper")}
            aria-pressed={!!controlCenterOpen}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <DateTime />
        </div>
      </nav>

      {/* About dialog */}
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            className="max-h-[90vh] w-full max-w-[380px] overflow-y-auto rounded-[26px] p-6 text-center text-white"
            style={{
              fontFamily: FONT_STACK,
              background: "rgba(36,37,42,0.78)",
              backdropFilter: "blur(60px) saturate(190%)",
              WebkitBackdropFilter: "blur(60px) saturate(190%)",
              boxShadow:
                "inset 0 0.5px 0 rgba(255,255,255,0.3), 0 0 0 0.5px rgba(255,255,255,0.16), 0 0 0 1px rgba(0,0,0,0.45), 0 30px 80px rgba(0,0,0,0.55)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px]"
              style={{
                background: "linear-gradient(180deg, #8e9bb0 0%, #343d4e 100%)",
                boxShadow:
                  "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(0,0,0,0.3), 0 6px 16px rgba(0,0,0,0.4)",
              }}
            >
              <img src="/navbar-icons/apple.svg" alt="" className="h-8 w-8" />
            </div>
            <h2 id="about-title" className="mt-3.5 text-[20px] font-semibold tracking-[-0.02em]">
              HarshitOS Tahoe
            </h2>
            <p className="mt-0.5 text-[12px] text-white/45">Version 2.0 (Developer Edition)</p>

            <dl className="mt-5 divide-y divide-white/[0.09] overflow-hidden rounded-[14px] bg-white/[0.06] text-left text-[13px] ring-1 ring-inset ring-white/[0.09]">
              <div className="flex justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-white/50">Developer</dt>
                <dd className="font-medium">Harshit Tiwari</dd>
              </div>
              <div className="flex justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-white/50">Role</dt>
                <dd className="text-[#64b0ff]">Full Stack Web Developer</dd>
              </div>
              <div className="flex justify-between gap-4 px-3.5 py-2.5">
                <dt className="shrink-0 text-white/50">College</dt>
                <dd className="text-right">IPS IES Academy (CSIT, 2nd Year)</dd>
              </div>
              <div className="flex justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-white/50">CGPA</dt>
                <dd className="font-medium text-[#6fdca0]">9.29</dd>
              </div>
              <div className="flex justify-between gap-4 px-3.5 py-2.5">
                <dt className="shrink-0 text-white/50">Core Stack</dt>
                <dd className="text-right">React, Node.js, Express, Tailwind, MongoDB</dd>
              </div>
              <div className="flex justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-white/50">GitHub</dt>
                <dd>
                  <a
                    href="https://github.com/harshit-tiwari-codebase"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#64b0ff] hover:text-[#9ccbff]"
                  >
                    @harshit-tiwari-codebase
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="h-8 cursor-pointer rounded-full bg-white/[0.1] px-5 text-[13px] font-medium text-white/85 ring-1 ring-inset ring-white/[0.12] transition-colors hover:bg-white/[0.17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAboutModalOpen(false);
                  openApp("projects");
                }}
                className="h-8 cursor-pointer rounded-full px-5 text-[13px] font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
                style={{
                  background: "linear-gradient(180deg, #3d9bff 0%, #0a74f0 100%)",
                  boxShadow:
                    "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(0,60,140,0.6), 0 4px 12px rgba(10,116,240,0.3)",
                }}
              >
                Explore Projects
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

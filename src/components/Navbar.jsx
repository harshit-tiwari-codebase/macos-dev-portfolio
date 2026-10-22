import React, { useState } from "react";
import DateTime from "./DateTime";
import { SlidersHorizontal, Image } from "lucide-react";

const Navbar = ({
  WindowState,
  setWindowState,
  setActiveWindow,
  controlCenterOpen,
  setControlCenterOpen,
}) => {
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const openApp = (name) => {
    setWindowState((prev) => ({ ...prev, [name]: true }));
    if (setActiveWindow) setActiveWindow(name);
    setAppleMenuOpen(false);
    setFileMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full absolute top-0 left-0 h-7 px-3 flex text-white justify-between items-center bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg select-none z-50 text-xs">
        {/* Left Side: Apple Menu & App Items */}
        <div className="flex items-center gap-4">
          {/* Apple Logo Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setAppleMenuOpen(!appleMenuOpen);
                setFileMenuOpen(false);
                if (setControlCenterOpen) setControlCenterOpen(false);
              }}
              className="p-1 rounded hover:bg-white/10 transition cursor-pointer flex items-center justify-center"
              title="Apple Menu"
            >
              <img
                src="/navbar-icons/apple.svg"
                alt="Apple"
                className="w-3.5 h-3.5"
              />
            </button>

            {appleMenuOpen && (
              <div
                className="absolute top-8 left-0 w-56 bg-zinc-900/95 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 text-xs text-gray-200 z-50 animate-fade-in"
                onMouseLeave={() => setAppleMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAboutModalOpen(true);
                    setAppleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer flex items-center justify-between"
                >
                  <span>About Harshit Tiwari</span>
                  <span className="text-[10px] text-gray-400">ℹ</span>
                </button>

                <div className="h-px bg-white/10 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    if (setControlCenterOpen) setControlCenterOpen(true);
                    setAppleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer flex items-center gap-2"
                >
                  <Image className="w-3.5 h-3.5 text-blue-400" />
                  <span>Change Wallpaper...</span>
                </button>

                <div className="h-px bg-white/10 my-1" />

                <button
                  type="button"
                  onClick={() => openApp("projects")}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  Open Projects
                </button>
                <button
                  type="button"
                  onClick={() => openApp("cli")}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  Open Terminal
                </button>
                <button
                  type="button"
                  onClick={() => openApp("resume")}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  View Resume
                </button>

                <div className="h-px bg-white/10 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setWindowState({
                      projects: true,
                      github: false,
                      spotify: false,
                      note: false,
                      resume: false,
                      cli: false,
                    });
                    setAppleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  Focus Projects Only
                </button>
              </div>
            )}
          </div>

          {/* Primary Nav Links */}
          <button
            type="button"
            onClick={() => setAboutModalOpen(true)}
            className="font-bold hover:bg-white/10 px-2 py-0.5 rounded transition cursor-pointer text-white"
          >
            Harshit Tiwari
          </button>

          <button
            type="button"
            onClick={() => openApp("projects")}
            className="hover:bg-white/10 px-2 py-0.5 rounded transition cursor-pointer text-gray-200 hidden sm:block"
          >
            Projects
          </button>

          {/* File Menu */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setFileMenuOpen(!fileMenuOpen);
                setAppleMenuOpen(false);
              }}
              className="hover:bg-white/10 px-2 py-0.5 rounded transition cursor-pointer text-gray-200"
            >
              File
            </button>

            {fileMenuOpen && (
              <div
                className="absolute top-8 left-0 w-48 bg-zinc-900/95 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 text-xs text-gray-200 z-50"
                onMouseLeave={() => setFileMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => openApp("projects")}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  New Window: Projects
                </button>
                <button
                  type="button"
                  onClick={() => openApp("cli")}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  New Window: Terminal
                </button>
                <button
                  type="button"
                  onClick={() => openApp("note")}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  New Window: Notes
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setWindowState({
                      projects: false,
                      github: false,
                      spotify: false,
                      note: false,
                      resume: false,
                      cli: false,
                    });
                    setFileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-600 hover:text-white transition cursor-pointer text-red-300"
                >
                  Close All Windows
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => openApp("cli")}
            className="hover:bg-white/10 px-2 py-0.5 rounded transition cursor-pointer text-gray-200 hidden md:block"
          >
            Terminal
          </button>

          <button
            type="button"
            onClick={() => openApp("resume")}
            className="hover:bg-white/10 px-2 py-0.5 rounded transition cursor-pointer text-gray-200 hidden md:block"
          >
            Resume
          </button>
        </div>

        {/* Right Side: Status Icons, Control Center, & Date/Time */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-300" title="Full Stack Developer">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Available for hire</span>
          </div>

          <div title="Wi-Fi Connected" className="opacity-90">
            <img src="/navbar-icons/wifi.svg" alt="Wi-Fi" className="w-3.5 h-3.5" />
          </div>

          {/* Control Center Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (setControlCenterOpen) {
                setControlCenterOpen((prev) => !prev);
              }
            }}
            className={`p-1 rounded transition cursor-pointer flex items-center justify-center ${
              controlCenterOpen ? "bg-white/20 text-white" : "hover:bg-white/10 text-gray-200"
            }`}
            title="Control Center & Wallpapers"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          <DateTime />
        </div>
      </nav>

      {/* About Harshit Modal */}
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl p-6 max-w-md w-full text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="/navbar-icons/apple.svg"
                  alt="Apple"
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-lg font-bold">HarshitOS Sonoma</h2>
                  <p className="text-xs text-gray-400">Version 2.0 (Developer Edition)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Developer</span>
                <span className="font-semibold text-white">Harshit Tiwari</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Role</span>
                <span className="text-blue-400">Full Stack Web Developer</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">College</span>
                <span>IPS IES Academy (CSIT, 2nd Year)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">CGPA</span>
                <span className="text-emerald-400 font-semibold">9.12</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Core Stack</span>
                <span>React, Node.js, Express, Tailwind, MongoDB</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">GitHub</span>
                <a
                  href="https://github.com/harshit-tiwari-codebase"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  @harshit-tiwari-codebase
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAboutModalOpen(false);
                  openApp("projects");
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition"
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

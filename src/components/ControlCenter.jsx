import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Image, Moon, Volume2, Wifi, Sparkles, FolderGit2, X } from "lucide-react";

export const WALLPAPERS = [
  {
    id: "stranger-things",
    name: "Stranger Things",
    subtitle: "Dark & Moody",
    url: "/images/stranger-things-3840x2160-18568.jpg",
    thumb: "/images/stranger-things-3840x2160-18568.jpg",
  },
  {
    id: "sonoma-waves",
    name: "macOS Graphic",
    subtitle: "Vibrant Abstract",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=80",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "yosemite-mist",
    name: "Yosemite Valley",
    subtitle: "Sequoia Nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80",
    thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "cyberpunk-neon",
    name: "Neon Synthwave",
    subtitle: "Cyberpunk Night",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2560&q=80",
    thumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=60",
  },
];

const ControlCenter = ({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper,
  onOpenProjects,
  onOpenCli,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-8 sm:top-9 right-2 sm:right-3 z-50 w-[calc(100vw-16px)] max-w-sm sm:w-92 bg-zinc-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-white select-none font-[-apple-system,BlinkMacSystemFont,sans-serif]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-200">
                  Control Center
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                  macOS
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">Wi-Fi</p>
                  <p className="text-[10px] text-gray-400">Connected</p>
                </div>
              </div>

              <div
                onClick={() => {
                  onClose();
                  if (onOpenProjects) onOpenProjects();
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">Projects</p>
                  <p className="text-[10px] text-gray-400">13 Repos</p>
                </div>
              </div>
            </div>

            {/* Wallpaper Switcher Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-gray-200">
                    Desktop Wallpaper
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">Click to switch</span>
              </div>

              {/* Wallpaper Grid */}
              <div className="grid grid-cols-2 gap-2">
                {WALLPAPERS.map((wp) => {
                  const isSelected = currentWallpaper === wp.url;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => onSelectWallpaper(wp.url)}
                      className={`group relative rounded-lg overflow-hidden border text-left transition cursor-pointer ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-500/50 shadow-md"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="h-16 w-full relative overflow-hidden bg-black/40">
                        <img
                          src={wp.thumb}
                          alt={wp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white shadow">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute bottom-1 left-2 right-1">
                          <p className="text-[11px] font-semibold text-white truncate drop-shadow">
                            {wp.name}
                          </p>
                          <p className="text-[9px] text-gray-300 truncate">
                            {wp.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer quick actions */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/10">
              <span>HarshitOS Sonoma 2.0</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCli) onOpenCli();
                }}
                className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
              >
                Launch Terminal →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ControlCenter;

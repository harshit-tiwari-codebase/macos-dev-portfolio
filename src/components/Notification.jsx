import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, X, Sparkles } from "lucide-react";

const Notification = ({ onOpenProjects }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification 1.2s after page load for realistic macOS entry
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    // Auto-dismiss after 9 seconds
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -40, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed top-8 sm:top-10 right-3 sm:right-4 z-50 w-[calc(100vw-24px)] max-w-sm sm:w-88 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/20 p-3 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none text-white font-[-apple-system,BlinkMacSystemFont,sans-serif]"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-gray-300 uppercase">
                Harshit Tiwari • Portfolio
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">now</span>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white leading-tight">
                Welcome to my macOS Devfolio!
              </h4>
              <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                Explore all 13 GitHub projects in the Projects app, check my terminal, or switch wallpapers.
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsVisible(false);
                    if (onOpenProjects) onOpenProjects();
                  }}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer shadow-sm shadow-blue-500/30"
                >
                  View All Projects
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 text-xs transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;

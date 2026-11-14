import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * macOS Tahoe (26) style notification banner.
 * - 344px wide banner, slides in from the right edge under the menu bar
 * - Liquid Glass material: heavy blur + saturation, thin light rim, inner highlight
 * - Close (×) button appears top-left on hover, like the real thing
 * - Auto-dismiss pauses while the pointer is over the banner
 * - Click the banner body to run the primary action
 */

const GLASS_STYLE = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%), rgba(38,38,42,0.52)",
  backdropFilter: "blur(40px) saturate(190%) brightness(1.05)",
  WebkitBackdropFilter: "blur(40px) saturate(190%) brightness(1.05)",
  border: "0.5px solid rgba(255,255,255,0.22)",
  boxShadow: [
    "inset 0 0.5px 0 rgba(255,255,255,0.45)", // top specular rim
    "inset 0 -0.5px 0 rgba(255,255,255,0.08)",
    "0 0 0 0.5px rgba(0,0,0,0.35)", // outer hairline
    "0 12px 32px rgba(0,0,0,0.35)",
    "0 2px 6px rgba(0,0,0,0.25)",
  ].join(", "),
};

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

const Notification = ({ onOpenProjects }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [notice, setNotice] = useState(null);
  const [hovered, setHovered] = useState(false);

  // Initial entry shortly after page load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss (paused while hovered, restarted for each new notice)
  useEffect(() => {
    if (!isVisible || hovered) return undefined;
    const timer = setTimeout(() => setIsVisible(false), notice ? 7000 : 9000);
    return () => clearTimeout(timer);
  }, [isVisible, hovered, notice]);

  // Custom events from the rest of the portfolio
  useEffect(() => {
    const onNotification = (event) => {
      setNotice(event.detail || null);
      setIsVisible(true);
    };
    window.addEventListener("portfolio:notification", onNotification);
    return () =>
      window.removeEventListener("portfolio:notification", onNotification);
  }, []);

  const dismiss = () => {
    setHovered(false);
    setIsVisible(false);
  };

  const runPrimary = () => {
    dismiss();
    if (!notice && onOpenProjects) onOpenProjects();
  };

  return (
    <AnimatePresence onExitComplete={() => setNotice(null)}>
      {isVisible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, x: 380 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 380, transition: { duration: 0.28, ease: [0.4, 0, 0.6, 1] } }}
          transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.9 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ ...GLASS_STYLE, fontFamily: FONT_STACK }}
          className="group fixed top-9 right-3 z-50 w-[calc(100vw-24px)] max-w-[344px] rounded-[24px] p-3 text-white select-none"
        >
          {/* Hover close button (top-left, as on macOS) */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close notification"
            className="absolute -top-2 -left-2 flex h-[22px] w-[22px] items-center justify-center rounded-full text-white/90 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
            style={{
              background: "rgba(70,70,76,0.78)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "0.5px solid rgba(255,255,255,0.25)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            }}
          >
            <X className="h-3 w-3" strokeWidth={2.6} />
          </button>

          <div className="flex items-start gap-[10px]">
            {/* App icon — continuous-corner squircle */}
            <div
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px]"
              style={{
                background: "linear-gradient(180deg, #4aa8ff 0%, #0a64e8 100%)",
                boxShadow:
                  "inset 0 0.5px 0 rgba(255,255,255,0.55), 0 0 0 0.5px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              <img src="/doc-icons/projects.svg" alt="" className="h-[22px] w-[22px]" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1 pt-px">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="truncate text-[13px] font-semibold leading-[16px] tracking-[-0.08px]">
                  {notice?.title || "Welcome to my macOS Devfolio!"}
                </h4>
                <span className="shrink-0 text-[11px] leading-[16px] text-white/55">
                  now
                </span>
              </div>
              <p className="mt-[1px] text-[13px] leading-[16px] tracking-[-0.08px] text-white/80 line-clamp-3">
                {notice?.message ||
                  "Explore all 13 GitHub projects in the Projects app, check my terminal, or switch wallpapers."}
              </p>
            </div>
          </div>

          {/* Actions — revealed on hover like macOS */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={runPrimary}
                  className="h-[26px] flex-1 rounded-full text-[12px] font-medium text-white transition-colors cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.16)",
                    boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.3)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.24)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
                >
                  {notice ? "Got it" : "View All Projects"}
                </button>
                {!notice && (
                  <button
                    type="button"
                    onClick={dismiss}
                    className="h-[26px] flex-1 rounded-full text-[12px] font-medium text-white/85 transition-colors cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.2)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
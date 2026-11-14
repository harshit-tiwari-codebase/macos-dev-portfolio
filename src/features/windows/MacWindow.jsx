import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";

const NAVBAR_HEIGHT = 28; // macOS top menu bar height (h-7)
const DOCK_RESERVE = 76;   // Height reserved for dock at bottom of desktop

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

/* Traffic-light surface: flat colour, soft inner highlight, hairline rim (as in Tahoe) */
const lightStyle = (color, rim, showColor) => ({
  background: showColor ? color : "rgba(255,255,255,0.2)",
  boxShadow: showColor
    ? `inset 0 0.5px 0 rgba(255,255,255,0.45), 0 0 0 0.5px ${rim}`
    : "inset 0 0.5px 0 rgba(255,255,255,0.15), 0 0 0 0.5px rgba(0,0,0,0.25)",
});

const ZoomGlyph = ({ restore }) => (
  <svg viewBox="0 0 8 8" className="h-[7px] w-[7px]" aria-hidden="true" fill="rgba(0,0,0,0.62)">
    {restore ? (
      <>
        <polygon points="1,4.2 4.2,4.2 4.2,1" />
        <polygon points="7,3.8 3.8,3.8 3.8,7" />
      </>
    ) : (
      <>
        <polygon points="1,1 4.6,1 1,4.6" />
        <polygon points="7,7 3.4,7 7,3.4" />
      </>
    )}
  </svg>
);

const MacWindow = ({
  children,
  windowName,
  setWindowState,
  activeWindow,
  setActiveWindow,
  title = "harshitOS",
  initialWidth = 720,
  initialHeight = 480,
  initialX = 240,
  initialY = 70,
}) => {
  // Viewport dimensions state (guarantees pure numeric calculations)
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  const isMobile = viewport.width < 768;

  // Window display modes
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMinimizedHidden, setIsMinimizedHidden] = useState(false);
  const [lightsHover, setLightsHover] = useState(false);

  // Helper to compute safe initial floating bounds in pure numbers
  const computeInitialBounds = useCallback(() => {
    const vpW = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vpH = typeof window !== "undefined" ? window.innerHeight : 800;

    if (vpW < 768) {
      return {
        x: 4,
        y: 32,
        width: Math.max(280, vpW - 8),
        height: Math.max(300, vpH - 32 - DOCK_RESERVE),
      };
    }

    const safeW = Math.max(340, Math.min(initialWidth, vpW - 32));
    const safeH = Math.max(240, Math.min(initialHeight, vpH - 110));
    const safeX = Math.max(16, Math.min(initialX, Math.max(16, vpW - safeW - 20)));
    const safeY = Math.max(34, Math.min(initialY, Math.max(34, vpH - safeH - 80)));

    return {
      x: Math.round(safeX),
      y: Math.round(safeY),
      width: Math.round(safeW),
      height: Math.round(safeH),
    };
  }, [initialWidth, initialHeight, initialX, initialY]);

  // Current floating bounds (managed by Rnd onDragStop / onResizeStop)
  const [bounds, setBounds] = useState(computeInitialBounds);

  // Saved bounds to restore back to when exiting maximized/fullscreen mode
  const savedBoundsRef = useRef(bounds);

  // Keep viewport updated on window resize & clamp floating bounds if needed
  useEffect(() => {
    const handleResize = () => {
      const curW = window.innerWidth;
      const curH = window.innerHeight;
      setViewport({ width: curW, height: curH });

      // If floating, ensure window stays within visible desktop boundaries
      setBounds((prev) => {
        if (curW < 768) {
          return {
            x: 4,
            y: 32,
            width: Math.max(280, curW - 8),
            height: Math.max(300, curH - 32 - DOCK_RESERVE),
          };
        }
        const safeW = Math.min(prev.width, curW - 32);
        const safeH = Math.min(prev.height, curH - 110);
        const safeX = Math.max(12, Math.min(prev.x, curW - safeW - 16));
        const safeY = Math.max(32, Math.min(prev.y, curH - safeH - 80));
        return {
          x: Math.round(safeX),
          y: Math.round(safeY),
          width: Math.round(safeW),
          height: Math.round(safeH),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to HTML5 Fullscreen API changes (e.g. user presses Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isFullscreen]);

  // Automatically un-minimize when this window becomes the active window
  useEffect(() => {
    if (activeWindow === windowName && isMinimized) {
      setIsMinimizedHidden(false);
      setIsMinimized(false);
    }
  }, [activeWindow, windowName, isMinimized]);

  // Backward compatibility: listen to global portfolio restore window events
  useEffect(() => {
    const restoreHandler = (event) => {
      if (event.detail === windowName) {
        setIsMinimizedHidden(false);
        setIsMinimized(false);
        if (setActiveWindow) setActiveWindow(windowName);
      }
    };
    window.addEventListener("portfolio:restore-window", restoreHandler);
    return () => window.removeEventListener("portfolio:restore-window", restoreHandler);
  }, [windowName, setActiveWindow]);

  const isActive = activeWindow === windowName;

  const handleFocus = useCallback(() => {
    if (setActiveWindow && activeWindow !== windowName) {
      setActiveWindow(windowName);
    }
  }, [setActiveWindow, activeWindow, windowName]);

  // Toggle standard desktop maximize (preserves dock and menu bar visibility)
  const toggleMaximize = useCallback(() => {
    if (isFullscreen) {
      setIsFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }

    if (!isMaximized) {
      // Save current floating bounds before expanding
      savedBoundsRef.current = { ...bounds };
      setIsMaximized(true);
    } else {
      // Restore previous floating bounds
      setBounds({ ...savedBoundsRef.current });
      setIsMaximized(false);
    }
  }, [isFullscreen, isMaximized, bounds]);

  // Toggle true full screen mode
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (!isMaximized) {
        savedBoundsRef.current = { ...bounds };
      }
      setIsFullscreen(true);
      setIsMaximized(false);
      // Attempt browser fullscreen if available
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        }
      } catch {
        /* Ignore permissions restriction */
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      setBounds({ ...savedBoundsRef.current });
    }
  }, [isFullscreen, isMaximized, bounds]);

  // Close window
  const handleClose = useCallback(
    (e) => {
      e?.stopPropagation();
      if (document.fullscreenElement && isFullscreen) {
        document.exitFullscreen?.().catch(() => {});
      }
      setWindowState((state) => ({ ...state, [windowName]: false }));
    },
    [isFullscreen, setWindowState, windowName]
  );

  // Minimize window (animates down to dock)
  const handleMinimize = useCallback((e) => {
    e?.stopPropagation();
    setIsMinimizedHidden(false);
    setIsMinimized(true);
  }, []);

  // Compute exact numeric dimensions for Rnd (ZERO strings, ZERO calc)
  const currentSize = useMemo(() => {
    if (isFullscreen) {
      return {
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
      };
    }
    if (isMaximized) {
      if (isMobile) {
        return {
          width: Math.round(Math.max(280, viewport.width - 8)),
          height: Math.round(Math.max(200, viewport.height - 32 - DOCK_RESERVE)),
        };
      }
      return {
        width: Math.round(Math.max(360, viewport.width - 16)),
        height: Math.round(Math.max(260, viewport.height - 32 - DOCK_RESERVE)),
      };
    }
    return {
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    };
  }, [isFullscreen, isMaximized, isMobile, viewport.width, viewport.height, bounds.width, bounds.height]);

  // Compute exact numeric coordinates for Rnd
  const currentPos = useMemo(() => {
    if (isFullscreen) {
      return { x: 0, y: 0 };
    }
    if (isMaximized) {
      if (isMobile) {
        return { x: 4, y: 32 };
      }
      return { x: 8, y: 32 };
    }
    return {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
    };
  }, [isFullscreen, isMaximized, isMobile, bounds.x, bounds.y]);

  const windowZIndex = isFullscreen ? 60 : isActive ? 40 : 25;
  const isLocked = isMaximized || isFullscreen || isMobile;

  // Traffic lights show colour on the active window, or when hovered (as on macOS)
  const showColor = isActive || lightsHover;

  const surfaceStyle = {
    fontFamily: FONT_STACK,
    background: isActive ? "rgba(30,31,36,0.80)" : "rgba(34,35,40,0.86)",
    backdropFilter: "blur(50px) saturate(190%)",
    WebkitBackdropFilter: "blur(50px) saturate(190%)",
    boxShadow: isFullscreen
      ? "none"
      : isActive
      ? "inset 0 0.5px 0 rgba(255,255,255,0.28), 0 0 0 0.5px rgba(255,255,255,0.16), 0 0 0 1px rgba(0,0,0,0.5), 0 28px 70px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3)"
      : "inset 0 0.5px 0 rgba(255,255,255,0.14), 0 0 0 0.5px rgba(255,255,255,0.09), 0 0 0 1px rgba(0,0,0,0.4), 0 14px 38px rgba(0,0,0,0.4)",
    transition: "box-shadow 0.2s ease, background-color 0.2s ease",
  };

  return (
    <Rnd
      size={currentSize}
      position={currentPos}
      onDragStop={(e, d) => {
        if (!isLocked) {
          const newX = Math.round(Math.max(0, Math.min(d.x, viewport.width - bounds.width)));
          const newY = Math.round(Math.max(NAVBAR_HEIGHT, Math.min(d.y, viewport.height - 60)));
          const updated = { ...bounds, x: newX, y: newY };
          setBounds(updated);
          savedBoundsRef.current = updated;
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isLocked) {
          const newW = Math.round(parseInt(ref.style.width, 10));
          const newH = Math.round(parseInt(ref.style.height, 10));
          const updated = {
            width: newW,
            height: newH,
            x: Math.round(position.x),
            y: Math.round(position.y),
          };
          setBounds(updated);
          savedBoundsRef.current = updated;
        }
      }}
      minWidth={isMobile ? 280 : 340}
      minHeight={isMobile ? 220 : 220}
      bounds="parent"
      dragHandleClassName="mac-window-drag-handle"
      disableDragging={isLocked}
      enableResizing={!isLocked}
      style={{
        zIndex: windowZIndex,
        position: isFullscreen ? "fixed" : "absolute",
        visibility: isMinimizedHidden ? "hidden" : "visible",
        pointerEvents: isMinimized ? "none" : "auto",
        transition: isLocked ? "all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
      }}
      onMouseDown={handleFocus}
      onTouchStart={handleFocus}
    >
      <motion.div
        data-lenis-prevent
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={
          isMinimized
            ? {
                scale: 0.12,
                opacity: 0,
                y: Math.min(viewport.height * 0.45, 500),
              }
            : {
                scale: 1,
                opacity: 1,
                y: 0,
              }
        }
        exit={{ scale: 0.9, opacity: 0, y: 16 }}
        transition={
          isMinimized
            ? { duration: 0.38, ease: [0.4, 0, 1, 1] }
            : { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }
        }
        onAnimationComplete={() => {
          if (isMinimized) setIsMinimizedHidden(true);
        }}
        className={`flex h-full w-full flex-col overflow-hidden ${isFullscreen ? "rounded-none" : "rounded-[22px]"}`}
        style={surfaceStyle}
      >
        {/* Title bar */}
        <div
          className={`mac-window-drag-handle relative flex h-[40px] w-full shrink-0 select-none items-center justify-between pl-[14px] pr-3 ${
            isLocked ? "cursor-default" : "cursor-move"
          }`}
          style={{
            background: isActive ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.02)",
            boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.09)",
          }}
          onDoubleClick={toggleMaximize}
        >
          {/* Traffic lights */}
          <div
            className="z-10 flex items-center gap-2"
            onMouseEnter={() => setLightsHover(true)}
            onMouseLeave={() => setLightsHover(false)}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              title="Close"
              aria-label="Close window"
              className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full transition-[filter] active:brightness-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
              style={lightStyle("#ff5f57", "rgba(190,40,34,0.9)", showColor)}
            >
              <X
                className={`h-2 w-2 text-black/60 transition-opacity ${lightsHover ? "opacity-100" : "opacity-0"}`}
                strokeWidth={3.5}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={handleMinimize}
              title="Minimize"
              aria-label="Minimize window"
              className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full transition-[filter] active:brightness-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
              style={lightStyle("#febc2e", "rgba(190,130,20,0.9)", showColor)}
            >
              <Minus
                className={`h-2 w-2 text-black/60 transition-opacity ${lightsHover ? "opacity-100" : "opacity-0"}`}
                strokeWidth={3.5}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                if (e.altKey) {
                  toggleFullscreen();
                } else {
                  toggleMaximize();
                }
              }}
              title={
                isFullscreen
                  ? "Exit Full Screen"
                  : isMaximized
                  ? "Restore Window Size"
                  : "Maximize (Option-click for Full Screen)"
              }
              aria-label={isMaximized || isFullscreen ? "Restore window size" : "Maximize window"}
              className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full transition-[filter] active:brightness-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
              style={lightStyle("#28c840", "rgba(20,140,40,0.9)", showColor)}
            >
              <span className={`flex transition-opacity ${lightsHover ? "opacity-100" : "opacity-0"}`}>
                <ZoomGlyph restore={isMaximized || isFullscreen} />
              </span>
            </button>
          </div>

          {/* Window title (centered) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-20">
            <span
              className={`max-w-[85%] truncate text-[13px] font-semibold tracking-[-0.01em] transition-colors ${
                isActive ? "text-white/90" : "text-white/40"
              }`}
            >
              {title}
            </span>
          </div>

          {/* Full-screen toggle */}
          <div className="z-10 flex items-center gap-1.5" onDoubleClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
              aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
              className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/[0.1] hover:text-white active:bg-white/[0.18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff] ${
                isActive ? "text-white/55" : "text-white/30"
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Content body: flex-1 ensures it fills all available space */}
        <div
          data-lenis-prevent
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
        >
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
};

export default MacWindow;
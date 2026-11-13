import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";

const NAVBAR_HEIGHT = 28; // macOS top menu bar height (h-7)
const DOCK_RESERVE = 76;   // Height reserved for dock at bottom of desktop

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
        className={`w-full h-full flex flex-col overflow-hidden transition-colors ${
          isFullscreen ? "rounded-none border-none" : "rounded-xl border"
        } ${
          isActive
            ? "border-white/25 shadow-[0_20px_56px_rgba(0,0,0,0.56)] bg-[#171a21]/95 backdrop-blur-2xl"
            : "border-white/12 shadow-[0_12px_34px_rgba(0,0,0,0.42)] bg-[#171a21]/90 backdrop-blur-xl"
        }`}
      >
        {/* Title Bar / Header */}
        <div
          className={`mac-window-drag-handle relative select-none w-full px-3 py-2.5 flex items-center justify-between shrink-0 border-b border-white/[0.08] ${
            isActive ? "bg-white/[0.075]" : "bg-white/[0.025]"
          } ${isLocked ? "cursor-default" : "cursor-move"}`}
          onDoubleClick={toggleMaximize}
        >
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2 z-10">
            {/* Close (Red) */}
            <button
              type="button"
              onClick={handleClose}
              title="Close (⌘W)"
              className="group relative bg-[#ff5f57] hover:bg-[#ff3b30] active:brightness-90 h-3 w-3 rounded-full flex items-center justify-center cursor-pointer transition border border-[#e0443e] shadow-sm"
            >
              <X className="w-2 h-2 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
            </button>

            {/* Minimize (Yellow) */}
            <button
              type="button"
              onClick={handleMinimize}
              title="Minimize (⌘M)"
              className="group relative bg-[#febc2e] hover:bg-[#f5a623] active:brightness-90 h-3 w-3 rounded-full flex items-center justify-center cursor-pointer transition border border-[#d89e24] shadow-sm"
            >
              <Minus className="w-2 h-2 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
            </button>

            {/* Maximize / Restore (Green) */}
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
              className="group relative bg-[#28c840] hover:bg-[#1db834] active:brightness-90 h-3 w-3 rounded-full flex items-center justify-center cursor-pointer transition border border-[#1aab29] shadow-sm"
            >
              {isMaximized || isFullscreen ? (
                <span className="text-[7.5px] text-black/80 font-black opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                  ⤡
                </span>
              ) : (
                <span className="text-[7.5px] text-black/80 font-black opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                  ⤢
                </span>
              )}
            </button>
          </div>

          {/* Window Title (Centered) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-16">
            <span
              className={`text-[12px] font-medium truncate max-w-[85%] transition-colors ${
                isActive ? "text-white/85" : "text-white/45"
              }`}
            >
              {title}
            </span>
          </div>

          {/* Right-side Window Controls */}
          <div className="flex items-center gap-1.5 z-10">
            {/* Quick Full Screen Toggle Icon Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body: flex-1 ensures it fills all available space */}
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
};

export default MacWindow;

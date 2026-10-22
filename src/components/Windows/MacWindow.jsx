import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

const MacWindow = ({
  children,
  windowName,
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
  title = "harshitOS",
  initialWidth = 720,
  initialHeight = 480,
  initialX = 260,
  initialY = 80,
}) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const getResponsiveBounds = () => {
    if (typeof window === "undefined") {
      return { x: initialX, y: initialY, width: initialWidth, height: initialHeight };
    }
    const mobile = window.innerWidth < 768;
    if (mobile) {
      return {
        x: 6,
        y: 32,
        width: Math.min(window.innerWidth - 12, 680),
        height: Math.min(window.innerHeight - 90, 560),
      };
    }
    // Desktop: safe clamp
    const safeWidth = Math.min(initialWidth, window.innerWidth - 40);
    const safeHeight = Math.min(initialHeight, window.innerHeight - 120);
    const safeX = Math.min(Math.max(initialX, 20), Math.max(window.innerWidth - safeWidth - 20, 20));
    const safeY = Math.min(Math.max(initialY, 36), Math.max(window.innerHeight - safeHeight - 40, 36));

    return {
      x: safeX,
      y: safeY,
      width: safeWidth,
      height: safeHeight,
    };
  };

  const [isMaximized, setIsMaximized] = useState(false);
  const [prevBounds, setPrevBounds] = useState(getResponsiveBounds);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setPrevBounds({
          x: 6,
          y: 32,
          width: Math.min(window.innerWidth - 12, 680),
          height: Math.min(window.innerHeight - 90, 560),
        });
      } else {
        setPrevBounds((prev) => ({
          ...prev,
          width: Math.min(prev.width, window.innerWidth - 24),
          height: Math.min(prev.height, window.innerHeight - 80),
          x: Math.min(prev.x, Math.max(window.innerWidth - 100, 20)),
          y: Math.min(prev.y, Math.max(window.innerHeight - 100, 36)),
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = activeWindow === windowName;

  const handleFocus = () => {
    if (setActiveWindow) {
      setActiveWindow(windowName);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  const windowZIndex = isActive ? 40 : 25;

  const currentSize = isMaximized || isMobile
    ? {
        width: isMobile ? "calc(100vw - 12px)" : "calc(100vw - 24px)",
        height: isMobile ? "calc(100vh - 90px)" : "calc(100vh - 120px)",
      }
    : { width: prevBounds.width, height: prevBounds.height };

  const currentPos = isMaximized || isMobile
    ? { x: isMobile ? 6 : 12, y: isMobile ? 32 : 36 }
    : { x: prevBounds.x, y: prevBounds.y };

  return (
    <Rnd
      size={currentSize}
      position={currentPos}
      onDragStop={(e, d) => {
        if (!isMaximized && !isMobile) {
          setPrevBounds((prev) => ({ ...prev, x: d.x, y: d.y }));
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized && !isMobile) {
          setPrevBounds({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            ...position,
          });
        }
      }}
      minWidth={isMobile ? 280 : 360}
      minHeight={isMobile ? 220 : 240}
      bounds="parent"
      dragHandleClassName="mac-window-nav"
      disableDragging={isMaximized || isMobile}
      enableResizing={!isMaximized && !isMobile}
      style={{ zIndex: windowZIndex, position: "absolute" }}
      onMouseDown={handleFocus}
      onTouchStart={handleFocus}
    >
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
          y: 30,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
          y: 30,
        }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
        className={`w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-colors ${
          isActive
            ? "border-white/20 shadow-[0_25px_65px_rgba(0,0,0,0.65)] bg-zinc-900/95 backdrop-blur-2xl"
            : "border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.45)] bg-zinc-900/85 backdrop-blur-xl"
        }`}
      >
        {/* Navbar / Title Bar */}
        <div
          className="mac-window-nav bg-white/5 border-b border-white/10 select-none cursor-move w-full px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shrink-0"
          onDoubleClick={toggleMaximize}
        >
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Close */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setWindowState((state) => ({
                  ...state,
                  [windowName]: false,
                }));
              }}
              title="Close"
              className="group bg-[#ff5f57] hover:bg-[#ff5f57]/80 h-3 w-3 rounded-full flex items-center justify-center cursor-pointer transition border border-[#e0443e]"
            >
              <span className="text-[7px] text-black font-black opacity-0 group-hover:opacity-100 transition">
                ✕
              </span>
            </button>

            {/* Minimize */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setWindowState((state) => ({
                  ...state,
                  [windowName]: false,
                }));
              }}
              title="Minimize"
              className="group bg-[#febc2e] hover:bg-[#febc2e]/80 h-3 w-3 rounded-full flex items-center justify-center cursor-pointer transition border border-[#d89e24]"
            >
              <span className="text-[8px] text-black font-black opacity-0 group-hover:opacity-100 transition leading-none">
                —
              </span>
            </button>

            {/* Maximize */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize();
              }}
              title={isMaximized ? "Restore" : "Maximize"}
              className="group bg-[#28c840] hover:bg-[#28c840]/80 h-3 w-3 rounded-full flex items-center justify-center cursor-pointer transition border border-[#1aab29]"
            >
              <span className="text-[8px] text-black font-black opacity-0 group-hover:opacity-100 transition leading-none">
                {isMaximized ? "⤡" : "+"}
              </span>
            </button>
          </div>

          {/* Window Title */}
          <div className="text-xs font-medium text-gray-300 truncate max-w-[65%] flex items-center gap-1.5 pointer-events-none text-center">
            {title}
          </div>

          {/* Spacer to balance traffic lights */}
          <div className="w-10 sm:w-12"></div>
        </div>

        {/* Content Body */}
        <div className="flex-1 w-full h-[calc(100%-32px)] sm:h-[calc(100%-36px)] overflow-hidden font-[-apple-system,BlinkMacSystemFont,sans-serif]">
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
};

export default MacWindow;

import React, { useState } from "react";
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
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevBounds, setPrevBounds] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });

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

  const currentSize = isMaximized
    ? { width: "calc(100vw - 24px)", height: "calc(100vh - 120px)" }
    : { width: prevBounds.width, height: prevBounds.height };

  const currentPos = isMaximized
    ? { x: 12, y: 36 }
    : { x: prevBounds.x, y: prevBounds.y };

  return (
    <Rnd
      size={currentSize}
      position={currentPos}
      onDragStop={(e, d) => {
        if (!isMaximized) {
          setPrevBounds((prev) => ({ ...prev, x: d.x, y: d.y }));
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          setPrevBounds({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            ...position,
          });
        }
      }}
      minWidth={360}
      minHeight={240}
      bounds="parent"
      dragHandleClassName="mac-window-nav"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      style={{ zIndex: windowZIndex, position: "absolute" }}
      onMouseDown={handleFocus}
    >
      <motion.div
        initial={{
          scale: 0.85,
          opacity: 0,
          y: 40,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        exit={{
          scale: 0.85,
          opacity: 0,
          y: 40,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className={`w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-colors ${
          isActive
            ? "border-white/20 shadow-[0_25px_65px_rgba(0,0,0,0.65)] bg-zinc-900/90 backdrop-blur-2xl"
            : "border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.45)] bg-zinc-900/80 backdrop-blur-xl"
        }`}
      >
        {/* Navbar / Title Bar */}
        <div
          className="mac-window-nav bg-white/5 border-b border-white/10 select-none cursor-move w-full px-3 py-2 flex items-center justify-between"
          onDoubleClick={toggleMaximize}
        >
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2">
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
          <div className="text-xs font-medium text-gray-300 truncate max-w-[60%] flex items-center gap-1.5 pointer-events-none">
            {title}
          </div>

          {/* Spacer to balance traffic lights */}
          <div className="w-12"></div>
        </div>

        {/* Content Body */}
        <div className="flex-1 w-full h-[calc(100%-36px)] overflow-hidden font-[-apple-system,BlinkMacSystemFont,sans-serif]">
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
};

export default MacWindow;

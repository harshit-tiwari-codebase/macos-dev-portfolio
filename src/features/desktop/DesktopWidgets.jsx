import React from "react";
import { motion, useAnimation } from "framer-motion";
import { AnalogClockWidget } from "./MacClock";
import { CalendarWidget } from "./CalendarWidget";
import { RotateCcw } from "lucide-react";

/**
 * DesktopWidgets container
 * Holds the Analog Clock and Calendar widgets and lets them be dragged around
 * the desktop. Like macOS, widgets fade to a muted, desaturated look while a
 * window is open and return to full colour on hover.
 */

const RESET_SPRING = { type: "spring", stiffness: 260, damping: 28 };

const ResetButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title="Reset widget positions"
    aria-label="Reset widget positions"
    className="absolute -left-2 -top-2 z-20 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full text-white/90 opacity-0 transition-opacity duration-150 focus-visible:opacity-100 group-hover/widget:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
    style={{
      background: "rgba(70,70,76,0.78)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "0.5px solid rgba(255,255,255,0.25)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
    }}
  >
    <RotateCcw className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
  </button>
);

export const DesktopWidgets = ({ isAnyWindowOpen = false, onOpenCalendar }) => {
  const clockControls = useAnimation();
  const calControls = useAnimation();

  const resetPositions = () => {
    clockControls.start({ x: 0, y: 0, transition: RESET_SPRING });
    calControls.start({ x: 0, y: 0, transition: RESET_SPRING });
  };

  const dragProps = {
    drag: true,
    dragMomentum: false,
    dragElastic: 0.06,
    whileDrag: { scale: 1.04, cursor: "grabbing", zIndex: 30 },
  };

  return (
    <div
      className={`pointer-events-auto absolute right-3 top-10 z-10 flex select-none flex-col items-end gap-4 transition-[opacity,filter] duration-500 sm:right-6 sm:top-12 ${
        isAnyWindowOpen
          ? "opacity-80 saturate-[0.45] hover:opacity-100 hover:saturate-100"
          : "opacity-100"
      }`}
    >
      {/* Analog clock (draggable) */}
      <motion.div
        animate={clockControls}
        {...dragProps}
        className="group/widget relative cursor-grab active:cursor-grabbing"
      >
        <AnalogClockWidget size={168} label="INDORE" />
        <ResetButton onClick={resetPositions} />
      </motion.div>

      {/* Calendar (draggable & double-click to open calendar window) */}
      <motion.div
        animate={calControls}
        {...dragProps}
        onDoubleClick={onOpenCalendar}
        className="group/widget relative cursor-grab active:cursor-grabbing"
        title="Double-click to open Calendar app"
      >
        <CalendarWidget size={168} initialView="day" />
        <ResetButton onClick={resetPositions} />
      </motion.div>
    </div>
  );
};

export default DesktopWidgets;
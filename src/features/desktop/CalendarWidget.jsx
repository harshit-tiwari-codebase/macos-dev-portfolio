import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

const SF_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Inter, Arial, sans-serif';

/**
 * EXACT macOS Sonoma Calendar Widget
 * Supports:
 * - View 1: Up Next / Date Tile (The iconic red weekday + giant date + schedule)
 * - View 2: Month Grid (Full monthly calendar with today circled in Apple red)
 * - Interactive month navigation
 * - Exact macOS squircle, specular borders, and frosted glass depth
 */
export const CalendarWidget = ({
  size = 168,
  className = "",
  initialView = "day", // "day" or "month"
}) => {
  const [view, setView] = useState(initialView); // "day" | "month"
  const [currentDate] = useState(() => new Date());
  const [navDate, setNavDate] = useState(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );

  // Real-time date parts
  const todayDate = currentDate.getDate();
  const todayMonth = currentDate.getMonth();
  const todayYear = currentDate.getFullYear();
  const todayWeekdayLong = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(currentDate);
  const todayWeekdayShort = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(currentDate);

  // Month navigation calculation
  const navYear = navDate.getFullYear();
  const navMonth = navDate.getMonth();
  const navMonthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(navDate);
  const navMonthNameShort = new Intl.DateTimeFormat("en-US", { month: "short" }).format(navDate);

  // Generate calendar grid
  const { days, prevTrailingDays, totalCells } = useMemo(() => {
    const firstDayIndex = new Date(navYear, navMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(navYear, navMonth, 0).getDate();

    const trailing = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      trailing.push(prevMonthTotalDays - i);
    }

    const currentDays = [];
    for (let i = 1; i <= totalDaysInMonth; i++) {
      currentDays.push(i);
    }

    const nextDaysCount = 35 - (trailing.length + currentDays.length);
    const leading = [];
    for (let i = 1; i <= (nextDaysCount > 0 ? nextDaysCount : 0); i++) {
      leading.push(i);
    }

    return {
      days: currentDays,
      prevTrailingDays: trailing,
      leadingDays: leading,
      totalCells: [...trailing.map(d => ({ day: d, isOther: true })), ...currentDays.map(d => ({ day: d, isOther: false })), ...leading.map(d => ({ day: d, isOther: true }))]
    };
  }, [navYear, navMonth]);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setNavDate(new Date(navYear, navMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setNavDate(new Date(navYear, navMonth + 1, 1));
  };

  const handleResetToday = (e) => {
    e.stopPropagation();
    setNavDate(new Date(todayYear, todayMonth, 1));
  };

  const toggleView = (e) => {
    e?.stopPropagation?.();
    setView((v) => (v === "day" ? "month" : "day"));
  };

  // Portfolio / developer schedule event preview
  const upcomingEvent = {
    title: "Portfolio Release v2.0",
    time: "7:30 PM",
    color: "#0a84ff", // Apple System Blue
    tag: "Dev Sprint",
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        fontFamily: SF_FONT,
      }}
      className={`relative select-none rounded-[26px] overflow-hidden p-3.5 flex flex-col justify-between transition-shadow duration-300 group
        bg-gradient-to-br from-[#1e1e22]/90 via-[#141417]/92 to-[#0c0c0e]/95
        backdrop-blur-2xl
        border border-white/[0.14]
        shadow-[0_14px_36px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(0,0,0,0.5)]
        ${className}`}
    >
      {/* Top subtle diagonal glass reflection */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 w-36 h-28 bg-gradient-to-br from-white/[0.08] to-transparent rounded-full blur-xl transform -rotate-12"
      />

      <AnimatePresence mode="wait">
        {view === "day" ? (
          /* ── View 1: macOS Sonoma Up Next / Date Tile ── */
          <motion.div
            key="day-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex flex-col h-full justify-between"
          >
            {/* Header: Weekday + Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-[#ff453a] font-bold text-[12px] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(255,69,58,0.25)]">
                {todayWeekdayLong}
              </span>
              <button
                type="button"
                onClick={toggleView}
                title="Switch to Month Calendar View"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Big Date Number */}
            <div className="my-auto py-0.5">
              <div className="text-[48px] sm:text-[50px] font-semibold text-white tracking-[-0.03em] leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                {todayDate}
              </div>
            </div>

            {/* Up Next Event Tile */}
            <div
              onClick={toggleView}
              className="cursor-pointer bg-white/[0.06] hover:bg-white/[0.09] transition-colors border border-white/10 rounded-[14px] p-2 flex items-center gap-2"
            >
              <div
                className="w-1 h-7 rounded-full shrink-0"
                style={{ backgroundColor: upcomingEvent.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white/95 truncate leading-tight">
                  {upcomingEvent.title}
                </p>
                <p className="text-[10px] text-white/50 leading-tight mt-0.5 flex items-center gap-1">
                  <span>{upcomingEvent.time}</span>
                  <span>•</span>
                  <span className="text-[#0a84ff] font-medium">{upcomingEvent.tag}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── View 2: macOS Sonoma Month Grid View ── */
          <motion.div
            key="month-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex flex-col h-full justify-between"
          >
            {/* Header: Month & Navigation */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-[#ff453a] font-bold text-[11px] tracking-wider uppercase truncate">
                  {navMonthNameShort} {navYear}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-0.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition"
                  title="Previous month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetToday}
                  className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white transition mx-0.5"
                  title="Today"
                />
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-0.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition"
                  title="Next month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleView}
                  title="Switch to Day & Up Next View"
                  className="ml-1 p-0.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition"
                >
                  <Clock className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 text-center text-[9px] font-semibold text-white/40 tracking-wider">
              {weekdays.map((w, idx) => (
                <span key={idx}>{w}</span>
              ))}
            </div>

            {/* Days Matrix */}
            <div className="grid grid-cols-7 gap-y-0.5 text-center text-[10px] my-auto">
              {totalCells.slice(0, 35).map((item, idx) => {
                const isCurrentMonth = !item.isOther;
                const isToday =
                  isCurrentMonth &&
                  item.day === todayDate &&
                  navMonth === todayMonth &&
                  navYear === todayYear;

                return (
                  <div
                    key={idx}
                    className="h-5 flex items-center justify-center relative"
                  >
                    {isToday ? (
                      <span className="w-4.5 h-4.5 rounded-full bg-[#ff453a] text-white font-bold flex items-center justify-center text-[9.5px] shadow-[0_1px_4px_rgba(255,69,58,0.5)]">
                        {item.day}
                      </span>
                    ) : (
                      <span
                        className={`text-[9.5px] ${
                          isCurrentMonth
                            ? "text-white/90 font-medium"
                            : "text-white/20 font-normal"
                        }`}
                      >
                        {item.day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Quick Status */}
            <div
              onClick={toggleView}
              className="cursor-pointer text-[9.5px] text-white/50 hover:text-white/80 transition-colors flex items-center justify-between pt-0.5 border-t border-white/5"
            >
              <span className="truncate">Today: {todayWeekdayShort}, {todayMonth + 1}/{todayDate}</span>
              <span className="text-[#0a84ff] font-medium shrink-0">1 Event</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarWidget;
import { useEffect, useMemo, useState } from "react";
import MacWindow from "./MacWindow";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Check,
  X,
} from "lucide-react";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';
const RED = "#ff3b30"; // Calendar's accent

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Portfolio Live Launch",
    date: "2026-11-14",
    time: "10:00 AM",
    category: "projects",
    color: "#0A84FF",
    location: "Global / Vercel",
    desc: "Interactive macOS dev portfolio deployment with Ask AI integration.",
  },
  {
    id: 2,
    title: "VerifAi Engine Review",
    date: "2026-11-17",
    time: "2:30 PM",
    category: "projects",
    color: "#5E5CE6",
    location: "Remote",
    desc: "Deepfake and authenticity detection pipeline performance optimization.",
  },
  {
    id: 3,
    title: "LeetCode Contest Grind",
    date: "2026-11-15",
    time: "8:00 PM",
    category: "dsa",
    color: "#30D158",
    location: "Online",
    desc: "Graph algorithms and dynamic programming practice session.",
  },
  {
    id: 4,
    title: "CSIT Academic Seminar",
    date: "2026-11-20",
    time: "11:00 AM",
    category: "college",
    color: "#FF9F0A",
    location: "IPS IES Academy",
    desc: "Advanced Distributed Systems and Cloud Computing architecture lecture.",
  },
  {
    id: 5,
    title: "Nexora Sprint Planning",
    date: "2026-11-24",
    time: "4:00 PM",
    category: "projects",
    color: "#0A84FF",
    location: "Dev Lab",
    desc: "Next-gen web app platform architecture & animations review.",
  },
  {
    id: 6,
    title: "Semester Exams Prep",
    date: "2026-11-28",
    time: "All Day",
    category: "college",
    color: "#FF453A",
    location: "Library",
    desc: "Subject revisions and lab practical demonstrations.",
  },
];

const CATEGORIES = [
  { id: "projects", label: "Projects & Dev", color: "#0A84FF" },
  { id: "college", label: "College & Exams", color: "#FF9F0A" },
  { id: "dsa", label: "DSA & LeetCode", color: "#30D158" },
  { id: "milestones", label: "Milestones", color: "#BF5AF2" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEWS = ["day", "week", "month"];

/* ── date helpers (all local time, so "today" is never off by a day) ── */
const pad = (n) => String(n).padStart(2, "0");
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => {
  const lastDay = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), lastDay));
};

const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
};

const fieldRow = "flex items-center gap-3 px-3.5 py-[10px] transition-colors focus-within:bg-white/[0.04]";
const fieldLabel = "w-[4.5rem] shrink-0 text-[13px] text-white/50";
const fieldInput =
  "min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/30 [color-scheme:dark]";

const EventChip = ({ ev, onSelect, compact }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onSelect(ev);
    }}
    className="block w-full truncate rounded-[5px] py-[2px] pl-1.5 pr-1 text-left text-[11px] font-medium leading-[15px] text-white/95 transition-[filter] hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
    style={{ backgroundColor: `${ev.color}38`, boxShadow: `inset 2.5px 0 0 ${ev.color}` }}
    title={`${ev.time} · ${ev.title}`}
  >
    {!compact && <span className="mr-1 text-white/55">{ev.time === "All Day" ? "" : ev.time.replace(" ", "")}</span>}
    {ev.title}
  </button>
);

export default function CalendarWindow({
  windowName = "calendar",
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) {
  const [currentDate] = useState(() => new Date());
  const [activeDate, setActiveDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState("month"); // "month" | "week" | "day"
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [activeCategories, setActiveCategories] = useState(
    () => new Set(["projects", "college", "dsa", "milestones"])
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const blankEvent = () => ({
    title: "",
    date: toDateStr(new Date()),
    time: "12:00 PM",
    category: "projects",
    location: "",
    desc: "",
  });
  const [newEvent, setNewEvent] = useState(blankEvent);

  const todayStr = useMemo(() => toDateStr(currentDate), [currentDate]);
  const activeStr = toDateStr(activeDate);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthName = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "long" }).format(activeDate),
    [activeDate]
  );

  // Week of the active date (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const start = addDays(activeDate, -activeDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i);
      return { date: d, dateStr: toDateStr(d), day: d.getDate() };
    });
  }, [activeDate]);

  // Toolbar title depends on the view
  const titleParts = useMemo(() => {
    if (viewMode === "day") {
      return {
        main: new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long" }).format(activeDate),
        sub: String(year),
      };
    }
    if (viewMode === "week") {
      const first = weekDays[0].date;
      const last = weekDays[6].date;
      const fmt = (d, o) => new Intl.DateTimeFormat("en-US", o).format(d);
      const sameMonth = first.getMonth() === last.getMonth();
      return {
        main: sameMonth
          ? `${fmt(first, { month: "long" })} ${first.getDate()}–${last.getDate()}`
          : `${fmt(first, { month: "short" })} ${first.getDate()} – ${fmt(last, { month: "short" })} ${last.getDate()}`,
        sub: String(last.getFullYear()),
      };
    }
    return { main: monthName, sub: String(year) };
  }, [viewMode, activeDate, weekDays, monthName, year]);

  // Month grid
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${pad(m)}-${pad(d)}`;
      days.push({ day: d, isCurrentMonth: false, dateStr });
    }

    // Days of current month
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${pad(month + 1)}-${pad(i)}`;
      days.push({ day: i, isCurrentMonth: true, dateStr });
    }

    // Leading days for next month
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextDay = 1;
    while (days.length < totalCells) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${pad(m)}-${pad(nextDay)}`;
      days.push({ day: nextDay, isCurrentMonth: false, dateStr });
      nextDay++;
    }

    return days;
  }, [year, month]);

  const toggleCategory = (catId) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        if (next.size > 1) next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handlePrev = () => {
    setActiveDate((d) => (viewMode === "month" ? addMonths(d, -1) : addDays(d, viewMode === "week" ? -7 : -1)));
  };

  const handleNext = () => {
    setActiveDate((d) => (viewMode === "month" ? addMonths(d, 1) : addDays(d, viewMode === "week" ? 7 : 1)));
  };

  const handleToday = () => {
    setActiveDate(new Date());
  };

  const openAdd = (dateStr) => {
    setNewEvent({ ...blankEvent(), ...(dateStr ? { date: dateStr } : {}) });
    setIsAddingEvent(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const catObj = CATEGORIES.find((c) => c.id === newEvent.category) || CATEGORIES[0];
    const created = {
      id: Date.now(),
      title: newEvent.title.trim(),
      date: newEvent.date,
      time: newEvent.time,
      category: newEvent.category,
      color: catObj.color,
      location: newEvent.location.trim() || "Local",
      desc: newEvent.desc.trim(),
    };

    setEvents((prev) => [...prev, created]);
    setIsAddingEvent(false);
    setNewEvent(blankEvent());
  };

  const filteredEvents = useMemo(
    () => events.filter((ev) => activeCategories.has(ev.category)),
    [events, activeCategories]
  );

  // Next three events from today onwards
  const upcoming = useMemo(
    () =>
      filteredEvents
        .filter((ev) => ev.date >= todayStr)
        .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? -1 : 1))
        .slice(0, 3),
    [filteredEvents, todayStr]
  );

  const eventsOn = (dateStr) => filteredEvents.filter((e) => e.date === dateStr);

  // Escape closes the open sheet
  useEffect(() => {
    if (!selectedEvent && !isAddingEvent) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setSelectedEvent(null);
      setIsAddingEvent(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedEvent, isAddingEvent]);

  const segBtn = (active) =>
    `cursor-pointer rounded-[7px] px-3 py-[3px] text-[12px] font-medium capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff] ${
      active ? "bg-white/[0.18] text-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]" : "text-white/55 hover:text-white"
    }`;

  const navBtn =
    "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/65 transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]";

  const sheetClass =
    "w-full max-w-[22rem] rounded-[22px] p-5 text-white";
  const sheetStyle = {
    fontFamily: FONT_STACK,
    background: "rgba(40,40,45,0.82)",
    backdropFilter: "blur(60px) saturate(190%)",
    WebkitBackdropFilter: "blur(60px) saturate(190%)",
    boxShadow:
      "inset 0 0.5px 0 rgba(255,255,255,0.3), 0 0 0 0.5px rgba(255,255,255,0.14), 0 0 0 1px rgba(0,0,0,0.4), 0 24px 60px rgba(0,0,0,0.5)",
  };

  const primaryBtn = {
    background: `linear-gradient(180deg, #ff5a4f 0%, ${RED} 100%)`,
    boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.5), 0 0 0 0.5px rgba(140,10,0,0.5), 0 4px 12px rgba(255,59,48,0.3)",
  };

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Calendar"
      initialWidth={860}
      initialHeight={580}
      initialX={220}
      initialY={70}
    >
      <div
        className="relative flex h-full w-full select-none overflow-hidden text-white antialiased"
        style={{ fontFamily: FONT_STACK, background: "linear-gradient(180deg, #17181c 0%, #0f1013 100%)" }}
      >
        {/* Sidebar */}
        <aside
          className="hidden w-[13.5rem] shrink-0 flex-col p-3 sm:flex"
          style={{ ...glass, boxShadow: "inset -0.5px 0 0 rgba(255,255,255,0.09)" }}
        >
          <p className="mb-2 px-2 text-[12px] font-semibold text-white/45">Calendars</p>

          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const isChecked = activeCategories.has(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => toggleCategory(cat.id)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-1.5 text-left transition-colors hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                >
                  <span
                    className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-white transition-all"
                    style={{
                      backgroundColor: isChecked ? cat.color : "transparent",
                      boxShadow: isChecked ? "none" : `inset 0 0 0 1.5px ${cat.color}`,
                    }}
                  >
                    {isChecked && <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden="true" />}
                  </span>
                  <span className="truncate text-[13px] text-white/90">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-5 px-2 text-[12px] font-semibold text-white/45">Upcoming</p>
          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {upcoming.length === 0 && <p className="px-2 text-[12px] text-white/35">Nothing coming up.</p>}
            {upcoming.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedEvent(item)}
                className="block w-full cursor-pointer rounded-[10px] p-2 pl-3 text-left transition-colors hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                style={{ backgroundColor: `${item.color}22`, boxShadow: `inset 3px 0 0 ${item.color}` }}
              >
                <div className="truncate text-[12.5px] font-medium">{item.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-white/50">
                  {item.date} · {item.time}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openAdd()}
            className="mt-3 flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full text-[12.5px] font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
            style={primaryBtn}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
            New Event
          </button>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <div
            className="flex shrink-0 items-center justify-between gap-2 px-4 py-2.5"
            style={{ ...glass, boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.09)" }}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <h2 className="truncate text-[17px] font-semibold tracking-[-0.02em]">
                {titleParts.main} <span className="font-normal text-white/45">{titleParts.sub}</span>
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden rounded-[9px] bg-white/[0.07] p-0.5 ring-1 ring-inset ring-white/[0.08] sm:flex" role="tablist" aria-label="Calendar view">
                {VIEWS.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    aria-selected={viewMode === mode}
                    onClick={() => setViewMode(mode)}
                    className={segBtn(viewMode === mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center rounded-[9px] bg-white/[0.07] p-0.5 ring-1 ring-inset ring-white/[0.08]">
                <button type="button" onClick={handlePrev} className={navBtn} title="Previous" aria-label="Previous">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleToday}
                  className="h-6 cursor-pointer rounded-md px-2.5 text-[12px] font-medium text-white/85 transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                >
                  Today
                </button>
                <button type="button" onClick={handleNext} className={navBtn} title="Next" aria-label="Next">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => openAdd()}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white transition-[filter,transform] hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
                style={primaryBtn}
                title="Add new event"
                aria-label="Add new event"
              >
                <Plus className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* ── Month view ── */}
          {viewMode === "month" && (
            <>
              <div className="grid shrink-0 grid-cols-7 py-1.5 text-center text-[11.5px] font-medium text-white/40" style={{ boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.08)" }}>
                {WEEKDAYS.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-px overflow-y-auto bg-white/[0.07] sm:grid-rows-6">
                {calendarGrid.map((cell) => {
                  const isToday = cell.dateStr === todayStr;
                  const cellEvents = eventsOn(cell.dateStr);

                  return (
                    <div
                      key={cell.dateStr}
                      onClick={() => {
                        if (cellEvents.length > 0) {
                          setSelectedEvent(cellEvents[0]);
                        } else {
                          openAdd(cell.dateStr);
                        }
                      }}
                      className={`flex min-h-[64px] cursor-pointer flex-col bg-[#15161a] p-1 transition-colors hover:bg-[#1b1c21] sm:min-h-[75px] sm:p-1.5 ${
                        !cell.isCurrentMonth ? "opacity-40" : ""
                      }`}
                    >
                      <div className="mb-1 flex justify-end">
                        <span
                          className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1 text-[12px] font-medium tabular-nums"
                          style={isToday ? { backgroundColor: RED, color: "#fff", boxShadow: "0 2px 8px rgba(255,59,48,0.4)" } : { color: "rgba(255,255,255,0.85)" }}
                        >
                          {cell.day}
                        </span>
                      </div>

                      <div className="flex-1 space-y-[3px] overflow-hidden">
                        {cellEvents.slice(0, 2).map((ev) => (
                          <EventChip key={ev.id} ev={ev} onSelect={setSelectedEvent} compact />
                        ))}
                        {cellEvents.length > 2 && (
                          <p className="px-1 text-[10.5px] font-medium text-white/45">+{cellEvents.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Week view ── */}
          {viewMode === "week" && (
            <div className="grid min-h-0 flex-1 grid-cols-7 gap-px overflow-y-auto bg-white/[0.07]">
              {weekDays.map(({ dateStr, day }, i) => {
                const isToday = dateStr === todayStr;
                const dayEvents = eventsOn(dateStr);
                return (
                  <div
                    key={dateStr}
                    onClick={() => openAdd(dateStr)}
                    className="flex min-h-full cursor-pointer flex-col bg-[#15161a] p-1.5 transition-colors hover:bg-[#1b1c21]"
                  >
                    <div className="mb-2 flex flex-col items-center gap-1">
                      <span className="text-[11.5px] font-medium text-white/40">{WEEKDAYS[i]}</span>
                      <span
                        className="flex h-6 min-w-[24px] items-center justify-center rounded-full px-1 text-[13px] font-semibold tabular-nums"
                        style={isToday ? { backgroundColor: RED, color: "#fff" } : { color: "rgba(255,255,255,0.9)" }}
                      >
                        {day}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((ev) => (
                        <EventChip key={ev.id} ev={ev} onSelect={setSelectedEvent} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Day view ── */}
          {viewMode === "day" && (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {eventsOn(activeStr).length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="text-[13px] text-white/45">No events on this day.</p>
                  <button
                    type="button"
                    onClick={() => openAdd(activeStr)}
                    className="h-8 cursor-pointer rounded-full px-5 text-[12.5px] font-medium text-white transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
                    style={primaryBtn}
                  >
                    Add Event
                  </button>
                </div>
              ) : (
                <div className="mx-auto max-w-xl space-y-2">
                  {eventsOn(activeStr).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="flex w-full cursor-pointer items-start gap-4 rounded-[14px] p-3.5 pl-4 text-left transition-colors hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                      style={{ backgroundColor: `${ev.color}24`, boxShadow: `inset 3.5px 0 0 ${ev.color}` }}
                    >
                      <span className="w-16 shrink-0 text-[12.5px] font-medium text-white/60">{ev.time}</span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold tracking-[-0.01em]">{ev.title}</span>
                        {ev.location && <span className="mt-0.5 block text-[12px] text-white/50">{ev.location}</span>}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event detail sheet */}
        {selectedEvent && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)" }}
            onClick={() => setSelectedEvent(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-title"
              className={sheetClass}
              style={sheetStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span className="mt-[5px] h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                  <h3 id="event-title" className="text-[17px] font-semibold leading-snug tracking-[-0.015em]">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close"
                  className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/[0.1] text-white/70 transition-colors hover:bg-white/[0.18] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 divide-y divide-white/[0.09] overflow-hidden rounded-[14px] bg-white/[0.06] text-[13px] ring-1 ring-inset ring-white/[0.09]">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                  <CalendarIcon className="h-4 w-4 text-white/45" aria-hidden="true" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                  <Clock className="h-4 w-4 text-white/45" aria-hidden="true" />
                  <span>{selectedEvent.time}</span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <MapPin className="h-4 w-4 text-white/45" aria-hidden="true" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {selectedEvent.desc && (
                <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">{selectedEvent.desc}</p>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="h-8 cursor-pointer rounded-full bg-white/[0.1] px-5 text-[13px] font-medium text-white/90 ring-1 ring-inset ring-white/[0.12] transition-colors hover:bg-white/[0.17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New event sheet */}
        {isAddingEvent && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)" }}
            onClick={() => setIsAddingEvent(false)}
          >
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-event-title"
              onSubmit={handleCreateEvent}
              onClick={(e) => e.stopPropagation()}
              className={sheetClass}
              style={sheetStyle}
            >
              <h3 id="new-event-title" className="text-[17px] font-semibold tracking-[-0.015em]">
                New Event
              </h3>

              <div className="mt-4 divide-y divide-white/[0.09] overflow-hidden rounded-[14px] bg-white/[0.06] ring-1 ring-inset ring-white/[0.09]">
                <label className={fieldRow}>
                  <span className={fieldLabel}>Title</span>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Hackathon Final Presentation"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className={fieldInput}
                  />
                </label>
                <label className={fieldRow}>
                  <span className={fieldLabel}>Date</span>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className={fieldInput}
                  />
                </label>
                <label className={fieldRow}>
                  <span className={fieldLabel}>Time</span>
                  <input
                    type="text"
                    placeholder="5:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className={fieldInput}
                  />
                </label>
                <label className={fieldRow}>
                  <span className={fieldLabel}>Calendar</span>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className={`${fieldInput} cursor-pointer`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#1f2025]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={fieldRow}>
                  <span className={fieldLabel}>Location</span>
                  <input
                    type="text"
                    placeholder="Remote / Campus"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className={fieldInput}
                  />
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="h-8 cursor-pointer rounded-full bg-white/[0.1] px-5 text-[13px] font-medium text-white/85 ring-1 ring-inset ring-white/[0.12] transition-colors hover:bg-white/[0.17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64b0ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 cursor-pointer rounded-full px-5 text-[13px] font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64b0ff]"
                  style={primaryBtn}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MacWindow>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";

const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Inter, Arial, sans-serif';

/* Re-renders on the minute boundary (or every second when asked) */
function useNow(everySecond) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer;
    if (everySecond) {
      timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }
    const sync = () => {
      setNow(new Date());
      timer = setTimeout(sync, 60000 - (Date.now() % 60000) + 20);
    };
    timer = setTimeout(sync, 60000 - (Date.now() % 60000) + 20);
    return () => clearTimeout(timer);
  }, [everySecond]);
  return now;
}

/* ───────────────────────── Menu bar clock ─────────────────────────
   Reads like the real menu bar: "Fri Nov 13  3:45 PM".
   Click it for the date and a month calendar, like Notification Center. */
export function MenuBarClock({
  locale = "en-US",
  showSeconds = false,
  showDate = true,
  accent = "#ff453a",
  className = "",
}) {
  const now = useNow(showSeconds);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const wrap = useRef(null);
  const reduce = useReducedMotion();

  const dateText = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric" })
        .formatToParts(now)
        .filter((p) => p.type !== "literal")
        .map((p) => p.value)
        .join(" "),
    [locale, now]
  );
  const timeText = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
  }).format(now);

  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const toggle = () => {
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setOpen((o) => !o);
  };

  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const lead = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const isToday = (d) => d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2023, 0, 1 + i))
  );

  return (
    <div ref={wrap} className={`relative inline-block ${className}`} style={{ fontFamily: SF }}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${dateText}, ${timeText}`}
        className={`flex h-6 cursor-default items-center rounded-[5px] px-2 text-[13px] font-medium leading-none text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${
          open ? "bg-white/25" : "hover:bg-white/15"
        }`}
        style={{ fontVariantNumeric: "tabular-nums", textShadow: "0 0 1px rgba(0,0,0,.25)" }}
      >
        {showDate && <span className="mr-2">{dateText}</span>}
        <span>{timeText}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Calendar"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-[200] mt-1.5 w-[300px] rounded-2xl border border-white/15 bg-[rgba(32,32,34,.72)] p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-2xl"
          >
            <p className="text-[13px] font-medium text-white/60">
              {new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now)}
            </p>
            <p className="text-[26px] font-semibold leading-tight">
              {new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(now)}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[15px] font-semibold">
                {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(cursor)}
              </span>
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setCursor(new Date(y, m - 1, 1))}
                  className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Today"
                  onClick={() => setCursor(new Date(now.getFullYear(), now.getMonth(), 1))}
                  className="h-2 w-2 rounded-full bg-white/50 hover:bg-white"
                />
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setCursor(new Date(y, m + 1, 1))}
                  className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </span>
            </div>

            <div
              className="mt-2 grid grid-cols-7 gap-y-1 text-center text-[12px]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {weekdays.map((w, i) => (
                <span key={i} className="py-1 font-medium text-white/45">
                  {w}
                </span>
              ))}
              {cells.map((d, i) => (
                <span key={i} className="flex h-8 items-center justify-center">
                  {d && (
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        isToday(d) ? "font-semibold text-white" : "text-white/90"
                      }`}
                      style={isToday(d) ? { backgroundColor: accent } : undefined}
                    >
                      {d}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── EXACT macOS Analog Clock Widget ─────────────────────────
   The iconic macOS Sonoma Clock widget:
   - 26px continuous curve squircle container
   - Apple frosted glass material & specular highlights
   - Dark radial gradient dial with 60 precision ticks and SF Pro numerals
   - Realistic drop shadows on hands
   - White hour and minute capsule hands
   - Sweeping Apple Orange second hand with counterbalance tail
   - City & Timezone badge
*/
export function AnalogClockWidget({
  size = 168,
  label = "INDORE",
  className = "",
}) {
  const reduce = useReducedMotion();
  const hourRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);

  // Available cities switch on click
  const [activeCityIdx, setActiveCityIdx] = useState(0);
  const cities = [
    { name: label || "INDORE", offset: 0, sub: "Today, +0HRS" },
    { name: "CUPERTINO", offset: -13.5, sub: "Today, -13.5HRS" },
    { name: "LONDON", offset: -5.5, sub: "Today, -5.5HRS" },
    { name: "TOKYO", offset: 3.5, sub: "Today, +3.5HRS" },
  ];

  const currentCity = cities[activeCityIdx];

  const cycleCity = (e) => {
    e?.stopPropagation?.();
    setActiveCityIdx((prev) => (prev + 1) % cities.length);
  };

  useEffect(() => {
    let raf;
    const frame = () => {
      const now = new Date();
      // Adjust for chosen city timezone offset relative to local
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      // Indore is local +5:30. Calculate offset from local
      const d = currentCity.offset === 0 
        ? now 
        : new Date(utcTime + (5.5 + currentCity.offset) * 3600000);

      const ms = reduce ? 0 : d.getMilliseconds() / 1000;
      const s = d.getSeconds() + ms;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;

      if (hourRef.current) {
        hourRef.current.setAttribute("transform", `rotate(${h * 30} 100 100)`);
      }
      if (minRef.current) {
        minRef.current.setAttribute("transform", `rotate(${m * 6} 100 100)`);
      }
      if (secRef.current) {
        secRef.current.setAttribute("transform", `rotate(${s * 6} 100 100)`);
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce, currentCity]);

  // 60 Ticks
  const ticks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const major = i % 5 === 0;
      return (
        <line
          key={i}
          x1="100"
          y1="13"
          x2="100"
          y2={major ? "23" : "18"}
          stroke="#ffffff"
          strokeOpacity={major ? 0.95 : 0.4}
          strokeWidth={major ? 2.2 : 1}
          strokeLinecap="round"
          transform={`rotate(${i * 6} 100 100)`}
        />
      );
    });
  }, []);

  // 12 Numerals
  const numerals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      const a = (n * 30 * Math.PI) / 180;
      const radius = 66.5;
      const x = 100 + Math.sin(a) * radius;
      const y = 100 - Math.cos(a) * radius;

      return (
        <text
          key={n}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.95)"
          fontSize="18"
          fontWeight="500"
          style={{ fontFamily: SF }}
        >
          {n}
        </text>
      );
    });
  }, []);

  return (
    <div
      style={{
        width: size,
        height: size,
        fontFamily: SF,
      }}
      onClick={cycleCity}
      title="Click to switch World Clock city"
      className={`relative select-none rounded-[26px] overflow-hidden p-1 flex items-center justify-center transition-all duration-300 cursor-pointer group
        bg-gradient-to-br from-[#1e1e22]/90 via-[#141417]/92 to-[#0c0c0e]/95
        backdrop-blur-2xl
        border border-white/[0.14]
        shadow-[0_14px_36px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(0,0,0,0.5)]
        hover:border-white/25
        ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        role="img"
        aria-label={`macOS Analog Clock - ${currentCity.name}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Dial radial lighting */}
          <radialGradient id="clockDialGrad" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#2c2c30" />
            <stop offset="65%" stopColor="#161619" />
            <stop offset="100%" stopColor="#0d0d0f" />
          </radialGradient>

          {/* Hands shadow filters */}
          <filter id="handShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#000000" floodOpacity="0.65" />
          </filter>

          <filter id="secondShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Crystal reflection sheen */}
          <linearGradient id="clockGlassGlint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Bezel Rim */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#clockDialGrad)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        {/* 60 Ticks */}
        {ticks}

        {/* 12 Hour Numerals */}
        {numerals}

        {/* City Label & Subtitle */}
        <text
          x="100"
          y="134"
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.6)"
          fontSize="9.5"
          fontWeight="600"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {currentCity.name}
        </text>
        <text
          x="100"
          y="146"
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.32)"
          fontSize="7.5"
          fontWeight="500"
          style={{ letterSpacing: "0.04em" }}
        >
          {currentCity.sub}
        </text>

        {/* Hour Hand */}
        <g ref={hourRef}>
          <rect
            x="97.6"
            y="52"
            width="4.8"
            height="54"
            rx="2.4"
            fill="#ffffff"
            filter="url(#handShadow)"
          />
        </g>

        {/* Minute Hand */}
        <g ref={minRef}>
          <rect
            x="98.1"
            y="26"
            width="3.8"
            height="80"
            rx="1.9"
            fill="#ffffff"
            filter="url(#handShadow)"
          />
        </g>

        {/* Second Hand (with Apple Counterbalance Tail) */}
        <g ref={secRef}>
          {/* Main second needle + 20px tail extending down to y=120 */}
          <rect
            x="99.25"
            y="18"
            width="1.5"
            height="102"
            rx="0.75"
            fill="#ff9f0a"
            filter="url(#secondShadow)"
          />
          {/* Second hand orange hub cap */}
          <circle cx="100" cy="100" r="4.2" fill="#ff9f0a" />
          {/* Center dark pin hole */}
          <circle cx="100" cy="100" r="1.6" fill="#121214" />
        </g>

        {/* Subtle glass reflection highlight across the top-left */}
        <ellipse
          cx="80"
          cy="60"
          rx="60"
          ry="38"
          fill="url(#clockGlassGlint)"
          transform="rotate(-25 80 60)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}

export default MenuBarClock;
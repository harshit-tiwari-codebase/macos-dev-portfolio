import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X, BookOpen } from "lucide-react";
import { ScrollerCtx } from "./StoryMotion";

/* ───────────────────────── ProjectShelf ─────────────────────────
   Projects as books on a curved shelf.
   - Spines recede along a cylinder (convex, like a turning platter).
   - Pick a spine and it pulls out to a front cover.
   - Click the cover and it swings open to the project page spread.
   - Close it with: the Close button, the swung-open left cover, a click on
     empty shelf space, picking another book, or Escape.
   - Focus reveal: books out of focus are blurred and dimmed, sharpening
     as they approach the centre.
─────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = (n) => String(n).padStart(2, "0");

const GAP = 6;
const HEIGHTS = [0.94, 1, 0.9, 0.97, 0.92, 0.99, 0.88, 0.95, 0.91];

const PALETTE = [
  { bg: "#12161D", fg: "#2B3EF2", tx: "#FFFFFF" },
  { bg: "#DCE0F8", fg: "#2B3EF2", tx: "#12161D" },
  { bg: "#2B3EF2", fg: "#EDEFF2", tx: "#FFFFFF" },
  { bg: "#FFFFFF", fg: "#2B3EF2", tx: "#12161D" },
  { bg: "#5B6573", fg: "#EDEFF2", tx: "#FFFFFF" },
  { bg: "#8793F8", fg: "#12161D", tx: "#12161D" },
  { bg: "#0B1030", fg: "#8793F8", tx: "#FFFFFF" },
  { bg: "#C9CEDA", fg: "#12161D", tx: "#12161D" },
];

const SPINE_SHADOW =
  "inset 2px 0 0 rgba(255,255,255,.22), inset -3px 0 0 rgba(0,0,0,.18), 0 12px 24px rgba(18,22,29,.20)";

function useWidth(ref) {
  const [w, setW] = useState(960);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth || 960);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 960));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/* Position on the cylinder: depth falls away and the book turns with the curve */
function place(px, R) {
  const c = clamp(px, -R * 0.92, R * 0.92);
  return { z: -(R - Math.sqrt(R * R - c * c)), rot: (Math.asin(c / R) * 180) / Math.PI };
}

/* ───────── Cover artwork patterns ───────── */
function Pattern({ kind, color }) {
  const common = {
    viewBox: "0 0 300 408",
    preserveAspectRatio: "xMidYMid slice",
    className: "absolute inset-0 h-full w-full",
    "aria-hidden": true,
  };
  if (kind === 0)
    return (
      <svg {...common}>
        {[170, 120, 72, 30].map((r) => (
          <circle key={r} cx="215" cy="130" r={r} fill="none" stroke={color} strokeWidth="2" />
        ))}
      </svg>
    );
  if (kind === 1)
    return (
      <svg {...common}>
        {Array.from({ length: 10 }, (_, k) => (
          <rect key={k} x={-40 + k * 40} y="-40" width="14" height="520" fill={color} opacity={0.16 + (k % 3) * 0.1} transform="rotate(24 150 200)" />
        ))}
      </svg>
    );
  if (kind === 2)
    return (
      <svg {...common}>
        {Array.from({ length: 7 }, (_, r) =>
          Array.from({ length: 7 }, (_, q) => (
            <circle key={`${r}${q}`} cx={36 + q * 38} cy={34 + r * 34} r={2 + ((r + q) % 4)} fill={color} />
          ))
        )}
      </svg>
    );
  return (
    <svg {...common}>
      {[150, 108, 68, 30].map((r) => (
        <rect key={r} x={215 - r} y={130 - r} width={r * 2} height={r * 2} fill="none" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

function Reveal({ on, k = 0, reduce, className, children }) {
  return (
    <motion.div
      initial={false}
      animate={on ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: reduce ? "blur(0px)" : "blur(8px)" }}
      transition={{ duration: reduce ? 0 : 0.45, ease: EASE, delay: on && !reduce ? 0.22 + k * 0.07 : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────── One book ───────── */
function Book({ p, i, active, opened, cx, dims, shown, settled, reduce, onSelect, onToggle, onClose }) {
  const { coverW, coverH, spineW, R } = dims;
  const isActive = i === active;
  const a = Math.abs(i - active);
  const w = isActive ? coverW : spineW;
  const h = isActive ? coverH : Math.round(coverH * 0.9 * HEIGHTS[i % HEIGHTS.length]);
  const { z, rot } = place(cx, R);
  const pal = PALETTE[i % PALETTE.length];
  const compact = coverW < 250;
  const blur = !shown ? 12 : Math.min(2.5, a * 0.55);
  const isRepo = p.link?.includes("github.com");
  const chips = (p.tech || "").split(",").map((t) => t.trim()).slice(0, 4);
  const spreadOpen = isActive && opened;

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring", stiffness: 180, damping: 25, delay: settled ? 0 : Math.abs(i - active) * 0.05 };

  return (
    <motion.div
      data-book
      initial={false}
      animate={{
        x: cx - w / 2,
        z,
        rotateY: rot,
        width: w,
        height: h,
        y: shown ? 0 : 60,
        opacity: !shown ? 0 : isActive ? 1 : opened ? 0.25 : clamp(1 - a * 0.07, 0.55, 1),
      }}
      transition={spring}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 22,
        transformStyle: "preserve-3d",
        zIndex: isActive ? 35 : 10 - a,
        /* The wrapper is a plane in front of the page (which sits 2px behind it), so its
           empty box would swallow every click. Only the children take pointer events. */
        pointerEvents: "none",
      }}
    >
      {/* Inside page. Sits just BEHIND the cover plane, so the closed cover hides it
          and it never flashes over the cover while opening or closing. */}
      <div
        className="absolute inset-0 overflow-hidden rounded-r-lg bg-[#FAFBFD] shadow-2xl ring-1 ring-black/10"
        style={{
          transform: "translateZ(-2px)",
          visibility: isActive ? "visible" : "hidden",
          pointerEvents: spreadOpen ? "auto" : "none",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4"
          style={{ background: "linear-gradient(90deg, rgba(18,22,29,.22) 0%, transparent 100%)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-2"
          style={{ background: "repeating-linear-gradient(0deg, rgba(18,22,29,.12) 0 1px, transparent 1px 3px)" }}
        />

        <div className="relative z-20 flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="sp-display text-[11px] uppercase tracking-[0.14em] text-[var(--sp-slate)]">
              No. {pad(i + 1)} · Details
            </span>
          </div>

          <div className="my-auto py-2">
            <Reveal on={opened} k={1} reduce={reduce}>
              <h4 className="sp-display text-2xl font-semibold leading-tight text-[var(--sp-ink)] sm:text-3xl">{p.name}</h4>
            </Reveal>
            <Reveal on={opened} k={2} reduce={reduce}>
              <p className={`mt-3 text-[var(--sp-slate)] ${compact ? "line-clamp-4 text-xs leading-snug" : "line-clamp-5 text-[13.5px] leading-relaxed"}`}>
                {p.summary}
              </p>
            </Reveal>
          </div>

          <Reveal on={opened} k={3} reduce={reduce}>
            {!compact && chips.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <li key={c} className="sp-display rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[var(--sp-ink)] ring-1 ring-[var(--sp-rule)]">
                    {c}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between gap-2 border-t border-[var(--sp-rule)] pt-2">
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={spreadOpen ? 0 : -1}
                className="sp-display inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sp-blue)] hover:underline sm:text-sm"
              >
                {isRepo ? "Open repository" : "Open live site"} <ArrowUpRight className="h-4 w-4" />
              </a>
              <span className="font-mono text-[10px] text-[var(--sp-slate)]">Esc to close</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Cover: hinged on its left edge. The container never takes pointer events;
          only the face that currently points at the viewer does. */}
      <motion.div
        initial={false}
        animate={{ rotateY: spreadOpen ? -158 : 0, opacity: isActive ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 130, damping: 22 }}
        className="absolute inset-0"
        style={{
          transformOrigin: "0% 50%",
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        {/* Front face */}
        <button
          type="button"
          onClick={onToggle}
          tabIndex={isActive && !opened ? 0 : -1}
          aria-label={`Open ${p.name}`}
          className="absolute inset-0 block cursor-pointer overflow-hidden rounded-l-[3px] rounded-r-md text-left"
          style={{
            background: pal.bg,
            color: pal.tx,
            backfaceVisibility: "hidden",
            boxShadow: "inset 7px 0 8px -5px rgba(0,0,0,.35), 0 18px 40px rgba(18,22,29,.24)",
            pointerEvents: isActive && !opened ? "auto" : "none",
          }}
        >
          <Pattern kind={i % 4} color={pal.fg} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(105deg, rgba(255,255,255,.18), transparent 32%, transparent 70%, rgba(0,0,0,.15))" }}
          />
          <span className="relative flex h-full flex-col justify-between p-4 sm:p-5">
            <span className="sp-display text-[11px] uppercase tracking-[0.12em] opacity-75">No. {pad(i + 1)}</span>
            <span>
              <span className="sp-display block font-semibold leading-[0.95]" style={{ fontSize: Math.round(coverW * 0.13) }}>
                {p.name}
              </span>
              <span className="sp-display mt-3 flex items-center gap-1.5 text-[11px] opacity-75">
                <BookOpen className="h-3 w-3" /> Click to open
              </span>
            </span>
          </span>
        </button>

        {/* Back face: the swung-open left cover. Click it to close. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          tabIndex={spreadOpen ? 0 : -1}
          aria-label={`Close ${p.name}`}
          className="group absolute inset-0 block cursor-pointer overflow-hidden rounded-l-md rounded-r-[3px] text-left"
          style={{
            background: pal.bg,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 18px 40px rgba(18,22,29,.24)",
            pointerEvents: spreadOpen ? "auto" : "none",
          }}
        >
          <Pattern kind={(i + 1) % 4} color={pal.fg} />
          <div className="absolute inset-0 bg-white/[0.07] transition group-hover:bg-white/[0.14]" />
          <div className="relative flex h-full flex-col justify-between p-4 text-white/90 sm:p-5">
            <span className="sp-display text-[10px] uppercase tracking-wider opacity-60">Cover · click to close</span>
          </div>
        </button>
      </motion.div>

      {spreadOpen && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close book"
          title="Close"
          className="absolute right-2 top-2 z-[80] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[var(--sp-ink)] shadow-sm transition hover:bg-black/10"
          style={{ transform: "translateZ(8px)", pointerEvents: "auto" }}
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Spine (shown while the book is on the shelf) */}
      <motion.button
        type="button"
        onClick={onSelect}
        aria-label={`Show ${p.name}`}
        tabIndex={isActive ? -1 : 0}
        initial={false}
        animate={{ opacity: isActive ? 0 : 1, filter: reduce ? "blur(0px)" : `blur(${blur}px)` }}
        whileHover={isActive || reduce ? undefined : { y: -12, filter: "blur(0px)" }}
        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-between overflow-hidden rounded-[3px] py-3 ring-1 ring-black/5"
        style={{ background: pal.bg, color: pal.tx, boxShadow: SPINE_SHADOW, pointerEvents: isActive ? "none" : "auto" }}
      >
        <span className="sp-display text-[10px] tabular-nums opacity-60">{pad(i + 1)}</span>
        <span aria-hidden="true" className="absolute inset-x-0 top-8 h-px" style={{ background: pal.fg, opacity: 0.5 }} />
        <span className="sp-display whitespace-nowrap font-semibold" style={{ writingMode: "vertical-rl", fontSize: clamp(spineW * 0.36, 12, 17) }}>
          {p.name}
        </span>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-8 h-px" style={{ background: pal.fg, opacity: 0.5 }} />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: pal.fg }} />
      </motion.button>
    </motion.div>
  );
}

/* ───────── The shelf ───────── */
export function ProjectShelf({ items, startAt }) {
  const root = useContext(ScrollerCtx);
  const reduce = useReducedMotion();
  const n = items.length;
  const boxRef = useRef(null);
  const cw = useWidth(boxRef);
  const inView = useInView(boxRef, { root, once: true, margin: "0px 0px -20% 0px" });
  const shown = reduce || inView;
  const [settled, setSettled] = useState(false);
  const [active, setActive] = useState(startAt ?? Math.floor((n - 1) / 2));
  const [opened, setOpened] = useState(false);
  const lock = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), 1200);
    return () => clearTimeout(t);
  }, [inView]);

  /* Escape closes the book wherever focus is, as long as it is open */
  useEffect(() => {
    if (!opened) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpened(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  const dims = useMemo(() => {
    const coverW = Math.round(clamp(cw * 0.32, 210, 310));
    return {
      coverW,
      coverH: Math.round(coverW * 1.36),
      spineW: Math.round(clamp(cw / 19, 28, 52)),
      R: Math.max(cw * 0.85, 520),
    };
  }, [cw]);

  const centres = useMemo(() => {
    const { coverW, spineW } = dims;
    const half = (i) => (i === active ? coverW : spineW) / 2;
    const gap = (i, j) => GAP + (i === active || j === active ? 12 : 0);
    const c = new Array(n).fill(0);
    for (let i = active - 1; i >= 0; i--) c[i] = c[i + 1] - half(i + 1) - half(i) - gap(i, i + 1);
    for (let i = active + 1; i < n; i++) c[i] = c[i - 1] + half(i - 1) + half(i) + gap(i, i - 1);
    return c;
  }, [active, n, dims]);

  const select = (i) => {
    setOpened(false);
    setActive(((i % n) + n) % n);
  };
  const go = (d) => select(clamp(active + d, 0, n - 1));

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      setOpened((o) => !o);
    }
  };

  const onWheel = (e) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    const now = Date.now();
    if (now - lock.current < 450) return;
    lock.current = now;
    go(e.deltaX > 0 ? 1 : -1);
  };

  /* Click on empty shelf space (anything that is not a book) closes the book.
     No overlay element, so nothing can sit on top of the buttons. */
  const onStageClick = (e) => {
    if (opened && !e.target.closest("[data-book]")) setOpened(false);
  };

  const cur = items[active];
  const isRepo = cur?.link?.includes("github.com");
  const trans = reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 24 };
  const openedShift = Math.min(dims.coverW / 2, Math.max(0, (cw - dims.coverW) / 2));

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Project shelf"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      className="select-none outline-offset-4"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/70 shadow-sm ring-1 ring-[var(--sp-rule)]">
        <div
          ref={boxRef}
          onClick={onStageClick}
          className="relative"
          style={{
            height: dims.coverH + 68,
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
          }}
        >
          <motion.div
            onPanEnd={(_, info) => {
              if (info.offset.x < -50) go(1);
              else if (info.offset.x > 50) go(-1);
            }}
            className="absolute inset-0 touch-pan-y"
            style={{ perspective: 1500, perspectiveOrigin: "50% 35%" }}
          >
            <motion.div
              initial={false}
              animate={{ x: opened ? openedShift : 0 }}
              transition={trans}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", pointerEvents: "none" }}
            >
              {items.map((p, i) => (
                <Book
                  key={p.id}
                  p={p}
                  i={i}
                  active={active}
                  opened={opened}
                  cx={centres[i]}
                  dims={dims}
                  shown={shown}
                  settled={settled}
                  reduce={reduce}
                  onSelect={() => select(i)}
                  onToggle={() => setOpened((o) => !o)}
                  onClose={() => setOpened(false)}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Floor: soft shadow and a hairline */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] bottom-[14px] h-6 rounded-full bg-[var(--sp-ink)]/10 blur-xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[22px] h-px bg-[var(--sp-ink)]/25" />
        </div>
      </div>

      {/* Tick scrubber */}
      <div className="mt-6 flex h-10 items-end justify-center" role="group" aria-label="Choose a project">
        {items.map((p, i) => {
          const a = Math.abs(i - active);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => select(i)}
              aria-label={`Go to ${p.name}`}
              aria-current={i === active}
              tabIndex={-1}
              className="flex h-10 w-7 cursor-pointer items-end justify-center"
            >
              <motion.span
                initial={false}
                animate={{ height: 12 + Math.max(0, 22 - a * 7), backgroundColor: i === active ? "#2B3EF2" : "rgba(18,22,29,.3)" }}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                className="block w-[2px] rounded-full"
              />
            </button>
          );
        })}
      </div>

      {/* Caption and controls */}
      <div className="mt-6 grid items-start gap-6 border-t border-[var(--sp-rule)] pt-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <AnimatePresence mode="wait" initial={false}>
            {cur && (
              <motion.div
                key={cur.id}
                initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="sp-display text-sm tabular-nums text-[var(--sp-slate)]">
                  {pad(active + 1)} / {pad(n)}
                </p>
                <h3 className="sp-display mt-1 text-3xl font-semibold sm:text-4xl">{cur.name}</h3>
                <p className="sp-display mt-2 text-sm text-[var(--sp-slate)]">{cur.tech}</p>
                <div className="mt-4 flex items-center gap-5">
                  <a href={cur.link} target="_blank" rel="noopener noreferrer" className="sp-display sp-link inline-flex items-center gap-1 text-sm">
                    {isRepo ? "Open repository" : "Open live site"} <ArrowUpRight className="h-4 w-4" />
                  </a>
                  {opened && (
                    <button type="button" onClick={() => setOpened(false)} className="sp-display inline-flex cursor-pointer items-center gap-1 text-sm text-[var(--sp-blue)] hover:underline">
                      <X className="h-4 w-4" /> Close book
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={active === 0}
              aria-label="Previous project"
              className="cursor-pointer rounded-full p-2 ring-1 ring-[var(--sp-rule)] transition-colors hover:bg-[var(--sp-ink)] hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={active === n - 1}
              aria-label="Next project"
              className="cursor-pointer rounded-full p-2 ring-1 ring-[var(--sp-rule)] transition-colors hover:bg-[var(--sp-ink)] hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="sp-display text-xs text-[var(--sp-slate)]">
            Pick a spine · click the cover to open · click the left cover, empty space or Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectShelf;
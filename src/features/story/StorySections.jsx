import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, animate, useMotionValue, useMotionValueEvent,
  useReducedMotion, useScroll, useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollerCtx } from "./StoryMotion";

const EASE = [0.16, 1, 0.3, 1];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ───────────────────────── Scroll band ─────────────────────────
   Two rows of huge type slide in opposite directions as you scroll past. */
export function ScrollBand({ words = ["Build", "Queue", "Stream", "Review"] }) {
  const root = useContext(ScrollerCtx);
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container: root, offset: ["start end", "end start"] });
  const a = useTransform(scrollYProgress, [0, 1], ["6%", "-30%"]);
  const b = useTransform(scrollYProgress, [0, 1], ["-30%", "6%"]);
  const list = [...words, ...words, ...words];

  const row = (x, flip) => (
    <motion.div style={{ x: reduce ? 0 : x }} className="flex w-max gap-10 whitespace-nowrap">
      {list.map((w, i) => {
        const filled = (i + (flip ? 1 : 0)) % 2 === 1;
        return (
          <span
            key={i}
            className="sp-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[1.02]"
            style={filled
              ? { color: "var(--sp-blue)" }
              : { color: "transparent", WebkitTextStroke: "1.5px var(--sp-ink)" }}
          >
            {w}
          </span>
        );
      })}
    </motion.div>
  );

  return (
    <div ref={ref} aria-hidden="true" className="-ml-8 -mr-4 overflow-hidden py-10 sm:-mr-8 md:-ml-20">
      {row(a, false)}
      {row(b, true)}
    </div>
  );
}

/* ───────────────────────── Process (pinned, scroll turns into sideways travel) ───────────────────────── */
function StepCard({ s, i, n, p }) {
  const focus = useTransform(p, (v) => 1 - Math.min(1, Math.abs(v - i / (n - 1)) * n * 0.85));
  const opacity = useTransform(focus, (f) => 0.35 + 0.65 * f);
  const weight = useTransform(focus, (f) => `'wght' ${Math.round(200 + 600 * f)}, 'wdth' 100`);
  return (
    <motion.li style={{ opacity }} className="w-[85%] shrink-0 border-t border-[var(--sp-ink)] pt-5 sm:w-[58%] lg:w-[40%]">
      <motion.span style={{ fontVariationSettings: weight }} className="sp-display block text-7xl sm:text-8xl">
        {i + 1}
      </motion.span>
      <h3 className="sp-display mt-6 text-2xl font-semibold sm:text-3xl">{s.title}</h3>
      <p className="mt-3 max-w-[40ch] text-[var(--sp-slate)]">{s.text}</p>
    </motion.li>
  );
}

export function ProcessScroll({ title = "How I build", steps }) {
  const root = useContext(ScrollerCtx);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const view = useRef(null);
  const track = useRef(null);
  const [max, setMax] = useState(0);

  useLayoutEffect(() => {
    if (reduce || !view.current || !track.current) return;
    const m = () => setMax(Math.max(0, track.current.scrollWidth - view.current.clientWidth));
    m();
    const ro = new ResizeObserver(m);
    ro.observe(view.current);
    ro.observe(track.current);
    return () => ro.disconnect();
  }, [reduce, steps.length]);

  const { scrollYProgress } = useScroll({ target: ref, container: root, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * max);
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduce) {
    return (
      <div className="py-24 md:py-32">
        <h2 className="sp-display text-4xl font-semibold sm:text-5xl">{title}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-[var(--sp-ink)] pt-4">
              <span className="sp-display text-5xl">{i + 1}</span>
              <h3 className="sp-display mt-3 text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-[var(--sp-slate)]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `${120 + steps.length * 55}vh` }}>
      <div className="sticky top-6 flex h-[min(36rem,calc(100vh-9rem))] flex-col justify-between overflow-hidden py-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="sp-display text-4xl font-semibold sm:text-5xl">{title}</h2>
          <div className="mb-2 hidden h-[2px] w-40 bg-[var(--sp-rule)] sm:block" aria-hidden="true">
            <motion.div style={{ scaleX: fill, transformOrigin: "0 50%" }} className="h-full bg-[var(--sp-blue)]" />
          </div>
        </div>
        <div ref={view} className="overflow-hidden">
          <motion.ol ref={track} style={{ x }} className="flex w-max gap-8">
            {steps.map((s, i) => (
              <StepCard key={s.title} s={s} i={i} n={steps.length} p={scrollYProgress} />
            ))}
          </motion.ol>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Run demo (simulated VerifAI submission) ───────────────────────── */
/* ───────────────────────── Tuner (dial input) ─────────────────────────
   Drag, flick, click a label or use arrow keys. Ticks swell near the needle and
   the dial snaps to the nearest position, like tuning a radio. */
const STEP = 150;
const TICKS = 10;

function Tick({ x, pos, major }) {
  const h = useTransform(x, (v) => (major ? 30 : 14) + Math.max(0, 26 - Math.abs(pos + v) / 4));
  const bg = useTransform(x, (v) => (Math.abs(pos + v) < STEP / (TICKS * 2) ? "#2B3EF2" : "rgba(18,22,29,.35)"));
  return <motion.span aria-hidden="true" style={{ left: pos, height: h, backgroundColor: bg }} className="absolute bottom-0 w-[2px] -translate-x-1/2 rounded-full" />;
}

function TunerLabel({ x, pos, label, onPick }) {
  const color = useTransform(x, (v) => (Math.abs(pos + v) < STEP / 2 ? "#12161D" : "#5B6573"));
  return (
    <motion.button
      type="button" tabIndex={-1} onTap={onPick} style={{ left: pos, color }}
      className="sp-display absolute top-0 -translate-x-1/2 cursor-pointer whitespace-nowrap px-3 py-1 text-sm"
    >
      {label}
    </motion.button>
  );
}

export function Tuner({ options, value, onChange, label = "Filter skills" }) {
  const reduce = useReducedMotion();
  const n = options.length;
  const start = Math.max(0, options.findIndex((o) => o.id === value));
  const x = useMotionValue(-start * STEP);
  const [live, setLive] = useState(start);

  useMotionValueEvent(x, "change", (v) => setLive(clamp(Math.round(-v / STEP), 0, n - 1)));

  const snap = (i) => {
    const k = clamp(i, 0, n - 1);
    animate(x, -k * STEP, reduce ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 });
    onChange?.(options[k].id);
  };

  const onKey = (e) => {
    const map = { ArrowRight: live + 1, ArrowLeft: live - 1, Home: 0, End: n - 1 };
    if (e.key in map) { e.preventDefault(); snap(map[e.key]); }
  };

  const total = (n - 1) * TICKS;
  const cur = options[live];

  return (
    <div>
      <div
        role="slider" tabIndex={0} aria-label={label}
        aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={live} aria-valuetext={cur.label}
        onKeyDown={onKey}
        className="relative h-28 select-none overflow-hidden touch-pan-y"
        style={{
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)",
          maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)",
        }}
      >
        <motion.div
          drag="x" style={{ x }}
          dragConstraints={{ left: -(n - 1) * STEP, right: 0 }} dragElastic={0.08}
          onDragEnd={(_, info) => snap(Math.round(-(x.get() + info.velocity.x * 0.18) / STEP))}
          className="absolute left-1/2 top-0 h-full w-0 cursor-grab active:cursor-grabbing"
        >
          {Array.from({ length: total + 1 }, (_, i) => (
            <Tick key={i} x={x} pos={(i * STEP) / TICKS} major={i % TICKS === 0} />
          ))}
          {options.map((o, i) => (
            <TunerLabel key={o.id} x={x} pos={i * STEP} label={o.label} onPick={() => snap(i)} />
          ))}
          <span className="absolute left-0 top-0 h-full" style={{ width: (n - 1) * STEP }} aria-hidden="true" />
        </motion.div>

        <motion.span
          key={live} aria-hidden="true"
          initial={reduce ? false : { scaleY: 1.2 }} animate={{ scaleY: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          style={{ transformOrigin: "bottom" }}
          className="pointer-events-none absolute bottom-0 left-1/2 top-9 w-[2px] -translate-x-1/2 bg-[var(--sp-blue)]"
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--sp-rule)] pt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={cur.id}
            initial={reduce ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="sp-display text-3xl font-semibold sm:text-4xl"
          >
            {cur.label}
          </motion.span>
        </AnimatePresence>
        <span className="sp-display text-sm text-[var(--sp-slate)]">{cur.count} skills · drag the dial</span>
      </div>
    </div>
  );
}

/* ───────────────────────── Spotlight carousel ─────────────────────────
   One large frame in the middle, the rest in a receding strip either side.
   Drag, swipe, scroll sideways, arrow keys, buttons or wait for autoplay. */
const COVERS = [
  { bg: "#12161D", fg: "#2B3EF2", tx: "#FFFFFF" },
  { bg: "#2B3EF2", fg: "#EDEFF2", tx: "#FFFFFF" },
  { bg: "#DCE0F8", fg: "#2B3EF2", tx: "#12161D" },
];

function Cover({ i, name }) {
  const c = COVERS[i % COVERS.length];
  const shapes = [
    <g key="a">{[150, 105, 60, 22].map((r) => <circle key={r} cx="210" cy="110" r={r} fill="none" stroke={c.fg} strokeWidth="2" />)}</g>,
    <g key="b">{Array.from({ length: 9 }, (_, k) => <rect key={k} x={-20 + k * 40} y="-20" width="16" height="260" fill={c.fg} opacity={0.18 + (k % 3) * 0.12} transform="rotate(24 150 120)" />)}</g>,
    <g key="c">{Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, q) => <circle key={`${r}${q}`} cx={40 + q * 44} cy={30 + r * 36} r={2 + ((r + q) % 4)} fill={c.fg} />))}</g>,
  ][i % 3];
  return (
    <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={`${name} cover`}>
      <rect width="300" height="380" fill={c.bg} />
      {shapes}
      <text x="22" y="340" fontSize="38" fontWeight="700" fill={c.tx} style={{ fontFamily: '"Bricolage Grotesque", sans-serif', letterSpacing: "-0.02em" }}>{name}</text>
    </svg>
  );
}

export function SpotlightCarousel({ items }) {
  const reduce = useReducedMotion();
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const lock = useRef(0);
  const go = (d) => setActive((a) => (a + d + n) % n);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => go(1), 5200);
    return () => clearInterval(id);
  }, [active, paused, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const onWheel = (e) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    const now = Date.now();
    if (now - lock.current < 450) return;
    lock.current = now;
    go(e.deltaX > 0 ? 1 : -1);
  };

  const cur = items[active];

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label="Project spotlight" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onWheel={onWheel}
    >
      <motion.div
        onPanEnd={(_, i) => { if (i.offset.x < -50) go(1); else if (i.offset.x > 50) go(-1); }}
        className="relative h-[400px] touch-pan-y overflow-hidden sm:h-[440px]"
        style={{ perspective: 1200 }}
      >
        {items.map((p, i) => {
          let o = i - active;
          if (o > n / 2) o -= n;
          if (o < -n / 2) o += n;
          const a = Math.abs(o);
          return (
            <motion.button
              key={p.id} type="button" onClick={() => setActive(i)}
              aria-label={`Show ${p.name}`} aria-current={o === 0}
              initial={false}
              animate={{
                x: o * 250, scale: o === 0 ? 1 : 0.76, rotateY: reduce ? 0 : -o * 16,
                opacity: a > 2 ? 0 : 1 - a * 0.3,
              }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 28 }}
              style={{ zIndex: 10 - a, pointerEvents: a > 2 ? "none" : "auto" }}
              className="absolute left-1/2 top-4 -ml-[140px] h-[360px] w-[280px] cursor-pointer overflow-hidden rounded-xl shadow-[0_18px_50px_rgba(18,22,29,0.22)] sm:h-[400px]"
            >
              <Cover i={i} name={p.name} />
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-8 grid items-start gap-6 border-t border-[var(--sp-rule)] pt-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.id}
              initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h3 className="sp-display text-3xl font-semibold sm:text-4xl">{cur.name}</h3>
              <p className="mt-3 max-w-[56ch] text-[var(--sp-slate)]">{cur.summary}</p>
              <p className="sp-display mt-3 text-sm text-[var(--sp-slate)]">{cur.tech}</p>
              <a href={cur.link} target="_blank" rel="noopener noreferrer" className="sp-display sp-link mt-4 inline-flex items-center gap-1 text-sm">
                Open repository <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4 md:col-span-4 md:justify-end">
          <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="cursor-pointer rounded-full p-2 ring-1 ring-[var(--sp-rule)] transition-colors hover:bg-[var(--sp-ink)] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2" aria-hidden="true">
            {items.map((p, i) => (
              <motion.span key={p.id} animate={{ width: i === active ? 28 : 8 }} transition={{ duration: 0.3, ease: EASE }}
                className={`h-2 rounded-full ${i === active ? "bg-[var(--sp-blue)]" : "bg-[var(--sp-rule)]"}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next project" className="cursor-pointer rounded-full p-2 ring-1 ring-[var(--sp-rule)] transition-colors hover:bg-[var(--sp-ink)] hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
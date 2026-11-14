import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  motion, animate, useInView, useMotionTemplate, useMotionValue,
  useReducedMotion, useScroll, useSpring, useTransform, useVelocity,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

/* StoryPage's inner scroller. Every scroll-linked piece below reads it from here,
   because the page scrolls inside a div, not the window. */
export const ScrollerCtx = createContext(null);
const useScroller = () => useContext(ScrollerCtx);

/* 2. HERO: dot grid that only exists under the cursor.
   Put it as the first child of the hero <section className="relative ...">. */
export function HeroSpotlight() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 140, damping: 22 });
  const sy = useSpring(y, { stiffness: 140, damping: 22 });
  const mask = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, #000, transparent 72%)`;

  useEffect(() => {
    if (reduce) return;
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage: "radial-gradient(rgba(43,62,242,.55) 1.2px, transparent 1.6px)",
        backgroundSize: "22px 22px",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}

/* 3. HEADINGS: letters decode into place when the heading arrives */
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789&/#";
const scramble = (t, keep = 0) =>
  [...t].map((c, i) => (c === " " || i < keep ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");

export function Scramble({ text, as: Tag = "span", className = "" }) {
  const root = useScroller();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { root, once: true, margin: "0px 0px -20% 0px" });
  const [out, setOut] = useState(() => (reduce ? text : scramble(text)));

  useEffect(() => {
    if (!inView || reduce) return;
    let raf;
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min(1, (now - t0) / 900);
      setOut(scramble(text, Math.floor(p * text.length)));
      if (p < 1) raf = requestAnimationFrame(run);
      else setOut(text);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}

/* 4. BACKGROUND: a paragraph that fills in word by word as you scroll through it */
function Word({ w, p, a, b }) {
  const opacity = useTransform(p, [a, b], [0.16, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{w}</motion.span>;
}

export function WordFill({ text, className = "" }) {
  const root = useScroller();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container: root, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  if (reduce) return <p ref={ref} className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} w={w} p={scrollYProgress} a={i / words.length} b={(i + 1) / words.length} />
      ))}
    </p>
  );
}

/* 5. BACKGROUND: numbers count up while their weight swells from light to heavy */
function Stat({ to, decimals = 0, suffix = "", label }) {
  const root = useScroller();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { root, once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paint = (t) => {
      el.textContent = (to * t).toFixed(decimals) + suffix;
      el.style.fontVariationSettings = `'wght' ${Math.round(250 + 550 * t)}, 'wdth' 100`;
    };
    if (reduce) return paint(1);
    paint(0);
    if (!inView) return;
    const c = animate(0, 1, { duration: 1.8, ease: EASE, onUpdate: paint });
    return () => c.stop();
  }, [inView, reduce, to, decimals, suffix]);

  return (
    <div className="border-t border-[var(--sp-rule)] pt-5">
      <div ref={ref} className="sp-display text-6xl sm:text-7xl tabular-nums">{to}{suffix}</div>
      <p className="mt-2 text-sm text-[var(--sp-slate)]">{label}</p>
    </div>
  );
}

export function StatStrip({
  stats = [
    { to: 9.29, decimals: 2, label: "CGPA, B.Tech CSIT" },
    { to: 100, suffix: "+", label: "DSA questions solved, mostly C++" },
    { to: 13, suffix: "+", label: "public repositories" },
  ],
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {stats.map((s) => <Stat key={s.label} {...s} />)}
    </div>
  );
}

/* 8. STACK: marquees lean with scroll speed, like fabric catching wind */
export function SkewOnScroll({ children }) {
  const root = useScroller();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll({ container: root });
  const v = useVelocity(scrollY);
  const target = useTransform(v, [-2400, 2400], [-7, 7], { clamp: true });
  const skewX = useSpring(target, { stiffness: 180, damping: 22 });
  return <motion.div style={{ skewX: reduce ? 0 : skewX }}>{children}</motion.div>;
}

/* 9. WORK: a chip follows the cursor over the project list */
export function CursorChip({ active, label = "Open repo" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 420, damping: 32 });
  const sy = useSpring(y, { stiffness: 420, damping: 32 });
  useEffect(() => {
    const move = (e) => { x.set(e.clientX + 16); y.set(e.clientY + 16); };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return (
    <AnimatePresence>
      {active && !reduce && (
        <motion.span
          aria-hidden="true"
          style={{ x: sx, y: sy }}
          className="pointer-events-none fixed left-0 top-0 z-[120]"
        >
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
            className="sp-display flex items-center gap-1.5 rounded-full bg-[var(--sp-blue)] px-3 py-1.5 text-sm font-medium text-white"
          >
            {label}<ArrowUpRight className="h-3.5 w-3.5" />
          </motion.span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* 10. CONTACT: buttons lean toward the pointer */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const move = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x, y }} className="inline-block">
      {children}
    </motion.span>
  );
}

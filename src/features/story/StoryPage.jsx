import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, useReducedMotion,
  useMotionValue, useSpring, useMotionTemplate,
  useVelocity, useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ScrollPathAnimation from "./ScrollPathAnimation";
import { DEFAULT_STORY_MILESTONES } from "./storyMilestones";
import {
  ScrollerCtx, HeroSpotlight, Scramble, WordFill, StatStrip,
  SkewOnScroll, CursorChip, Magnetic,
} from "./StoryMotion";
import { ScrollBand, ProcessScroll, Tuner } from "./StorySections";
import ProjectShelf from "./ProjectShelf";
import {
  SiReact, SiNextdotjs, SiGreensock, SiFramer, SiTypescript, SiJavascript,
  SiTailwindcss, SiNodedotjs, SiExpress, SiRedis, SiSocketdotio,
  SiJsonwebtokens, SiPostman, SiMongodb, SiMongoose, SiGooglegemini,
  SiCplusplus, SiGit, SiGithub, SiGithubactions,
} from "react-icons/si";

const GITHUB_USER = "harshit-tiwari-codebase";
const GITHUB_BASE = `https://github.com/${GITHUB_USER}`;
const EMAIL = "harshittiwari20044@gmail.com";
const EASE = [0.16, 1, 0.3, 1];
const FOOTER_WORDMARK_WIDTH = 1200;
const FOOTER_WORDMARK_HEIGHT = 300;

/*
  Design tokens
  fog    #EDEFF2  page
  ink    #12161D  text, hover fill
  slate  #5B6573  secondary text
  rule   18,22,29 @ 14%  dividers
  blue   #2B3EF2  the path, links, focus

  Type
  Bricolage Grotesque (variable: width + weight) for headings and UI
  Source Serif 4 for reading text
*/
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400&display=swap";

const CSS = `
.sp-root{
  --sp-bg:#EDEFF2; --sp-ink:#12161D; --sp-slate:#5B6573;
  --sp-rule:rgba(18,22,29,.14); --sp-blue:#2B3EF2;
  background:var(--sp-bg); color:var(--sp-ink);
  font-family:"Source Serif 4",Georgia,"Times New Roman",serif;
  font-size:1.0625rem; line-height:1.65;
}
.sp-root ::selection{background:var(--sp-blue); color:#fff;}
.sp-display{
  font-family:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;
  font-optical-sizing:auto; letter-spacing:-0.02em; line-height:1.05;
}
.sp-root :focus-visible{outline:2px solid var(--sp-blue); outline-offset:3px; border-radius:4px;}
.sp-root, .sp-root *{scrollbar-width:none;}
.sp-root::-webkit-scrollbar, .sp-root *::-webkit-scrollbar{display:none; width:0; height:0;}

/* Lenis drives the scrolling, so native smooth scroll must stay off or the two fight */
.sp-scroll{scroll-behavior:auto !important; overscroll-behavior:contain;}

.sp-link{background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat; transition:color .2s, background-size .3s;}
.sp-link:hover{color:var(--sp-blue); background-size:100% 2px;}
.sp-wave{
  display:inline-block; white-space:pre;
  font-variation-settings:'wght' 600, 'wdth' 100;
  transition:font-variation-settings .45s cubic-bezier(.16,1,.3,1), transform .45s cubic-bezier(.16,1,.3,1), color .3s;
}
.group:hover .sp-wave, .group:focus-visible .sp-wave{
  font-variation-settings:'wght' 800, 'wdth' 100;
  transform:translateY(-3px); color:var(--sp-blue);
}
@media (prefers-reduced-motion: reduce){
  .sp-wave{transition:none; transform:none !important;}
}

/* Marquee */
.sp-marquee{
  overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
}
.sp-marquee-track{
  display:flex; width:max-content;
  animation:sp-marquee var(--sp-speed,42s) linear infinite;
  will-change:transform;
}
.sp-marquee:hover .sp-marquee-track,
.sp-marquee:focus-within .sp-marquee-track{animation-play-state:paused;}
.sp-marquee-group{display:flex; flex-shrink:0; gap:12px; padding-right:12px; margin:0; list-style:none;}
@keyframes sp-marquee{to{transform:translateX(-50%);}}
@media (prefers-reduced-motion: reduce){
  .sp-marquee{overflow-x:auto; -webkit-mask-image:none; mask-image:none;}
  .sp-marquee-track{animation:none;}
  .sp-marquee-group[aria-hidden="true"]{display:none;}
}
`;

const NAV = [
  { id: "story-hero", label: "" },
  { id: "story-about", label: "" },
  { id: "story-process", label: "" },
  { id: "story-education", label: "" },
  { id: "story-skills", label: "" },
  { id: "story-projects", label: "" },
];

const SKILL_CATEGORIES = [
  { id: "all", label: "Everything" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Data" },
  { id: "ai", label: "AI" },
  { id: "core", label: "Core CS" },
];

const repo = (name) => ({ name, url: `${GITHUB_BASE}/${name}` });

const SKILL_ICONS = {
  "React 19 & Next.js":        [{ Icon: SiReact, label: "React", color: "#149ECA" }, { Icon: SiNextdotjs, label: "Next.js", color: "#000000" }],
  "GSAP & Framer Motion":      [{ Icon: SiGreensock, label: "GSAP", color: "#88CE02" }, { Icon: SiFramer, label: "Framer Motion", color: "#0055FF" }],
  "TypeScript & JavaScript":   [{ Icon: SiTypescript, label: "TypeScript", color: "#3178C6" }, { Icon: SiJavascript, label: "JavaScript", color: "#CAA800" }],
  "Tailwind CSS v4":           [{ Icon: SiTailwindcss, label: "Tailwind CSS", color: "#06B6D4" }],
  "Node.js & Express":         [{ Icon: SiNodedotjs, label: "Node.js", color: "#5FA04E" }, { Icon: SiExpress, label: "Express", color: "#000000" }],
  "Redis & BullMQ":            [{ Icon: SiRedis, label: "Redis", color: "#FF4438" }],
  "Socket.io":                 [{ Icon: SiSocketdotio, label: "Socket.io", color: "#010101" }],
  "REST API design":           [{ Icon: SiJsonwebtokens, label: "JWT", color: "#000000" }, { Icon: SiPostman, label: "Postman", color: "#FF6C37" }],
  "MongoDB & Mongoose":        [{ Icon: SiMongodb, label: "MongoDB", color: "#47A248" }, { Icon: SiMongoose, label: "Mongoose", color: "#880000" }],
  "Gemini API":                [{ Icon: SiGooglegemini, label: "Gemini", color: "#8E75B2" }],
  "C++ & DSA":                 [{ Icon: SiCplusplus, label: "C++", color: "#00599C" }],
  "Git, GitHub & CI":          [{ Icon: SiGit, label: "Git", color: "#F05032" }, { Icon: SiGithub, label: "GitHub", color: "#181717" }, { Icon: SiGithubactions, label: "GitHub Actions", color: "#2088FF" }],
};

const SKILLS_DATA = [
  { name: "React 19 & Next.js", category: "frontend", tag: "Framework",
    description: "Component lifecycle, concurrent rendering, custom hooks, server components.",
    projects: [repo("macos-dev-portfolio"), repo("VerifAi"), repo("Nexora")] },
  { name: "GSAP & Framer Motion", category: "frontend", tag: "Motion",
    description: "Scroll-driven timelines, SVG path tracing, layout animation, spring physics.",
    projects: [repo("Refokus-Clone"), repo("VerifAi")] },
  { name: "TypeScript & JavaScript", category: "frontend", tag: "Languages",
    description: "Strict typing, generics, async/await, closures and the event loop.",
    projects: [repo("Argus"), repo("Nexora")] },
  { name: "Tailwind CSS v4", category: "frontend", tag: "Styling",
    description: "Grid and container queries, theme tokens, responsive layouts.",
    projects: [repo("macos-dev-portfolio"), repo("pixlify-mern")] },
  { name: "Node.js & Express", category: "backend", tag: "Runtime",
    description: "REST APIs, middleware design, streams and authentication.",
    projects: [repo("pixlify-mern"), repo("Nexora")] },
  { name: "Redis & BullMQ", category: "backend", tag: "Queues",
    description: "Background job queues, evaluation workers, caching and rate limiting.",
    projects: [repo("VerifAi")] },
  { name: "Socket.io", category: "backend", tag: "Real-time",
    description: "Event streaming, room broadcasts and live progress updates.",
    projects: [repo("VerifAi"), repo("emotify")] },
  { name: "REST API design", category: "backend", tag: "Architecture",
    description: "Resource structure, JWT flows, pagination, error schemas, idempotency.",
    projects: [repo("Argus"), repo("Nexora")] },
  { name: "MongoDB & Mongoose", category: "database", tag: "Database",
    description: "Aggregation pipelines, indexing, compound queries, schema validation, transactions.",
    projects: [repo("pixlify-mern"), repo("Argus")] },
  { name: "Gemini API", category: "ai", tag: "Applied AI",
    description: "Prompt design, structured JSON output, automated code review.",
    projects: [repo("VerifAi"), repo("Argus")] },
  { name: "C++ & DSA", category: "core", tag: "Fundamentals",
    description: "Trees, graphs, dynamic programming, STL, pointers and complexity analysis.",
    projects: [repo("LEARNINGS"), repo("JS-MINI-PROJECT")] },
  { name: "Git, GitHub & CI", category: "core", tag: "Tooling",
    description: "Feature branches, rebasing, conflict resolution, npm publishing, GitHub Actions.",
    projects: [{ name: "All repositories", url: GITHUB_BASE }] },
];

const PROJECTS = [
  { id: "verifai", name: "VerifAI",
    summary: "Code assessment platform. Submissions run in isolated Judge0 sandboxes through a BullMQ queue, then Gemini and Groq review them while Socket.io streams progress to the browser.",
    tech: "React, Judge0, BullMQ, Redis, Gemini API, Socket.io",
    link: "https://verif-ai-six.vercel.app/" },
  { id: "argus", name: "Argus",
    summary: "Argus project from my GitHub portfolio.",
    tech: "See repository for details",
    link: `${GITHUB_BASE}/Argus` },
  { id: "nexora", name: "Nexora",
    summary: "Modern web application platform with a fluid interface and responsive interactions.",
    tech: "JavaScript, Web UI",
    link: "https://nexora-kappa-gules.vercel.app/" },
  { id: "pixlify", name: "Pixlify",
    summary: "Full-stack MERN image editing and photo sharing application.",
    tech: "MongoDB, Express, React, Node.js",
    link: "https://pixlify-mern-1.onrender.com/" },
  { id: "macos", name: "macOS portfolio",
    summary: "This site: a Sonoma-style desktop in the browser with a window manager, draggable windows, a music player, a terminal and a boot screen.",
    tech: "React 19, Framer Motion, GSAP, Tailwind v4",
    link: `${GITHUB_BASE}/macos-dev-portfolio` },
];

/* Books on the shelf. VerifAI sits in the middle so the first view is balanced.
   The four extra books point at repos already linked in the Stack section: edit their text. */
const byId = (id) => PROJECTS.find((p) => p.id === id);
const SHELF = [
  byId("macos"),
  byId("pixlify"),
  { id: "refokus", name: "Refokus Clone", summary: "A scroll-driven site rebuilt with GSAP, as practice in timelines and pinned sections.", tech: "GSAP, ScrollTrigger", link: `${GITHUB_BASE}/Refokus-Clone` },
  byId("argus"),
  byId("verifai"),
  byId("nexora"),
  { id: "emotify", name: "Emotify", summary: "A real-time project built around Socket.io event streaming.", tech: "Socket.io, Node.js", link: `${GITHUB_BASE}/emotify` },
  { id: "learnings", name: "Learnings", summary: "C++ and data-structure practice: trees, graphs and dynamic programming.", tech: "C++, DSA", link: `${GITHUB_BASE}/LEARNINGS` },
  
];

const PROCESS_STEPS = [
  { title: "Shape the data", text: "Start from the queries the app will run, then design schemas and indexes around them." },
  { title: "Keep requests light", text: "Move slow work onto a queue so the API answers fast and workers scale on their own." },
  { title: "Stream the progress", text: "Push every stage back over sockets so people see what is happening instead of a spinner." },
  { title: "Review, then ship", text: "Automated review and tests gate each release, and fundamentals decide what stays." },
];

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* Marquee data: every tech chip, split across two rows */
const MARQUEE_ITEMS = Object.values(SKILL_ICONS).flat();
const ROW_A = MARQUEE_ITEMS.filter((_, i) => i % 2 === 0);
const ROW_B = MARQUEE_ITEMS.filter((_, i) => i % 2 === 1);

function WaveText({ text, reduce }) {
  return (
    <span aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="sp-wave"
          style={{ transitionDelay: reduce ? "0ms" : `${i * 18}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* Two copies of the same group, so translateX(-50%) loops seamlessly. */
function Marquee({ items, reverse = false, speed = 42 }) {
  return (
    <div className="sp-marquee" role="presentation">
      <div
        className="sp-marquee-track"
        style={{ "--sp-speed": `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="sp-marquee-group" aria-hidden={copy === 1 ? "true" : undefined}>
            {items.map(({ Icon, label, color }) => (
              <li
                key={label}
                className="sp-display flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm ring-1 ring-[var(--sp-rule)]"
              >
                <Icon className="h-4 w-4" style={{ color }} />
                {label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* One chip in the chain. Each has its own spring, softer the further back it sits.
   Chips shrink, fade and tilt with the cursor's velocity. */
function TrailIcon({ Icon, color, index, mx, my, reduce }) {
  const cfg = reduce
    ? { stiffness: 1000, damping: 80 }
    : { stiffness: 380 - index * 70, damping: 24 + index * 3, mass: 0.6 + index * 0.15 };
  const x = useSpring(mx, cfg);
  const y = useSpring(my, cfg);
  const vx = useVelocity(x);
  const tilt = useSpring(useTransform(vx, [-1800, 1800], [-22, 22]), { stiffness: 300, damping: 20 });

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0"
      style={{ x, y, zIndex: 20 - index }}
    >
      <motion.span style={{ rotate: reduce ? 0 : tilt }} className="block">
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1 - index * 0.06, opacity: 1 - index * 0.12 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22, delay: reduce ? 0 : index * 0.04 }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(18,22,29,0.18)] ring-1 ring-black/5"
          style={{ marginLeft: 22 + index * 30, marginTop: -22 }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </motion.span>
      </motion.span>
    </motion.span>
  );
}

function SkillRow({ skill, open, onToggle, reduce }) {
  const icons = SKILL_ICONS[skill.name] || [];
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spot = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(43,62,242,0.08), transparent 70%)`;

  const track = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <motion.li
      variants={rowVariants}
      className="border-t border-[var(--sp-rule)]"
    >
      <div
        ref={wrapRef}
        className="relative"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          track(e); // set position first so the chips mount at the cursor
          setHover(true);
        }}
        onPointerMove={(e) => e.pointerType === "mouse" && track(e)}
        onPointerLeave={() => setHover(false)}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: spot }}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group relative flex w-full items-center gap-6 py-5 text-left cursor-pointer"
        >
          <span className="sp-display text-2xl sm:text-3xl font-semibold">
            <WaveText text={skill.name} reduce={reduce} />
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-4 text-sm text-[var(--sp-slate)]">
            <span className="sp-display hidden w-24 text-right md:inline">{skill.tag}</span>
            <Plus className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          </span>
        </button>

        {/* Trail only while the row is closed, so it never doubles the chips in the panel */}
        <AnimatePresence>
          {hover && !open &&
            icons.map(({ Icon, label, color }, i) => (
              <TrailIcon key={label} Icon={Icon} color={color} index={i} mx={mx} my={my} reduce={reduce} />
            ))}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 max-w-[60ch]">
              <ul className="mb-4 flex flex-wrap gap-2">
                {icons.map(({ Icon, label, color }, i) => (
                  <motion.li
                    key={label}
                    initial={reduce ? false : { opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24, delay: reduce ? 0 : 0.12 + i * 0.06 }}
                    className="sp-display flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-[var(--sp-rule)]"
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                    {label}
                  </motion.li>
                ))}
              </ul>
              <p className="text-[var(--sp-slate)]">{skill.description}</p>
              <p className="mt-3 text-sm">
                <span className="sp-display text-[var(--sp-slate)]">Used in </span>
                {skill.projects.map((p, i) => (
                  <span key={p.name}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="sp-link">{p.name}</a>
                    {i < skill.projects.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function StoryPage({ onClose, onOpenWindow }) {
  const scrollerRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openSkill, setOpenSkill] = useState(null);
  const [activeSection, setActiveSection] = useState("story-hero");
  const [copied, setCopied] = useState(false);
  const [hoverWork, setHoverWork] = useState(null);
  const footerGradientRef = useRef(null);
  const [footerWordmarkActive, setFooterWordmarkActive] = useState(false);

  /* Fonts */
  useEffect(() => {
    if (document.getElementById("sp-fonts")) return;
    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = "https://fonts.gstatic.com";
    pre.crossOrigin = "anonymous";
    const link = document.createElement("link");
    link.id = "sp-fonts";
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.append(pre, link);
  }, []);

  /* Smooth scrolling.
     Lenis eases the wheel input on the inner scroller, and GSAP's ticker drives it
     so the scroll path animation reads the same position every frame. */
  useEffect(() => {
    const wrapper = scrollerRef.current;
    const content = contentRef.current;
    if (!wrapper || !content || reduce) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP defaults, so the rest of the site is unaffected
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  /* Escape closes */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Keep the active nav item in sync with the Story page's own scroll container. */
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const updateActiveSection = () => {
      const threshold = root.getBoundingClientRect().top + root.clientHeight * 0.35;
      let current = NAV[0].id;
      for (const { id } of NAV) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) current = id;
      }
      setActiveSection(current);
    };

    root.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();
    return () => root.removeEventListener("scroll", updateActiveSection);
  }, []);

  const go = (id) => {
    const wrapper = scrollerRef.current;
    const el = document.getElementById(id);
    if (!wrapper || !el) return;

    setActiveSection(id);
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, { offset: -24, duration: 1.15 });
      return;
    }

    const target = Math.max(
      0,
      wrapper.scrollTop + el.getBoundingClientRect().top - wrapper.getBoundingClientRect().top - 24
    );
    wrapper.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const moveFooterGradient = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = ((e.clientX - bounds.left) / bounds.width) * FOOTER_WORDMARK_WIDTH;
    const y = ((e.clientY - bounds.top) / bounds.height) * FOOTER_WORDMARK_HEIGHT;
    const gradient = footerGradientRef.current;
    if (gradient) {
      gradient.setAttribute("cx", `${x}`);
      gradient.setAttribute("cy", `${y}`);
    }
  };

  const skills = activeCategory === "all" ? SKILLS_DATA : SKILLS_DATA.filter((s) => s.category === activeCategory);

  /* The one orchestrated moment: the name rises into place while its width opens up. */
  const nameWord = (word, delay) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="sp-display block"
        initial={reduce ? false : { y: "105%", fontVariationSettings: "'wdth' 75, 'wght' 800" }}
        animate={{ y: "0%", fontVariationSettings: "'wdth' 100, 'wght' 700" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
        style={{ fontVariationSettings: "'wdth' 100, 'wght' 700" }}
      >
        {word}
      </motion.span>
    </span>
  );

  return (
    <ScrollerCtx.Provider value={scrollerRef}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="sp-root fixed inset-0 z-[100] flex flex-col overflow-hidden"
    >
      <style>{CSS}</style>

      {/* Header */}
      <header
        className="sticky top-0 z-50 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--sp-rule)] px-4 py-3 sm:px-8 backdrop-blur"
        style={{ backgroundColor: "rgba(237,239,242,0.88)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="sp-display flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--sp-blue)] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to desktop
          <span className="hidden sm:inline rounded border border-[var(--sp-rule)] px-1.5 text-xs text-[var(--sp-slate)]">Esc</span>
        </button>

        <nav className="sp-display order-3 flex basis-full items-center justify-center gap-4 overflow-x-auto text-xs sm:gap-6 sm:text-sm md:order-none md:basis-auto" aria-label="Sections">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => go(n.id)}
              aria-current={activeSection === n.id ? "true" : undefined}
              className={`relative whitespace-nowrap py-1 transition-colors cursor-pointer ${activeSection === n.id ? "text-[var(--sp-ink)]" : "text-[var(--sp-slate)] hover:text-[var(--sp-ink)]"}`}
            >
              {n.label}
              {activeSection === n.id && (
                <motion.span
                  layoutId="sp-nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[var(--sp-blue)]"
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href={GITHUB_BASE} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[var(--sp-slate)] transition-colors hover:text-[var(--sp-ink)]">
            <FaGithub className="h-[18px] w-[18px]" />
          </a>
          <a href="https://www.linkedin.com/in/harshit-tiwari-48830b3b4/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[var(--sp-slate)] transition-colors hover:text-[var(--sp-ink)]">
            <FaLinkedin className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="sp-display rounded-full bg-[var(--sp-ink)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--sp-blue)] cursor-pointer"
          >
            {copied ? "Email copied" : "Copy email"}
          </button>
        </div>

      </header>

      {/* Scroll area */}
      <div ref={scrollerRef} className="sp-scroll relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <ScrollPathAnimation scrollerRef={scrollerRef} milestones={DEFAULT_STORY_MILESTONES} zIndex={20} />

        <div ref={contentRef} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8">
          <div className="pl-8 md:pl-20">
            {/* Hero */}
            <section id="story-hero" className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-end pb-20 pt-16">
              <HeroSpotlight />
              <h1 className="text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.92] tracking-[-0.035em]">
                {nameWord("Harshit", 0.1)}
                {nameWord("Tiwari", 0.22)}
              </h1>

              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-10 max-w-[52ch]"
              >
                <p className="text-xl md:text-2xl leading-snug">
                  I’m a full-stack developer who builds MERN apps and the queues, sockets and AI review layers
                  behind them. I study CSIT at IPS IES Academy.
                </p>
                <p className="mt-5 text-[var(--sp-slate)]">
                  Start with{" "}
                  <button type="button" onClick={() => go("story-projects")} className="sp-link cursor-pointer text-[var(--sp-ink)]">the work</button>
                  {" "}or read{" "}
                  <button type="button" onClick={() => go("story-about")} className="sp-link cursor-pointer text-[var(--sp-ink)]">how I got here</button>.
                </p>
              </motion.div>
            </section>

            {/* Background */}
            <section id="story-about" className="scroll-mt-20 py-24 md:py-32">
              <WordFill
                text="Fundamentals first, then backends that keep up, then AI where it earns its place."
                className="sp-display max-w-[24ch] text-3xl font-semibold sm:text-5xl"
              />
              <div className="mt-16">
                <StatStrip />
              </div>

              <div className="mt-24 grid gap-12 lg:grid-cols-12">
                <Scramble
                  as="h2"
                  text="How I got here"
                  className="sp-display text-4xl sm:text-5xl font-semibold lg:col-span-4 lg:sticky lg:top-8 lg:self-start"
                />
                <div className="lg:col-span-8 max-w-[60ch]">
                  {[
                    { h: "Fundamentals first", p: "I study Computer Science and IT at IPS Academy, Institute of Engineering & Science, in Indore. Coursework centres on data structures, OOP, operating systems, databases and networks." },
                    { h: "Backends that keep up", p: "In VerifAI, Redis and BullMQ take heavy work off the request path and Socket.io streams progress back. In my MongoDB projects I tune aggregations and indexes so queries stay fast." },
                    { h: "AI where it earns its place", p: "VerifAI runs submitted code in Judge0 sandboxes, then hands the results to Gemini and Groq for a structured review." },
                    { h: "Daily practice", p: "I’ve solved more than 500 problems on LeetCode (vision0808), GeeksforGeeks and HackerRank. That habit shapes how I reason about time, space and recursion in production code." },
                  ].map((a, i) => (
                    <article key={a.h} className={`py-8 ${i === 0 ? "" : "border-t border-[var(--sp-rule)]"} ${i === 0 ? "pt-0" : ""}`}>
                      <h3 className="sp-display text-2xl font-semibold">{a.h}</h3>
                      <p className="mt-3 text-[var(--sp-slate)]">{a.p}</p>
                    </article>
                  ))}
                </div>
              </div>

            </section>

            <ScrollBand />

            {/* Process */}
            <section id="story-process" className="scroll-mt-20">
              <ProcessScroll steps={PROCESS_STEPS} />
            </section>

            {/* Education and a verified milestone make the learning path tangible. */}
            <section id="story-education" className="scroll-mt-20 py-24 md:py-32">
              <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <Scramble as="h2" text="Education & recognition" className="sp-display block text-4xl font-semibold sm:text-5xl" />
                  <p className="mt-4 max-w-[34ch] text-[var(--sp-slate)]">
                    The work starts with strong fundamentals and keeps moving through hands-on challenges.
                  </p>
                </div>
                <div className="lg:col-span-8">
                    <article className="border-t border-[var(--sp-rule)] py-7">
                      <p className="sp-display text-sm text-[var(--sp-slate)]">2024 — present</p>
                      <h3 className="sp-display mt-2 text-2xl font-semibold">B.Tech, Computer Science &amp; IT</h3>
                      <p className="mt-2 max-w-[54ch] text-[var(--sp-slate)]">
                        IPS Academy, Institute of Engineering &amp; Science, Indore. Building a foundation in algorithms,
                        databases, operating systems, and networks alongside project work.
                      </p>
                    </article>
                    <article className="border-t border-[var(--sp-rule)] py-7">
                      <p className="sp-display text-sm text-[var(--sp-slate)]">EY Techathon 5.0</p>
                      <h3 className="sp-display mt-2 text-2xl font-semibold">A first-round challenge</h3>
                      <p className="mt-2 max-w-[54ch] text-[var(--sp-slate)]">
                        Participated in the Executive Summary Submission round, organised by EY.
                      </p>
                      <a
                        href="/documents/EY_Techathon_5_Participation.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sp-link mt-4 inline-flex text-sm"
                      >
                        View participation certificate
                      </a>
                    </article>
                </div>
              </div>
            </section>

            {/* Stack */}
            <section id="story-skills" className="scroll-mt-20 py-24 md:py-32">
              <Scramble as="h2" text="Stack" className="sp-display block text-4xl sm:text-5xl font-semibold" />
              <p className="mt-4 max-w-[52ch] text-[var(--sp-slate)]">
                Each skill links to the repositories where I used it. Select one to see the details.
              </p>

              <div className="mt-10 -mr-4 sm:-mr-8">
                <SkewOnScroll>
                  <div className="space-y-3">
                    <Marquee items={ROW_A} speed={46} />
                    <Marquee items={ROW_B} speed={54} reverse />
                  </div>
                </SkewOnScroll>
              </div>

              <div className="mt-12">
                <Tuner
                  options={SKILL_CATEGORIES.map((c) => ({
                    ...c,
                    count: c.id === "all" ? SKILLS_DATA.length : SKILLS_DATA.filter((k) => k.category === c.id).length,
                  }))}
                  value={activeCategory}
                  onChange={(id) => { setActiveCategory(id); setOpenSkill(null); }}
                />
              </div>

              <motion.ul
                key={activeCategory}
                initial={reduce ? false : "hidden"}
                animate="show"
                variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.045 } } }}
                className="mt-8 border-b border-[var(--sp-rule)]"
              >
                {skills.map((s) => (
                  <SkillRow
                    key={s.name}
                    skill={s}
                    open={openSkill === s.name}
                    onToggle={() => setOpenSkill(openSkill === s.name ? null : s.name)}
                    reduce={reduce}
                  />
                ))}
              </motion.ul>
            </section>

            {/* Work */}
            <section id="story-projects" className="scroll-mt-20 py-24 md:py-32">
              <Scramble as="h2" text="Selected work" className="sp-display block text-4xl sm:text-5xl font-semibold" />

              <div className="mt-12">
                <ProjectShelf items={SHELF} startAt={SHELF.findIndex((p) => p.id === "verifai")} />
              </div>

              <h3 className="sp-display mt-24 text-2xl font-semibold">All repositories</h3>

              {/* One ink panel slides between rows (shared layoutId) instead of each row filling on its own */}
              <div
                className="relative mt-6 overflow-hidden border-b border-[var(--sp-rule)]"
                onPointerLeave={() => setHoverWork(null)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setHoverWork(null);
                }}
              >
                {PROJECTS.map((p) => {
                  const active = hoverWork === p.id;
                  return (
                    <a
                      key={p.id}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onPointerEnter={(e) => e.pointerType === "mouse" && setHoverWork(p.id)}
                      onFocus={() => setHoverWork(p.id)}
                      className="relative block h-[168px] border-t border-[var(--sp-rule)] md:h-[144px]"
                    >
                      {active && (
                        <motion.span
                          aria-hidden="true"
                          layoutId="sp-work-hover"
                          className="absolute inset-0 bg-[var(--sp-ink)]"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 38 }
                          }
                        />
                      )}

                      <span
                        className={`relative grid h-full content-center gap-3 px-5 py-4 transition-colors duration-200 md:grid-cols-12 md:gap-8 ${active ? "text-white" : "text-[var(--sp-ink)]"}`}
                      >
                        <span className="sp-display line-clamp-1 text-3xl font-semibold sm:text-4xl md:col-span-5">{p.name}</span>
                        <span className="md:col-span-6">
                          <span className={`line-clamp-2 block transition-colors duration-200 ${active ? "text-white/75" : "text-[var(--sp-slate)]"}`}>{p.summary}</span>
                          <span className={`sp-display mt-2 block truncate text-sm transition-colors duration-200 ${active ? "text-white/60" : "text-[var(--sp-slate)]"}`}>{p.tech}</span>
                        </span>
                        <span className="hidden justify-end md:col-span-1 md:flex">
                          <ArrowUpRight
                            className={`h-6 w-6 transition-transform duration-300 ${active ? "translate-x-1 -translate-y-1" : ""}`}
                          />
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
              <CursorChip active={!!hoverWork} />
            </section>

            {/* Contact */}
            <footer className="pb-8 pt-16">
              <p className="sp-display text-3xl sm:text-5xl font-semibold max-w-[20ch]">
                I’m looking for software engineering roles.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Magnetic>
                  <button type="button" onClick={copyEmail} className="sp-display sp-link text-lg cursor-pointer">
                    {copied ? "Email copied" : EMAIL}
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenWindow?.("projects"); }}
                    className="sp-display sp-link text-lg text-[var(--sp-slate)] cursor-pointer"
                  >
                    Open the desktop version
                  </button>
                </Magnetic>
              </div>

              <svg
                viewBox={`0 0 ${FOOTER_WORDMARK_WIDTH} ${FOOTER_WORDMARK_HEIGHT}`}
                className="mt-14 block h-auto w-full select-none"
                onPointerMove={moveFooterGradient}
                onPointerEnter={() => setFooterWordmarkActive(true)}
                onPointerLeave={() => setFooterWordmarkActive(false)}
                role="img"
                aria-label="harshit.dev"
              >
                <defs>
                  <radialGradient
                    id="sp-footer-glow"
                    ref={footerGradientRef}
                    gradientUnits="userSpaceOnUse"
                    cx={FOOTER_WORDMARK_WIDTH / 2}
                    cy={FOOTER_WORDMARK_HEIGHT / 2}
                    r="240"
                  >
                    <stop offset="0%" stopColor="#2B3EF2" />
                    <stop offset="45%" stopColor="#8793F8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#EDEFF2" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <text
                  x={FOOTER_WORDMARK_WIDTH / 2}
                  y={FOOTER_WORDMARK_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  textLength={FOOTER_WORDMARK_WIDTH - 40}
                  lengthAdjust="spacingAndGlyphs"
                  fontSize="230"
                  fontWeight="800"
                  fill="url(#sp-footer-glow)"
                  stroke="rgba(43,62,242,0.32)"
                  strokeWidth="1"
                  style={{
                    fontFamily: '"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif',
                    fillOpacity: footerWordmarkActive ? 1 : 0,
                    transition: reduce ? "none" : "fill-opacity .4s ease",
                  }}
                >
                  harshit.dev
                </text>
              </svg>

              <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--sp-rule)] pt-5 text-sm text-[var(--sp-slate)] sm:flex-row">
                <p>© {new Date().getFullYear()} Harshit. All rights reserved.</p>
                <nav className="flex gap-6" aria-label="Footer links">
                  <a href={GITHUB_BASE} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--sp-blue)]">GitHub</a>
                  <a href="https://www.linkedin.com/in/harshit-tiwari-48830b3b4/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--sp-blue)]">LinkedIn</a>
                  <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-[var(--sp-blue)]">Email</a>
                </nav>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </motion.div>
    </ScrollerCtx.Provider>
  );
}
import React, { useEffect, useRef, useState } from "react";
import {
  motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { FolderOpen, Gamepad2, Search, Sparkles } from "lucide-react";

/* ─────────────────── TUNABLE CONSTANTS ─────────────────── */
const RANGE               = 95;     // px of cursor influence radius (compact & precise)
const MAGNIFY             = 1.25;   // peak scale at cursor (balanced, not oversized)
const SPRING              = { mass: 0.05, stiffness: 320, damping: 25 }; // ultra-smooth & fast response
const PAD                 = 7;      // shelf side / bottom padding in px
const GLASS_TINT_ALPHA    = 0.11;   // default shelf tint (0 = clear, 1 = opaque)
const DISPLACEMENT_SCALE  = 16;     // subtle liquid glass displacement
/* ─────────────────────────────────────────────────────────── */

/* ─────────────────── macOS Trash Icon SVG ─────────────────── */
function MacTrashIcon({ size = 32 }) {
  const s = size * 0.78; // inner icon at 78% of container
  return (
    <svg
      width={s} height={s} viewBox="0 0 64 72"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 drop-shadow select-none"
      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" }}
    >
      {/* Lid */}
      <rect x="10" y="8" width="44" height="6" rx="3" fill="url(#lidGrad)" />
      <rect x="22" y="4" width="20" height="6" rx="3" fill="url(#lidGrad)" />
      {/* Lid hinge line */}
      <rect x="10" y="13" width="44" height="1.5" rx="0.75" fill="rgba(0,0,0,0.12)" />

      {/* Body */}
      <path
        d="M14 18 L16 64 Q16 68 20 68 L44 68 Q48 68 48 64 L50 18 Z"
        fill="url(#bodyGrad)"
      />
      {/* Body sheen left */}
      <path
        d="M14 18 L16 64 Q16 68 20 68 L22 68 L20 18 Z"
        fill="rgba(255,255,255,0.18)"
      />
      {/* Body sheen right */}
      <path
        d="M50 18 L48 64 Q48 68 44 68 L42 68 L44 18 Z"
        fill="rgba(0,0,0,0.08)"
      />

      {/* Vertical lines (wire ribs) */}
      {[25, 32, 39].map((x) => (
        <rect key={x} x={x} y="22" width="2" height="40" rx="1" fill="rgba(0,0,0,0.20)" />
      ))}

      {/* Top rim of body */}
      <rect x="14" y="18" width="36" height="2" rx="1" fill="rgba(255,255,255,0.3)" />

      {/* Gradients */}
      <defs>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d0da" />
          <stop offset="100%" stopColor="#a0abb8" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0c9d4" />
          <stop offset="60%" stopColor="#adb6c2" />
          <stop offset="100%" stopColor="#98a2ae" />
        </linearGradient>
      </defs>
    </svg>
  );
}
/* ──────────────────────────────────────────────────────────── */

/* ── Feature-detect SVG filter support (Chromium only) ── */
let _glassSupported = null;
function supportsGlassFilter() {
  if (_glassSupported !== null) return _glassSupported;
  try {
    // Chrome / Edge expose a non-empty string; Firefox / Safari return ""
    const el = document.createElement("div");
    el.style.backdropFilter = "url(#x)";
    _glassSupported = el.style.backdropFilter !== "";
  } catch {
    _glassSupported = false;
  }
  return _glassSupported;
}

/* ── Responsive dock size ── */
function useDockSize() {
  const [vw, setVw] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  const desktop = vw >= 768;
  // Compact, authentic macOS icon baseline size (40px–48px)
  const base = desktop ? Math.max(38, Math.min(48, Math.floor((vw - 80) / 22))) : 38;
  return { base, desktop };
}

/* ────────────────────────────────────────────────────────────
   Hidden SVG that defines the Liquid-Glass displacement filter.
   Only rendered on Chromium where backdrop-filter: url() works.
   The feTurbulence seeds a very fine static noise pattern that is
   used as a displacement map → refracts background near shelf edges.
──────────────────────────────────────────────────────────────*/
function LiquidGlassSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <defs>
        {/* Displacement filter — bends background behind the shelf */}
        <filter
          id="dock-glass"
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          {/* Fine static noise that creates refraction texture */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65 0.45"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          {/* Displacement: bend background pixels using noise R/G channels */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={DISPLACEMENT_SCALE}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Clamp to prevent colour fringing */}
          <feComposite in="displaced" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Tooltip glass filter — lighter distortion */}
        <filter
          id="dock-tooltip-glass"
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75 0.55"
            numOctaves="1"
            seed="7"
            result="noise2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise2"
            scale={8}
            xChannelSelector="R"
            yChannelSelector="G"
            result="d2"
          />
          <feComposite in="d2" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Glass shelf component.
   - On Chromium: backdrop-filter with refraction URL filter
   - On others  : fallback blur / saturate
   glassStrength: "auto" | "light" | "strong"
──────────────────────────────────────────────────────────────*/
function Glass({ height, radius, glassStrength = "auto", className = "" }) {
  const [chromium] = useState(() => {
    if (typeof window === "undefined") return false;
    return supportsGlassFilter();
  });

  const tintMultiplier =
    glassStrength === "strong" ? 1.4
    : glassStrength === "light" ? 0.7
    : 1;                                           // "auto" → 1×
  const tintA = Math.min(0.55, GLASS_TINT_ALPHA * tintMultiplier);

  /* Clean macOS frosted-glass tint — white/grey tinted, not pure white */
  const bg = `linear-gradient(180deg,
    rgba(255,255,255,${(tintA + 0.14).toFixed(2)}) 0%,
    rgba(240,242,248,${tintA.toFixed(2)}) 100%)`;

  /* Chromium: add SVG-filter refraction; others: extra blur */
  const bdFilter = chromium
    ? `url(#dock-glass) blur(2px) saturate(160%) brightness(1.04)`
    : `blur(32px) saturate(180%) brightness(1.05)`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}
      style={{
        height,
        borderRadius: radius,
        background: bg,
        backdropFilter: bdFilter,
        WebkitBackdropFilter: bdFilter,
        boxShadow: [
          `0 24px 60px rgba(0,0,0,.28)`,           // deep ambient shadow
          `0 4px 12px rgba(0,0,0,.12)`,             // mid shadow
          `inset 0 1px 0 rgba(255,255,255,.75)`,    // top specular (bright line)
          `inset 0 -1px 0 rgba(255,255,255,.12)`,   // bottom rim
          `inset 0 0 0 .5px rgba(255,255,255,.52)`, // full perimeter edge
        ].join(","),
      }}
    >
      {/* Gradient rim light — sharp bright at top, fades to transparent */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          padding: "1px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.95) 0%, rgba(255,255,255,.06) 40%, rgba(255,255,255,.22) 100%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Single dock icon with:
   - spring-animated squircle (border-radius = size × 0.2237)
   - top→bottom gradient overlay
   - inner rim + 1px top highlight + drop shadow
   - tooltip (glass pill)
   - running indicator dot
──────────────────────────────────────────────────────────────*/
function DockItem({ item, mouseX, base, magnify, activeWindow, reduce }) {
  const ref = useRef(null);
  const controls = useAnimationControls();
  const [pressed, setPressed] = useState(false);
  const { id, label, image, Icon, CustomIcon, color, action, running, bounce, gradient } = item;

  /* ── Cosine magnification ── */
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(distance, (d) => {
    if (!magnify) return base;
    const t = Math.min(1, Math.abs(d) / RANGE);
    return base + base * (MAGNIFY - 1) * ((Math.cos(t * Math.PI) + 1) / 2);
  });
  const size   = useSpring(target, SPRING);
  // Apple squircle radius animates with the spring
  const radius = useTransform(size, (s) => s * 0.2237);

  /* ── Launch bounce ── */
  const click = () => {
    if (!action) return;
    if (bounce && !reduce) {
      controls.start({
        y: [0, -26, 0, -16, 0, -7, 0],
        transition: { duration: 1.2, ease: "easeOut", times: [0, 0.18, 0.36, 0.52, 0.68, 0.82, 1] },
      });
    }
    action();
  };

  return (
    <motion.div animate={controls} className="group relative flex shrink-0 flex-col items-center">
      {/* ── Tooltip: glass pill, no arrow ── */}
      <span
        className={`pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-[9px] px-3 py-[5px] text-[13px] font-medium leading-none text-white/95 opacity-0 transition-opacity duration-150 ${pressed ? "" : "group-hover:opacity-100"}`}
        style={{
          background: "rgba(36,36,38,.62)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 6px 20px rgba(0,0,0,.28), inset 0 0 0 .5px rgba(255,255,255,.22)",
        }}
      >
        {label}
      </span>

      {/* ── Icon button ── */}
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={!action}
        onClick={click}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          position: "relative",
          overflow: "hidden",
          ...(gradient ? { backgroundImage: gradient } : { backgroundColor: color }),
        }}
        className={`flex items-center justify-center outline-none transition-[filter] duration-100 focus-visible:ring-2 focus-visible:ring-white ${
          action ? "cursor-pointer active:brightness-75" : "cursor-default"
        }`}
      >
        {/* Content: image, custom SVG, or lucide icon — 80% of icon box */}
        {image ? (
          <img src={image} alt="" draggable="false" className="relative z-10 h-[80%] w-[80%] select-none object-contain drop-shadow" />
        ) : item.CustomIcon ? (
          <item.CustomIcon size={base} />
        ) : (
          <Icon className="relative z-10 h-[56%] w-[56%] text-white drop-shadow" strokeWidth={2.1} />
        )}

        {/* Apple-style gradient overlay: top highlight → bottom shadow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "inherit",
            background: "linear-gradient(170deg, rgba(255,255,255,.18) 0%, rgba(0,0,0,.08) 100%)",
          }}
        />

        {/* Inner rim: 0.5px border + 1px top specular highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "inherit",
            boxShadow: [
              "inset 0 0 0 .5px rgba(255,255,255,.28)",   // full perimeter rim
              "inset 0 1px 0 rgba(255,255,255,.45)",       // top 1px highlight
              "0 3px 10px rgba(0,0,0,.30)",               // soft drop shadow
              "0 1px 3px rgba(0,0,0,.18)",                // tight shadow
            ].join(","),
          }}
        />
      </motion.button>

      {/* ── Running indicator dot ── */}
      <span
        aria-hidden="true"
        className={`mt-[3px] h-[4px] w-[4px] rounded-full transition-opacity duration-300 ${
          running ? (activeWindow === id ? "bg-white opacity-100" : "bg-white/70 opacity-80") : "opacity-0 bg-white"
        }`}
        style={running ? { boxShadow: "0 0 2px rgba(0,0,0,.35)" } : undefined}
      />
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Dock root
──────────────────────────────────────────────────────────────*/
const Dock = ({
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
  onOpenStory,
  isStoryOpen,
  glassStrength = "auto",   // "auto" | "light" | "strong"
}) => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { base, desktop } = useDockSize();
  const mouseX = useMotionValue(Infinity);
  const magnify = desktop && !reduce;

  const openWindow = (windowName) => {
    setWindowState((state) => ({ ...state, [windowName]: true }));
    setActiveWindow?.(windowName);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: windowName }));
  };
  const win  = (id, label, image, color) => ({ id, label, image, color, action: () => openWindow(id), running: WindowState[id], bounce: true });
  const link = (id, label, image, color, url) => ({ id, label, image, color, action: () => window.open(url, "_blank", "noopener,noreferrer") });

  const groups = [
    [{
      id: "search", label: t("search"), Icon: Search,
      gradient: "linear-gradient(135deg,#98a3b1,#67717f)",
      action: () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })),
    }],
    [
      win("github", t("github"), "/doc-icons/github.svg", "#171717"),
      {
        id: "music",
        label: t("music"),
        image: "/doc-icons/apple-music.svg",
        gradient: "linear-gradient(135deg, #fc677e 0%, #fa243c 50%, #c90724 100%)",
        color: "#fa233b",
        action: () => openWindow("music"),
        running: WindowState.music || WindowState.spotify,
        bounce: true,
      },
      win("note", t("notes"), "/doc-icons/note.svg", "#f4c542"),
      win("resume", t("resume"), "/doc-icons/pdf.svg", "#df292f"),
      win("cli", t("terminal"), "/doc-icons/cli.svg", "#282b32"),
      link("linkedin", "LinkedIn", "/doc-icons/linkedin.svg", "#0a66c2", "https://www.linkedin.com/in/harshit-tiwari-48830b3b4/"),
      win("calendar", t("calendar") || "Calendar", "/doc-icons/calendar.svg", "#FF3B30"),
    ],
    [
      { id: "story", label: "My Journey", image: "/images/my-journey.svg", color: "#5B34E8", action: onOpenStory, running: isStoryOpen, bounce: true },
      win("ai", t("askAi"), "/doc-icons/harshit-ai.svg", "#6D28D9"),
      win("stats", t("stats"), "/doc-icons/github-stats.svg", "#10141a"),
      win("contact", t("contact"), "/doc-icons/mail.svg", "#168de2"),
      win("blog", t("blog"), "/doc-icons/blog.svg", "#f7f7fa"),
      win("achievements", t("achievements"), "/doc-icons/achievements.svg", "#f57c0f"),
      { id: "finder", label: `Finder · ${t("soon")}`, Icon: FolderOpen, color: "#31a9f3" },
      { id: "game", label: `Mini Game · ${t("soon")}`, Icon: Gamepad2, color: "#ed6280" },
    ],
    [{ id: "trash", label: "Trash", CustomIcon: MacTrashIcon, gradient: "linear-gradient(145deg,#d8dde5 0%,#c2c8d2 40%,#b0b8c4 100%)" }],
  ];

  const shelfH = base + PAD * 2 + 6;       // icon height + padding top/bottom + dot row
  const shelfR = Math.round(base * 0.52);  // large Tahoe-style corner radius

  return (
    <nav
      aria-label="Dock"
      className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2 max-md:max-w-[calc(100vw-12px)] sm:bottom-3"
    >
      {/* Hidden SVG filter definitions (Liquid Glass refraction) */}
      <LiquidGlassSVG />

      <div className="relative">
        {/* Shelf — fixed height; icons float upward out of it */}
        <Glass height={shelfH} radius={shelfR} glassStrength={glassStrength} className="hidden md:block" />

        <div
          onPointerMove={(e) => e.pointerType === "mouse" && mouseX.set(e.clientX)}
          onPointerLeave={() => mouseX.set(Infinity)}
          className="relative flex items-end gap-[4px] max-md:overflow-x-auto"
          style={{ height: shelfH, paddingInline: PAD, paddingBottom: PAD - 5 }}
        >
          {/* Mobile glass (inside scrollable row) */}
          <div className="md:hidden absolute inset-0 -z-10">
            <Glass height={shelfH} radius={shelfR} glassStrength={glassStrength} />
          </div>

          {groups.map((group, gi) => (
            <React.Fragment key={gi}>
              {/* Group separator */}
              {gi > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-[4px] shrink-0 self-end"
                  style={{
                    width: "1px",
                    height: base * 0.72,
                    marginBottom: 7,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.45) 70%, rgba(255,255,255,0.0) 100%)",
                  }}
                />
              )}
              {group.map((item) => (
                <DockItem
                  key={`${item.id}-${base}`}
                  item={item}
                  mouseX={mouseX}
                  base={base}
                  magnify={magnify}
                  activeWindow={activeWindow}
                  reduce={reduce}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Dock;

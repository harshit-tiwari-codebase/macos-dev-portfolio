import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_STORY_MILESTONES } from "./storyMilestones";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SVG_NS = "http://www.w3.org/2000/svg";

/* One line, one colour. Matches the --sp-* tokens in StoryPage. */
const BLUE = "#2B3EF2";
const BG = "#EDEFF2";
const RULE = "rgba(18, 22, 29, 0.16)";
const PATH_START_GAP = 36;
const PATH_END_GAP = 12;

/* Gentle wave that hugs the left gutter of the content column. */
function buildPath(w, h) {
  const small = w < 640;
  const colLeft = Math.max(0, (w - 1152) / 2);
  const cx = colLeft + (small ? 14 : 30);
  const amp = small ? 5 : 11;
  const step = small ? 380 : 520;
  const count = Math.max(4, Math.round(h / step));
  const top = Math.min(PATH_START_GAP, h);
  const bottom = Math.max(top, h - PATH_END_GAP);

  const pts = [];
  for (let i = 0; i <= count; i++) {
    const wave = Math.sin(i * 1.15 + 0.5) * 0.65 + Math.sin(i * 2.1 + 1.2) * 0.35;
    const x = i === 0 || i === count ? cx : cx + wave * amp;
    pts.push({ x, y: top + (i / count) * (bottom - top) });
  }

  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function ScrollPathAnimation({
  scrollerRef,
  milestones = DEFAULT_STORY_MILESTONES,
  zIndex = 0,
}) {
  const wrapRef = useRef(null);
  const baseRef = useRef(null);
  const litRef = useRef(null);
  const headRef = useRef(null);
  const msRef = useRef(null);
  const msKey = JSON.stringify(milestones);
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* Measure the scroller's real content height and keep it in sync,
     including when siblings grow or shrink (skill filter, accordion).
     We never measure our own absolutely-sized wrapper, otherwise the
     height could only ever grow. */
  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const parent = wrap.parentElement;
    let raf = 0;
    const measure = () => {
      const w = parent ? parent.clientWidth : wrap.clientWidth;
      let h = wrap.clientHeight;
      if (parent) {
        const content = Array.from(parent.children)
          .filter((c) => c !== wrap)
          .reduce((m, c) => Math.max(m, c.offsetTop + c.offsetHeight), 0);
        h = Math.max(content, parent.clientHeight);
      }
      setSize((prev) =>
        Math.abs(prev.w - w) < 2 && Math.abs(prev.h - h) < 2 ? prev : { w, h }
      );
    };
    measure();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    if (parent) {
      ro.observe(parent);
      Array.from(parent.children).forEach((c) => {
        if (c !== wrap) ro.observe(c);
      });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const d = useMemo(
    () => (size.h ? buildPath(size.w, size.h) : ""),
    [size.w, size.h]
  );

  useIsoLayoutEffect(() => {
    if (!d) return;
    const wrap = wrapRef.current;
    const base = baseRef.current;
    const lit = litRef.current;
    const head = headRef.current;
    const msGroup = msRef.current;
    const scroller = scrollerRef?.current;
    if (!wrap || !base || !lit || !head || !scroller) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = base.getTotalLength();
    const H = size.h;

    /* y -> path length lookup */
    const N = Math.max(100, Math.min(1500, Math.ceil(len / 3)));
    const ls = new Float32Array(N + 1);
    const ys = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) {
      ls[i] = (len * i) / N;
      ys[i] = base.getPointAtLength(ls[i]).y;
    }
    const lengthAtY = (y) => {
      if (y <= ys[0]) return 0;
      if (y >= ys[N]) return len;
      let lo = 0;
      let hi = N;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid;
        else hi = mid;
      }
      const f = (y - ys[lo]) / (ys[hi] - ys[lo] || 1);
      return ls[lo] + f * (ls[hi] - ls[lo]);
    };

    lit.setAttribute("stroke-dasharray", `${len}`);
    lit.setAttribute("stroke-dashoffset", `${len}`);

    const mk = (tag, attrs) => {
      const el = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };

    /* Keep each node level with the heading that names its section. */
    const items = [];
    if (msGroup) {
      msGroup.replaceChildren();
      const parentTop = scroller.getBoundingClientRect().top;
      JSON.parse(msKey).forEach(({ id, at }) => {
        const el = id ? document.getElementById(id) : null;
        const heading = el?.querySelector("h1, h2");
        let y = (at || 0) * H;
        if (el) {
          const sectionRect = el.getBoundingClientRect();
          const sectionTop = sectionRect.top - parentTop + scroller.scrollTop;
          const headingOffset = heading
            ? heading.getBoundingClientRect().top - sectionRect.top
            : 0;
          const headingCenter = heading
            ? headingOffset + heading.offsetHeight / 2
            : 8;
          y = sectionTop + headingCenter;
        }
        const L = lengthAtY(y);
        const p = base.getPointAtLength(L);
        const g = mk("g", { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` });
        const ring = mk("circle", { r: 5.5, fill: BG, stroke: RULE, "stroke-width": 1.5 });
        ring.style.transition = "fill .3s ease, stroke .3s ease";
        const pulse = mk("circle", { r: 5.5, fill: "none", stroke: BLUE, "stroke-width": 1.5, opacity: 0 });
        g.append(ring, pulse);
        msGroup.appendChild(g);
        items.push({ L, on: false, ring, pulse });
      });
    }

    const setNode = (it, on, instant) => {
      if (it.on === on) return;
      it.on = on;
      it.ring.setAttribute("fill", on ? BLUE : BG);
      it.ring.setAttribute("stroke", on ? BLUE : RULE);
      if (on && !instant && !reduce) {
        gsap.fromTo(
          it.pulse,
          { attr: { r: 5.5 }, opacity: 0.7 },
          { attr: { r: 18 }, opacity: 0, duration: 0.8, ease: "power2.out", overwrite: true }
        );
      }
    };

    let first = true;
    const render = (L) => {
      const pt = base.getPointAtLength(L);
      head.setAttribute("transform", `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);
      lit.setAttribute("stroke-dashoffset", (len - L).toFixed(1));
      items.forEach((it) => setNode(it, L >= it.L - 2, first));
    };

    const ctx = gsap.context(() => {
      const state = { p: 0 };
      const update = () => {
        const startY = Math.min(PATH_START_GAP, H);
        const endY = Math.max(startY, H - PATH_END_GAP);
        render(lengthAtY(startY + state.p * (endY - startY)));
      };
      update();
      first = false;

      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: wrap,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: reduce ? true : 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => {
      ctx.revert();
      msGroup?.replaceChildren();
    };
  }, [d, size.w, size.h, msKey, scrollerRef]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: size.h > 0 ? `${size.h}px` : "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex,
      }}
    >
      {d && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          <path ref={baseRef} d={d} fill="none" stroke={RULE} strokeWidth="1.5" strokeLinecap="round" />
          <path ref={litRef} d={d} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <g ref={msRef} />
          <g ref={headRef}>
            <circle r="11" fill={BLUE} fillOpacity="0.14" />
            <circle r="5" fill={BLUE} stroke={BG} strokeWidth="2" />
          </g>
        </svg>
      )}
    </div>
  );
}

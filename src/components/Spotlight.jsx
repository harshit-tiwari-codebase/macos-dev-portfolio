import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Search, AppWindow, FolderGit2, Terminal, Palette, ExternalLink } from "lucide-react";

/* ---------- fuzzy scoring: higher = better match, 0 = no match ---------- */
function score(query, text) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s\-_/]+/).some((w) => w.startsWith(q))) return 60;
  if (t.includes(q)) return 40;
  // subsequence match: "prj" -> "projects"
  let i = 0;
  for (const ch of t) if (ch === q[i]) i++;
  return i === q.length ? 20 : 0;
}

const GROUP_ORDER = ["Applications", "Commands", "Projects"];
const GROUP_ICON = {
  Applications: AppWindow,
  Commands: Terminal,
  Projects: FolderGit2,
};

/**
 * Props
 *  open        boolean
 *  setOpen     (bool) => void
 *  items       [{ id, title, subtitle?, group, keywords?, icon?, action }]
 *              group is "Applications" | "Commands" (Projects are fetched here)
 */
export default function Spotlight({ open, setOpen, items = [] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [repos, setRepos] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  /* ---------- global hotkeys: Cmd/Ctrl+K toggles, Esc closes ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  /* ---------- reset + focus whenever it opens ---------- */
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  /* ---------- load GitHub repos once (silent fail on rate limit) ---------- */
  useEffect(() => {
    if (!open || repos.length) return;
    axios
      .get("https://api.github.com/users/harshit-tiwari-codebase/repos?per_page=100&sort=updated")
      .then((res) => setRepos(res.data))
      .catch(() => {}); // rate-limited: Projects group simply stays empty
  }, [open, repos.length]);

  /* ---------- build, filter and rank results ---------- */
  const results = useMemo(() => {
    const projectItems = repos.map((r) => ({
      id: `repo-${r.id}`,
      title: r.name,
      subtitle: r.description || r.language || "GitHub repository",
      group: "Projects",
      keywords: [r.language, ...(r.topics || [])].filter(Boolean).join(" "),
      icon: FolderGit2,
      action: () => window.open(r.html_url, "_blank", "noopener"),
      external: true,
    }));

    return [...items, ...projectItems]
      .map((it) => ({
        ...it,
        _s: Math.max(score(query, it.title), score(query, `${it.keywords || ""} ${it.subtitle || ""}`) * 0.5),
      }))
      .filter((it) => it._s > 0)
      .sort((a, b) => {
        // with no query keep group order; with a query rank by score
        if (!query) return GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
        return b._s - a._s;
      })
      .slice(0, 12);
  }, [items, repos, query]);

  useEffect(() => setActive(0), [query]);

  /* ---------- keep highlighted row in view ---------- */
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (item) => {
    if (!item) return;
    setOpen(false);
    item.action();
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Spotlight search"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/70 text-white shadow-2xl backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* search field */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Search size={22} className="shrink-0 text-white/60" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Spotlight Search"
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-transparent text-xl outline-none placeholder:text-white/40"
              />
              <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-xs text-white/50">esc</kbd>
            </div>

            {/* results */}
            {results.length > 0 ? (
              <ul ref={listRef} className="max-h-80 overflow-y-auto border-t border-white/10 p-2">
                {results.map((item, i) => {
                  const Icon = item.icon || GROUP_ICON[item.group] || AppWindow;
                  const showHeader = i === 0 || results[i - 1].group !== item.group;
                  return (
                    <li key={item.id}>
                      {showHeader && (
                        <p className="px-3 pb-1 pt-2 text-xs font-medium text-white/50">{item.group}</p>
                      )}
                      <button
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => run(item)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                          i === active ? "bg-blue-500" : ""
                        }`}
                      >
                        <Icon size={20} className="shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.title}</span>
                          {item.subtitle && (
                            <span
                              className={`block truncate text-xs ${
                                i === active ? "text-white/80" : "text-white/50"
                              }`}
                            >
                              {item.subtitle}
                            </span>
                          )}
                        </span>
                        {item.external && <ExternalLink size={14} className="shrink-0 opacity-70" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="border-t border-white/10 px-4 py-6 text-center text-sm text-white/50">
                No results for “{query}”
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Re-export so App.jsx can import the icon set it needs for commands */
export { Palette };

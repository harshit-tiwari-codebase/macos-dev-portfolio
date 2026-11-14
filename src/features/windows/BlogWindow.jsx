import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Clock3, Heart, LoaderCircle, MessageSquare } from "lucide-react";
import MacWindow from "./MacWindow";

const username = import.meta.env.VITE_DEVTO_USERNAME || "harshit";
const BlogWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=30`)
      .then((response) => { if (!response.ok) throw new Error("Articles unavailable"); return response.json(); })
      .then((data) => { if (!cancelled) setArticles(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return (
    <MacWindow windowName={windowName} setWindowState={setWindowState} WindowState={WindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} title="Blog & Articles" initialWidth={820} initialHeight={620}>
      <div className="h-full overflow-y-auto bg-[#f7f7fa] p-4 text-zinc-900 sm:p-6 light-scrollbar" data-lenis-prevent>
        <header className="mb-5"><p className="mb-1 flex items-center gap-2 text-sm text-orange-600"><img src="/doc-icons/blog.svg" alt="" className="h-5 w-5 rounded object-contain" /> DEV Community</p><h1 className="text-3xl font-bold">{t("articles")}</h1><p className="mt-1 text-sm text-zinc-500">{t("writingBy")} @{username}</p></header>
        {loading && <p className="flex items-center gap-2 rounded-xl bg-white p-5 text-sm text-zinc-500"><LoaderCircle size={16} className="animate-spin" /> Loading articles…</p>}
        {error && <p className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">Could not load articles right now. The feed will retry the next time this window opens.</p>}
        {!loading && !error && !articles.length && <p className="rounded-xl bg-white p-5 text-sm text-zinc-500">No published articles were returned for this DEV username yet.</p>}
        <div className="grid gap-4 md:grid-cols-2">{articles.map((article) => <article key={article.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">{article.cover_image && <img src={article.cover_image} alt="" className="h-36 w-full object-cover" loading="lazy" />}<div className="p-4"><div className="mb-2 flex flex-wrap gap-1.5">{(article.tag_list || []).slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] text-orange-700">#{tag}</span>)}</div><h2 className="line-clamp-2 text-lg font-semibold">{article.title}</h2><p className="mt-2 line-clamp-3 text-sm text-zinc-500">{article.description}</p><div className="mt-4 flex items-center gap-3 text-xs text-zinc-400"><span className="flex items-center gap-1"><Clock3 size={13} />{article.reading_time_minutes} min</span><span className="flex items-center gap-1"><Heart size={13} />{article.positive_reactions_count}</span><span className="flex items-center gap-1"><MessageSquare size={13} />{article.comments_count}</span><a href={article.url} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1 font-medium text-blue-600">Read <ArrowUpRight size={14} /></a></div></div></article>)}</div>
      </div>
    </MacWindow>
  );
};

export default BlogWindow;

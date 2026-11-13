import React from "react";
import { useTranslation } from "react-i18next";
import { Award, BookOpenCheck, ExternalLink, GraduationCap, Trophy } from "lucide-react";
import MacWindow from "./MacWindow";

const ACHIEVEMENTS = [
  { title: "EY Techathon 5.0 — Round 1", detail: "Participated in the Executive Summary Submission round, organised by EY.", date: "Certificate of Participation", icon: Trophy },
  { title: "Strong academic performance", detail: "CGPA 9.29 in BTech / CSIT at IPS IES Academy, Indore.", date: "2024 – Present", icon: GraduationCap },
  { title: "Building full-stack projects", detail: "Portfolio work includes React, Tailwind CSS, Framer Motion, GitHub integrations, and a markdown notes system.", date: "Ongoing", icon: BookOpenCheck },
];

const AchievementsWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const { t } = useTranslation();
  return (
  <MacWindow windowName={windowName} setWindowState={setWindowState} WindowState={WindowState} activeWindow={activeWindow} setActiveWindow={setActiveWindow} title="Achievements & Certificates" initialWidth={720} initialHeight={560}>
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#111827] to-[#17132c] p-4 text-white sm:p-7">
      <header className="mb-6"><p className="mb-2 flex items-center gap-2 text-sm text-amber-300"><img src="/doc-icons/achievements.svg" alt="" className="h-5 w-5 rounded object-contain" /> {t("trophyCase")}</p><h1 className="text-2xl font-bold sm:text-3xl">{t("achievements")} &amp; {t("certificates")}</h1><p className="mt-2 text-sm text-white/55">{t("verifiedAwards")}</p></header>
      <div className="space-y-3">{ACHIEVEMENTS.map(({ title, detail, date, icon: Icon }, index) => <article key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${index === 0 ? "bg-amber-400/15 text-amber-300" : "bg-blue-400/15 text-blue-300"}`}><Icon size={22} /></div><div className="min-w-0 flex-1"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-white/60">{detail}</p><p className="mt-2 text-xs text-white/40">{date}</p>{index === 0 && <a href="/documents/EY_Techathon_5_Participation.pdf" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-300/15 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/25"><ExternalLink size={13} /> View participation certificate</a>}</div></article>)}</div>
      <section className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4"><h2 className="mb-1 flex items-center gap-2 text-sm font-semibold"><Award size={16} /> {t("certificates")}</h2><p className="text-sm text-white/55">EY Techathon 5.0 participation certificate is available above. No other certificate details were supplied.</p></section>
    </div>
  </MacWindow>
  );
}

export default AchievementsWindow;

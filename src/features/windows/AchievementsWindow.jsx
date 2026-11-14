import React from "react";
import { useTranslation } from "react-i18next";
import { Award, BookOpenCheck, ExternalLink, GraduationCap, Trophy } from "lucide-react";
import MacWindow from "./MacWindow";

const ACHIEVEMENTS = [
  { title: "EY Techathon 5.0 — Round 1", detail: "Participated in the Executive Summary Submission round, organised by EY.", date: "Certificate of Participation", icon: Trophy },
  { title: "Strong academic performance", detail: "CGPA 9.29 in BTech / CSIT at IPS IES Academy, Indore.", date: "2024 – Present", icon: GraduationCap },
  { title: "Building full-stack projects", detail: "Portfolio work includes React, Tailwind CSS, Framer Motion, GitHub integrations, and a markdown notes system.", date: "Ongoing", icon: BookOpenCheck },
];

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif';

/* macOS Settings-style icon tiles: one gradient per row */
const TILE_GRADIENTS = [
  "linear-gradient(180deg, #ffd25a 0%, #f59e0b 100%)", // amber
  "linear-gradient(180deg, #4aa8ff 0%, #0a64e8 100%)", // blue
  "linear-gradient(180deg, #5fe08a 0%, #1fa855 100%)", // green
];

const IconTile = ({ icon: Icon, gradient, size = 36, iconSize = 19 }) => (
  <div
    aria-hidden="true"
    className="flex shrink-0 items-center justify-center rounded-[10px] text-white"
    style={{
      width: size,
      height: size,
      background: gradient,
      boxShadow:
        "inset 0 0.5px 0 rgba(255,255,255,0.55), 0 0 0 0.5px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)",
    }}
  >
    <Icon size={iconSize} strokeWidth={2.2} />
  </div>
);

const AchievementsWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const { t } = useTranslation();
  const [featured, ...rest] = ACHIEVEMENTS;

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Achievements & Certificates"
      initialWidth={720}
      initialHeight={560}
    >
      <div
        className="h-full overflow-y-auto p-5 text-white sm:p-7"
        style={{
          fontFamily: FONT_STACK,
          background:
            "radial-gradient(90% 60% at 100% 0%, rgba(245,158,11,0.13) 0%, rgba(245,158,11,0) 60%), linear-gradient(180deg, #15171d 0%, #0d1015 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <header className="mb-6 flex items-center gap-4">
            <img
              src="/doc-icons/achievements.svg"
              alt=""
              className="h-12 w-12 shrink-0 rounded-[12px] object-contain"
            />
            <div className="min-w-0">
              <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[30px]">
                {t("achievements")} &amp; {t("certificates")}
              </h1>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/50">{t("verifiedAwards")}</p>
            </div>
          </header>

          {/* Featured: the one item with a verifiable document */}
          <article
            className="relative overflow-hidden rounded-[22px] p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,196,64,0.20) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.04) 100%)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
              boxShadow:
                "inset 0 0.5px 0 rgba(255,255,255,0.4), 0 0 0 0.5px rgba(255,214,120,0.25), 0 14px 34px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-start gap-4">
              <IconTile icon={featured.icon} gradient={TILE_GRADIENTS[0]} size={48} iconSize={25} />
              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.015em]">{featured.title}</h2>
                <p className="mt-1.5 max-w-[52ch] text-[13.5px] leading-relaxed text-white/65">{featured.detail}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="/documents/EY_Techathon_5_Participation.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium text-[#3a2400] transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                    style={{
                      background: "linear-gradient(180deg, #ffe08a 0%, #f5b021 100%)",
                      boxShadow:
                        "inset 0 0.5px 0 rgba(255,255,255,0.7), 0 0 0 0.5px rgba(120,70,0,0.5), 0 4px 12px rgba(245,176,33,0.28)",
                    }}
                  >
                    <ExternalLink size={13} aria-hidden="true" /> View participation certificate
                  </a>
                  <span className="text-[12px] text-white/45">{featured.date}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Grouped inset list, as in macOS Settings */}
          <div className="mt-4 overflow-hidden rounded-[16px] bg-white/[0.055] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/[0.09] divide-y divide-white/[0.08]">
            {rest.map(({ title, detail, date, icon }, index) => (
              <article key={title} className="flex items-start gap-3.5 px-4 py-3.5">
                <IconTile icon={icon} gradient={TILE_GRADIENTS[index + 1]} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h2 className="text-[14px] font-semibold leading-snug tracking-[-0.01em]">{title}</h2>
                    <span className="shrink-0 text-[12px] text-white/40">{date}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/60">{detail}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-4 flex items-center gap-3 rounded-[16px] bg-black/20 px-4 py-3.5 ring-1 ring-inset ring-white/[0.07]">
            <Award size={17} className="shrink-0 text-white/45" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-white/55">
              <span className="font-medium text-white/80">{t("certificates")}</span>
              {" · "}The EY Techathon 5.0 participation certificate is linked above. More will be added here.
            </p>
          </section>
        </div>
      </div>
    </MacWindow>
  );
};

export default AchievementsWindow;
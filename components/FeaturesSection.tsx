"use client";

import { useTranslations } from "next-intl";
import { usePlaylist } from "@/hooks/usePlaylist";
import PhonePlayer from "./PhonePlayer";

const FEATURE_VIDEOS = [
  "/videos/live-detect.mp4",
  "/videos/clip.mp4",
  "/videos/rate.mp4",
  "/videos/angle.mp4",
];

export default function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as Array<{
    badge: string;
    title: string;
    description: string;
    en?: string;
  }>;
  const api = usePlaylist(FEATURE_VIDEOS, { autoplay: false });

  return (
    <section
      id="features"
      ref={api.sectionRef}
      className="flex flex-col gap-[34px] border-b-4 border-px-ink bg-px-cream px-[clamp(18px,5vw,56px)] py-[clamp(48px,9vw,80px)]"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="m-0 text-[28px] font-normal">{t("sectionTitle")}</h2>
        <span className="font-pixelify text-[16px] tracking-[0.14em] text-px-muted">
          {t("sectionLabel")}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-[clamp(28px,6vw,56px)]">
        {/* 左：手機播放器 */}
        <PhonePlayer api={api} srcs={FEATURE_VIDEOS} accent="teal" />

        {/* 右：功能列 */}
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3.5">
          {items.map((item, i) => {
            const selected = i === api.activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => api.select(i)}
                className={`flex flex-col gap-2.5 border-[3px] border-px-ink p-[18px_20px] text-left hover:bg-px-active ${
                  selected
                    ? "bg-px-active shadow-[6px_6px_0_#2b2340]"
                    : "bg-px-cream"
                }`}
              >
                <span className="self-start bg-px-teal px-2 py-[3px] font-dot text-[11px] tracking-[0.08em] text-px-cream">
                  {item.badge}
                </span>
                <span className="font-dot text-[19px] text-px-ink">
                  {item.title}
                </span>
                <span className="font-dot text-[13.5px] leading-[1.8] text-px-ink">
                  {item.description}
                </span>
                {item.en && (
                  <span className="font-pixelify text-[14px] leading-[1.5] text-px-muted">
                    {item.en}
                  </span>
                )}
                <div className="h-2 border-2 border-px-ink bg-px-track">
                  <div
                    className="h-full bg-px-teal"
                    style={{
                      width: selected ? `${api.progress * 100}%` : "0%",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

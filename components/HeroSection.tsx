"use client";

import { useTranslations } from "next-intl";
import { APP_STORE_URL, TESTFLIGHT_URL } from "@/lib/constants";
import { usePlaylist } from "@/hooks/usePlaylist";
import PhonePlayer from "./PhonePlayer";

const HERO_VIDEOS = [
  "/videos/live-detect.mp4",
  "/videos/clip.mp4",
  "/videos/rate.mp4",
  "/videos/angle.mp4",
];

export default function HeroSection() {
  const t = useTranslations("hero");
  const api = usePlaylist(HERO_VIDEOS, { autoplay: true });
  const subtitle = t("subtitle");

  const dots = (
    <div className="flex gap-1.5">
      {HERO_VIDEOS.map((src, i) => (
        <button
          key={src}
          type="button"
          onClick={() => api.select(i)}
          aria-label={`Slide ${i + 1}`}
          className={`h-2 ${
            i === api.activeIndex ? "w-6 bg-px-coral" : "w-2 bg-px-ink-4"
          }`}
        />
      ))}
    </div>
  );

  return (
    <section
      id="home"
      className="flex flex-wrap items-center justify-center gap-12 border-b-4 border-px-ink bg-px-cream bg-px-grid bg-[length:24px_24px] px-[clamp(18px,5vw,56px)] py-[clamp(48px,9vw,88px)]"
    >
      {/* 左：文案 */}
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-[22px]">
        <span className="self-start border-[3px] border-px-ink bg-px-yellow px-2.5 py-[5px] text-[12px] tracking-[0.08em]">
          {t("badge")}
        </span>
        <h1 className="m-0 whitespace-pre-line text-[clamp(34px,7vw,50px)] font-normal leading-[1.25]">
          {t("title")}
        </h1>
        {subtitle && (
          <p className="m-0 font-pixelify text-[20px] text-px-muted">
            {subtitle}
          </p>
        )}
        <p className="m-0 max-w-[26em] text-[15px] leading-[1.9]">
          {t("description")}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-4">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-[3px] border-px-ink bg-px-coral px-[26px] py-3.5 text-[15px] text-px-ink no-underline shadow-[5px_5px_0_#2b2340] transition-transform active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
          >
            ▶ {t("appStore")}
          </a>
          <a
            href={TESTFLIGHT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-[3px] border-px-ink bg-px-cream px-[22px] py-3.5 text-[15px] text-px-ink no-underline shadow-[5px_5px_0_#2b2340] transition-transform active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
          >
            {t("testflight")}
          </a>
        </div>
      </div>

      {/* 右：手機輪播 */}
      <PhonePlayer api={api} srcs={HERO_VIDEOS} accent="coral" footer={dots} />
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { usePlaylist } from "@/hooks/usePlaylist";
import PhonePlayer from "./PhonePlayer";

const STEP_VIDEOS = ["/videos/step1.mp4", "/videos/step2.mp4"];

export default function HowItWorksSection() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as Array<{ title: string; subtitle?: string }>;
  const api = usePlaylist(STEP_VIDEOS, { autoplay: false });

  return (
    <section
      id="how"
      ref={api.sectionRef}
      className="flex flex-col gap-[34px] border-b-4 border-px-ink bg-px-cream px-[clamp(18px,5vw,56px)] py-[clamp(48px,9vw,80px)]"
    >
      <h2 className="m-0 text-[28px] font-normal">
        {t("title")}{" "}
        <span className="font-pixelify text-[20px] text-px-muted">
          {t("subtitle")}
        </span>
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-[clamp(28px,6vw,56px)]">
        {/* 左：步驟列 */}
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-[18px]">
          {steps.map((step, i) => {
            const selected = i === api.activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => api.select(i)}
                className={`flex flex-col gap-3.5 border-[3px] border-px-ink p-[20px_22px] text-left hover:bg-px-active ${
                  selected
                    ? "bg-px-active shadow-[6px_6px_0_#2b2340]"
                    : "bg-px-cream"
                }`}
              >
                <div className="flex items-center gap-[18px]">
                  <span className="flex h-11 w-11 flex-none items-center justify-center border-[3px] border-px-ink bg-px-yellow font-vt text-[32px] text-px-ink">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-dot text-[20px] text-px-ink">
                      {step.title}
                    </span>
                    {step.subtitle && (
                      <span className="font-pixelify text-[15px] text-px-muted">
                        {step.subtitle}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 border-2 border-px-ink bg-px-track">
                  <div
                    className="h-full bg-px-coral"
                    style={{
                      width: selected ? `${api.progress * 100}%` : "0%",
                    }}
                  />
                </div>
              </button>
            );
          })}
          <p className="m-0 text-[12.5px] text-px-muted">{t("hint")}</p>
        </div>

        {/* 右：手機播放器 */}
        <PhonePlayer api={api} srcs={STEP_VIDEOS} accent="coral" />
      </div>
    </section>
  );
}

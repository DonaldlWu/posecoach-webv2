import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AngleSection() {
  const t = useTranslations("angle");

  return (
    <section
      id="angle"
      className="flex flex-wrap items-center gap-11 border-b-4 border-px-ink bg-px-ink px-[clamp(18px,5vw,56px)] py-[clamp(48px,9vw,80px)] text-px-cream"
    >
      {/* 左：淺色手機框 + 截圖 */}
      <div className="flex min-w-0 flex-[1_1_260px] justify-center">
        <div className="flex w-[240px] flex-col items-center gap-2.5 bg-px-cream px-2.5 pb-[22px] pt-3 shadow-[8px_8px_0_#ffc93c]">
          <div className="h-[7px] w-14 bg-px-bezel" />
          <div className="relative h-[478px] w-[220px] border-[3px] border-px-ink">
            <Image
              src="/images/reference-line-angle.png"
              alt={t("imageAlt")}
              fill
              sizes="220px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* 右：文案 */}
      <div className="flex min-w-0 max-w-[380px] flex-[1_1_280px] flex-col gap-[18px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border-[3px] border-px-cream bg-px-coral px-2.5 py-1 font-pixelify text-[14px] font-bold tracking-[0.1em] text-px-ink shadow-[3px_3px_0_#ffc93c]">
            {t("badge")}
          </span>
          <span className="font-pixelify text-[15px] text-px-yellow">
            {t("kicker")}
          </span>
        </div>
        <h2 className="m-0 whitespace-pre-line text-[30px] font-normal leading-[1.4]">
          {t("title")}
          <span className="font-vt text-[44px] text-px-yellow">°</span>
          {t("titleSuffix")}
        </h2>
        <p className="m-0 text-[14px] leading-[1.9]">{t("body")}</p>
        <p className="m-0 font-pixelify text-[14px] leading-[1.7] text-px-muted-light">
          {t("bodyEn")}
        </p>
      </div>
    </section>
  );
}

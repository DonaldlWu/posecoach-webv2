import { getTranslations } from "next-intl/server";
import { APP_STORE_URL, TESTFLIGHT_URL } from "@/lib/constants";

export default async function DownloadCTASection() {
  const t = await getTranslations("download");

  return (
    <section
      id="download"
      className="flex flex-col gap-[18px] border-b-4 border-px-ink bg-px-coral px-[clamp(18px,5vw,56px)] py-[clamp(48px,9vw,88px)]"
    >
      <h2 className="m-0 text-[clamp(28px,6vw,36px)] font-normal">
        {t("title")}
      </h2>
      <p className="m-0 text-[14px]">{t("description")}</p>
      <div className="mt-2.5 flex flex-wrap gap-4">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-[3px] border-px-ink bg-px-ink px-8 py-4 text-[16px] text-px-cream no-underline shadow-[5px_5px_0_#f4ecd8] transition-transform active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
        >
          ▶ {t("appStore")}
        </a>
        <a
          href={TESTFLIGHT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-[3px] border-px-ink bg-px-cream px-6 py-4 text-[16px] text-px-ink no-underline shadow-[5px_5px_0_#2b2340] transition-transform active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
        >
          {t("testflight")}
        </a>
      </div>
    </section>
  );
}

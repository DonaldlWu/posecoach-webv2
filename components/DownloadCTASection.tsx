import { getTranslations } from "next-intl/server";

const APP_STORE_URL =
  "https://apps.apple.com/tw/app/pose-coach/id1589037753";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/8obWFf50";

export default async function DownloadCTASection() {
  const t = await getTranslations("download");

  return (
    <section
      id="download"
      className="bg-pc-bg border-t border-pc-border py-24 px-6"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black text-white mb-4">{t("title")}</h2>
        <p className="text-slate-400 text-lg mb-10">{t("description")}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {t("appStore")}
          </a>
          <a
            href={TESTFLIGHT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/15 transition-colors text-sm"
          >
            {t("testflight")}
          </a>
        </div>
      </div>
    </section>
  );
}

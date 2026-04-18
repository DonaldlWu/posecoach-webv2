import { getTranslations } from "next-intl/server";

const TESTFLIGHT_URL = "https://testflight.apple.com/join/8obWFf50";

export default async function ComingSoonSection() {
  const t = await getTranslations("comingSoon");

  return (
    <section className="bg-cta-gradient py-24 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] text-slate-500 uppercase mb-6">
          {t("label")}
        </p>
        <div className="text-5xl mb-6">⚾</div>
        <h2 className="text-4xl font-black text-white mb-4">{t("title")}</h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          {t("description")}
        </p>
        <a
          href={TESTFLIGHT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-white/20 text-slate-300 hover:text-white hover:border-white/40 px-8 py-3 rounded-xl text-sm font-medium transition-all"
        >
          {t("cta")} →
        </a>
      </div>
    </section>
  );
}

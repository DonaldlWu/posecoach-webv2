import { getTranslations } from "next-intl/server";
import { GITHUB_URL, SUPPORT_EMAIL } from "@/lib/constants";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer
      id="about"
      className="bg-slate-950 border-t border-pc-border py-8 px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span>{t("copyright")}</span>
          <span className="hidden md:inline">·</span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="hover:text-slate-300 transition-colors"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            {t("github")}
          </a>
          <a href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">
            {t("privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}

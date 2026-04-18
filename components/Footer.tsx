import { getTranslations } from "next-intl/server";

const GITHUB_URL = "https://github.com/DonaldlWu/PoseCoachDoc/issues";
const EMAIL = "derendeveloper@gmail.com";

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
            href={`mailto:${EMAIL}`}
            className="hover:text-slate-300 transition-colors"
          >
            {EMAIL}
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
          <span className="text-slate-700">{t("privacy")}</span>
        </div>
      </div>
    </footer>
  );
}

import { getTranslations } from "next-intl/server";
import { GITHUB_URL, SUPPORT_EMAIL } from "@/lib/constants";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="flex flex-wrap justify-between gap-3 px-[clamp(18px,5vw,56px)] py-6 font-pixelify text-[14px] text-px-muted">
      <span>{t("copyright")}</span>
      <span className="flex flex-wrap gap-5">
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-px-muted">
          {SUPPORT_EMAIL}
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-px-muted"
        >
          {t("github")}
        </a>
        <a href="/privacy" className="text-px-muted">
          {t("privacy")}
        </a>
      </span>
    </footer>
  );
}

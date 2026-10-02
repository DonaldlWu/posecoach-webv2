"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle({
  className,
  onToggle,
}: {
  className?: string;
  onToggle?: () => void;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLanguage() {
    const newLocale = locale === "zh" ? "en" : "zh";
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "zh") {
      segments.shift();
    }
    const rest = segments.length > 0 ? "/" + segments.join("/") : "/";
    const newPath = newLocale === "en" ? "/en" + rest : rest;
    router.push(newPath);
    onToggle?.();
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={className}
      aria-label="Switch language / 切換語言"
    >
      <span className={locale === "en" ? "text-px-coral" : undefined}>EN</span>
      <span className="mx-1 text-px-muted">/</span>
      <span className={locale === "zh" ? "text-px-coral" : undefined}>中</span>
    </button>
  );
}

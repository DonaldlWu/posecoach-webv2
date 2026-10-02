import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageToggle from "./LanguageToggle";

export default function Sidebar() {
  const t = useTranslations("nav");

  const links = [
    { label: t("home"), href: "#home" },
    { label: t("angle"), href: "#angle", isNew: true },
    { label: t("how"), href: "#how" },
    { label: t("features"), href: "#features" },
    { label: t("download"), href: "#download" },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-[220px] flex-none flex-col gap-[30px] border-r-4 border-px-ink bg-px-sand px-5 py-[26px] nav:flex">
      {/* Logo */}
      <a href="#home" className="flex items-center gap-2.5 no-underline">
        <Image
          src="/icon-pixel.svg"
          alt="Pose Coach"
          width={40}
          height={40}
          className="pixelated flex-none"
        />
        <span className="font-pixelify text-[18px] font-bold">Pose Coach</span>
      </a>

      {/* Nav */}
      <nav className="flex flex-col gap-1 text-[13px]">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group flex items-center gap-2.5 p-2 no-underline text-px-ink hover:bg-px-ink hover:text-px-cream"
          >
            <span className="h-2 w-2 flex-none bg-current" />
            <span>{link.label}</span>
            {link.isNew && (
              <span className="ml-auto bg-px-coral px-[5px] py-px font-pixelify text-[10px] font-bold tracking-[0.08em] text-px-ink">
                {t("new")}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Bottom: download + language */}
      <div className="mt-auto flex flex-col gap-3">
        <a
          href="#download"
          className="bg-px-ink py-3 text-center text-[13px] text-px-cream no-underline shadow-[4px_4px_0_#ff5a3c] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          ▶ {t("cta")}
        </a>
        <LanguageToggle className="text-center font-pixelify text-[13px] text-px-muted" />
      </div>
    </aside>
  );
}

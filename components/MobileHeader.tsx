"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageToggle from "./LanguageToggle";

export default function MobileHeader() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  // 斷點跨越時自動收合
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 821px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const links = [
    { label: t("home"), href: "#home" },
    { label: t("angle"), href: "#angle", isNew: true },
    { label: t("how"), href: "#how" },
    { label: t("features"), href: "#features" },
    { label: t("download"), href: "#download" },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b-4 border-px-ink bg-px-sand nav:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <a href="#home" className="flex items-center gap-2 no-underline text-px-ink">
          <Image
            src="/icon-pixel.svg"
            alt=""
            width={32}
            height={32}
            className="pixelated"
          />
          <span className="font-pixelify text-[17px] font-bold">Pose Coach</span>
        </a>
        <div className="flex items-center gap-2.5">
          <a
            href="#download"
            className="bg-px-ink px-3 py-2.5 text-[12px] text-px-cream no-underline shadow-[3px_3px_0_#ff5a3c] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            ▶ {t("get")}
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border-[3px] border-px-ink bg-px-cream"
          >
            <span className="h-[3px] w-5 bg-px-ink" />
            <span className="h-[3px] w-5 bg-px-ink" />
            <span className="h-[3px] w-5 bg-px-ink" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t-[3px] border-dashed border-px-dash px-4 pb-3.5 pt-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center gap-2.5 text-[15px] no-underline text-px-ink"
            >
              <span className="h-2 w-2 flex-none bg-current" />
              <span>{link.label}</span>
              {link.isNew && (
                <span className="bg-px-coral px-[5px] py-px font-pixelify text-[10px] font-bold text-px-ink">
                  {t("new")}
                </span>
              )}
            </a>
          ))}
          <LanguageToggle
            className="flex min-h-11 items-center font-pixelify text-[15px] text-px-muted"
            onToggle={() => setMenuOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}

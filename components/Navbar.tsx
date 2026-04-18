"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: t("features"), href: "#features" },
    { label: t("download"), href: "#download" },
    { label: t("about"), href: "#about" },
  ];

  function toggleLanguage() {
    const newLocale = locale === "zh" ? "en" : "zh";
    const segments = pathname.split("/").filter(Boolean); // remove empty strings
    // Remove existing locale prefix if present
    if (segments[0] === "en" || segments[0] === "zh") {
      segments.shift();
    }
    const rest = segments.length > 0 ? "/" + segments.join("/") : "/";
    const newPath = newLocale === "en" ? "/en" + rest : rest;
    router.push(newPath);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-pc-bg/90 backdrop-blur-md border-b border-pc-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={locale === "en" ? "/en" : "/"}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black text-sm">
            Pc
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Pose Coach
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-sm border border-pc-border text-slate-400 hover:text-white hover:border-slate-500 px-3 py-1 rounded-full transition-all"
          >
            {t("langToggle")}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-pc-bg/95 backdrop-blur-md border-t border-pc-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              toggleLanguage();
              setMenuOpen(false);
            }}
            className="text-sm text-slate-400 hover:text-white text-left"
          >
            {t("langToggle")}
          </button>
        </div>
      )}
    </nav>
  );
}

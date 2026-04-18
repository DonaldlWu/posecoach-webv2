# PoseCoach 官方網站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 PoseCoach iOS App 的一頁式行銷官網，使用 Next.js 14 + Tailwind CSS + Framer Motion，中英雙語，部署至 Vercel。

**Architecture:** Next.js 14 App Router，`app/[locale]/` 路由處理中英雙語，build 時靜態生成。Navbar、HeroSection、FeaturesSection 為 Client Components（scroll 動畫 / Framer Motion）。其餘 section 為 Server Components。next-intl 管理翻譯，`messages/zh.json` + `messages/en.json`。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3.x, Framer Motion 11, next-intl 3.x, Vercel

**Spec:** `docs/superpowers/specs/2026-04-18-posecoach-website-design.md`

---

## File Map

```
posecoach-webv2/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # locale layout（Navbar + Footer 包裝）
│   │   └── page.tsx            # 一頁式首頁，組合所有 sections
│   ├── globals.css             # Tailwind base + 自訂 CSS 變數
│   └── layout.tsx              # Root layout（html/body/font）
├── components/
│   ├── Navbar.tsx              # 'use client' — scroll blur + 語言切換
│   ├── HeroSection.tsx         # 'use client' — autoplay video + Framer Motion
│   ├── FeaturesSection.tsx     # 'use client' — Framer Motion stagger
│   ├── FeatureCard.tsx         # Server component — 單張功能卡片
│   ├── ComingSoonSection.tsx   # Server component
│   ├── DownloadCTASection.tsx  # Server component
│   └── Footer.tsx              # Server component
├── messages/
│   ├── zh.json                 # 繁體中文翻譯
│   └── en.json                 # English translations
├── public/
│   ├── videos/
│   │   └── demo_body_detect.mov
│   └── screenshots/
│       ├── screenshot1_pose_detection.png
│       ├── screenshot2_clip_feature.png
│       ├── screenshot3_speed_control.png
│       └── screenshot4_overview.png
├── i18n/
│   └── request.ts              # next-intl getRequestConfig
├── middleware.ts               # next-intl locale routing
├── next.config.ts
└── tailwind.config.ts
```

---

## Task 1: 初始化 Next.js 專案

**Files:**
- Create: `posecoach-webv2/` (project root)

- [ ] **Step 1: 在 posecoach-webv2 目錄內初始化 Next.js**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

當詢問時，接受所有預設值（`Yes` for TypeScript, Tailwind, ESLint, App Router）。

- [ ] **Step 2: 確認初始化成功**

```bash
ls /Users/wuderen/WorkSpace/posecoach-webv2
```

Expected output 包含：`app/`, `components/`, `package.json`, `tailwind.config.ts`, `next.config.ts`

- [ ] **Step 3: 確認 dev server 可以啟動（快速驗證）**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
npm run build 2>&1 | tail -5
```

Expected: build 成功，無 error。

- [ ] **Step 4: Commit 初始狀態**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git init
git add .
git commit -m "chore: init Next.js 14 project with TypeScript + Tailwind"
```

---

## Task 2: 安裝額外相依套件

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: 安裝 framer-motion 和 next-intl**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
npm install framer-motion next-intl
```

- [ ] **Step 2: 確認套件已安裝**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
node -e "require('framer-motion'); require('next-intl'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: 更新 `tailwind.config.ts`，加入專案色彩和動畫設定**

完整替換 `tailwind.config.ts`：

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pc-bg": "#080e1a",
        "pc-card": "#0f172a",
        "pc-border": "#1e293b",
        "pc-green": "#22c55e",
        "pc-orange": "#f59e0b",
        "pc-blue": "#60a5fa",
        "pc-text-muted": "#64748b",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, #1a0533 0%, #0f2b5e 50%, #0a1a3a 100%)",
        "cta-gradient":
          "linear-gradient(160deg, #0a1a3a 0%, #1a0533 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add -A
git commit -m "chore: install framer-motion, next-intl; configure Tailwind theme"
```

---

## Task 3: next-intl 設定與翻譯檔

**Files:**
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Create: `messages/zh.json`
- Create: `messages/en.json`

- [ ] **Step 1: 建立 `i18n/request.ts`**

```typescript
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "zh";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: 建立 `middleware.ts`**

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["zh", "en"],
  defaultLocale: "zh",
  localePrefix: "as-needed", // zh 在根路徑 /，en 在 /en
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 3: 建立 `messages/zh.json`**

```json
{
  "nav": {
    "features": "功能特色",
    "download": "下載",
    "about": "關於",
    "langToggle": "EN"
  },
  "hero": {
    "badge": "iOS App · 運動姿態分析教練",
    "title": "看見每個",
    "titleHighlight": "關鍵動作瞬間",
    "description": "即時姿態偵測 · 可變速快刷 · 精準片段剪輯\n讓你的訓練影片變成最強大的教練",
    "appStore": "App Store 下載",
    "testflight": "TestFlight Beta"
  },
  "features": {
    "sectionLabel": "FEATURES",
    "sectionTitle": "核心功能",
    "items": [
      {
        "badge": "即時偵測",
        "title": "即時姿態偵測",
        "description": "精準識別 18 個人體關節點，即時繪製骨架疊加於影片上。支援高信賴度邊界框標記。",
        "alt": "即時姿態偵測截圖"
      },
      {
        "badge": "影片剪輯",
        "title": "精準片段剪輯",
        "description": "設定 IN / OUT 點，快速截取精彩動作片段並匯出儲存。匯出時可選擇含骨架的分析影片。",
        "alt": "精準片段剪輯截圖"
      },
      {
        "badge": "精確控制",
        "title": "可變速快刷控制",
        "description": "向下拖曳進度條調整刷取速度，支援 1×、½×、¼×、⅛× 四段速度，輕鬆找出每個關鍵瞬間。",
        "alt": "可變速快刷控制截圖"
      },
      {
        "badge": "播放分析",
        "title": "多功能播放器",
        "description": "姿態分析 · 捏合縮放（1×～4×）· 6 段速率 · 影片截圖 · 並排比對模式一體整合。",
        "alt": "多功能播放器截圖"
      }
    ]
  },
  "comingSoon": {
    "label": "COMING SOON",
    "title": "棒球揮棒分析",
    "description": "AI 自動識別揮棒軌跡，精準分析出手姿勢，即將推出",
    "cta": "搶先體驗 TestFlight"
  },
  "download": {
    "title": "立即開始分析你的動作",
    "description": "免費下載 · iOS 15+ · 支援 iPhone & iPad",
    "appStore": "App Store",
    "testflight": "TestFlight Beta"
  },
  "footer": {
    "copyright": "© 2026 Pose Coach",
    "github": "GitHub",
    "privacy": "Privacy Policy"
  }
}
```

- [ ] **Step 4: 建立 `messages/en.json`**

```json
{
  "nav": {
    "features": "Features",
    "download": "Download",
    "about": "About",
    "langToggle": "中"
  },
  "hero": {
    "badge": "iOS App · AI Sports Coach",
    "title": "See Every",
    "titleHighlight": "Critical Moment in Motion",
    "description": "Real-time Pose Detection · Variable Speed Scrub · Precise Clip Editing\nTurn your training footage into your most powerful coach",
    "appStore": "Download on App Store",
    "testflight": "TestFlight Beta"
  },
  "features": {
    "sectionLabel": "FEATURES",
    "sectionTitle": "Core Features",
    "items": [
      {
        "badge": "Live Detection",
        "title": "Real-time Pose Detection",
        "description": "Accurately identifies 18 body joints and overlays a skeleton on your video in real time. High-confidence bounding box markers included.",
        "alt": "Real-time pose detection screenshot"
      },
      {
        "badge": "Clip Editing",
        "title": "Precise Clip Editing",
        "description": "Set IN / OUT points to quickly extract key moments and export clips. Optionally burn the skeleton overlay directly into the exported video.",
        "alt": "Clip editing screenshot"
      },
      {
        "badge": "Precision Control",
        "title": "Variable Speed Scrub",
        "description": "Drag down on the timeline to switch between 1×, ½×, ¼×, and ⅛× playback speeds. Never miss a critical frame again.",
        "alt": "Variable speed scrub screenshot"
      },
      {
        "badge": "Analysis",
        "title": "Multi-function Player",
        "description": "Pose analysis · Pinch zoom (1×–4×) · 6 playback speeds · Screenshot · Side-by-side comparison — all in one player.",
        "alt": "Multi-function player screenshot"
      }
    ]
  },
  "comingSoon": {
    "label": "COMING SOON",
    "title": "Baseball Swing Analysis",
    "description": "AI-powered swing trajectory detection and release angle analysis — coming soon",
    "cta": "Try Early on TestFlight"
  },
  "download": {
    "title": "Start Analyzing Your Motion Today",
    "description": "Free Download · iOS 15+ · iPhone & iPad",
    "appStore": "App Store",
    "testflight": "TestFlight Beta"
  },
  "footer": {
    "copyright": "© 2026 Pose Coach",
    "github": "GitHub",
    "privacy": "Privacy Policy"
  }
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add -A
git commit -m "feat: add next-intl config, middleware, zh/en message files"
```

---

## Task 4: next.config.ts 設定

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: 更新 `next.config.ts` 整合 next-intl plugin**

完整替換 `next.config.ts`：

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // 所有圖片都是本地 public/，不需要遠端 domain
    unoptimized: false,
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2: 確認 TypeScript 編譯無誤**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
npx tsc --noEmit 2>&1 | head -20
```

Expected: 無 error 輸出（或只有型別定義缺少的警告，此時可忽略）。

- [ ] **Step 3: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add next.config.ts
git commit -m "chore: configure next.config.ts with next-intl plugin"
```

---

## Task 5: 複製素材至 public/

**Files:**
- Create: `public/videos/demo_body_detect.mov`
- Create: `public/screenshots/screenshot1_pose_detection.png`
- Create: `public/screenshots/screenshot2_clip_feature.png`
- Create: `public/screenshots/screenshot3_speed_control.png`
- Create: `public/screenshots/screenshot4_overview.png`

- [ ] **Step 1: 建立目錄並複製素材**

```bash
mkdir -p /Users/wuderen/WorkSpace/posecoach-webv2/public/videos
mkdir -p /Users/wuderen/WorkSpace/posecoach-webv2/public/screenshots

cp /Users/wuderen/WorkSpace/PoseCoatch/resources/demo_body_detect.mov \
   /Users/wuderen/WorkSpace/posecoach-webv2/public/videos/

cp /Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/screenshot1_pose_detection.png \
   /Users/wuderen/WorkSpace/posecoach-webv2/public/screenshots/

cp /Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/screenshot2_clip_feature.png \
   /Users/wuderen/WorkSpace/posecoach-webv2/public/screenshots/

cp /Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/screenshot3_speed_control.png \
   /Users/wuderen/WorkSpace/posecoach-webv2/public/screenshots/

cp /Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/screenshot4_overview.png \
   /Users/wuderen/WorkSpace/posecoach-webv2/public/screenshots/
```

- [ ] **Step 2: 確認檔案存在**

```bash
ls -lh /Users/wuderen/WorkSpace/posecoach-webv2/public/videos/
ls -lh /Users/wuderen/WorkSpace/posecoach-webv2/public/screenshots/
```

Expected: 列出 1 個 .mov 和 4 個 .png，均有合理檔案大小（> 0 bytes）。

- [ ] **Step 3: 加入 .gitignore 避免大型媒體檔進入 git（改用 Git LFS 或 Vercel 直接部署）**

在 `.gitignore` 底部追加：

```
# Large media files — deploy via Vercel directly
public/videos/*.mov
```

- [ ] **Step 4: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add public/screenshots/
git add .gitignore
git commit -m "feat: add app screenshots to public/screenshots; gitignore mov"
```

---

## Task 6: Root layout + Locale layout

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1: 更新 `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #080e1a;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #080e1a;
  color: #f8fafc;
  font-family: var(--font-inter), var(--font-noto), sans-serif;
}

/* 讓影片不顯示控制列預設 UI */
video::-webkit-media-controls {
  display: none !important;
}
```

- [ ] **Step 2: 更新 `app/layout.tsx`（Root layout，載入字體）**

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pose Coach — 運動姿態分析教練",
  description:
    "iOS App 即時姿態偵測、可變速快刷、精準片段剪輯，讓你的訓練影片變成最強大的教練。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansTC.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 建立 `app/[locale]/layout.tsx`（Locale layout）**

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const locales = ["zh", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add -A
git commit -m "feat: root layout with Inter+Noto fonts; locale layout with next-intl"
```

---

## Task 7: Navbar 元件

**Files:**
- Create: `components/Navbar.tsx`

Navbar 是 Client Component，功能：scroll 後加 backdrop-blur，語言切換按鈕。

- [ ] **Step 1: 建立 `components/Navbar.tsx`**

```typescript
// components/Navbar.tsx
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
    // 切換 locale：移除舊 locale prefix，加上新的
    const segments = pathname.split("/");
    if (segments[1] === "en") {
      segments.splice(1, 1); // 移除 /en
    }
    const newPath =
      newLocale === "en" ? "/en" + segments.join("/") : segments.join("/") || "/";
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
        <Link href={locale === "en" ? "/en" : "/"} className="flex items-center gap-2.5">
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add components/Navbar.tsx
git commit -m "feat: Navbar component with scroll blur and language toggle"
```

---

## Task 8: HeroSection 元件

**Files:**
- Create: `components/HeroSection.tsx`

- [ ] **Step 1: 建立 `components/HeroSection.tsx`**

```typescript
// components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const APP_STORE_URL =
  "https://apps.apple.com/tw/app/pose-coach/id1589037753";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/8obWFf50";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-hero-gradient overflow-hidden pt-16">
      {/* 背景裝飾光暈 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-indigo-900/30 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="text-xs tracking-[0.2em] text-slate-400 uppercase border border-pc-border rounded-full px-4 py-1.5">
            {t("badge")}
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight"
        >
          {t("title")}
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {t("titleHighlight")}
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 whitespace-pre-line"
        >
          {t("description")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-black font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-colors text-sm"
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
            className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-colors text-sm"
          >
            {t("testflight")}
          </a>
        </motion.div>

        {/* Demo Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 max-w-3xl mx-auto"
        >
          <video
            src="/videos/demo_body_detect.mov"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto block"
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-slate-600" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" />
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add components/HeroSection.tsx
git commit -m "feat: HeroSection with gradient bg, video, Framer Motion animations"
```

---

## Task 9: FeatureCard + FeaturesSection 元件

**Files:**
- Create: `components/FeatureCard.tsx`
- Create: `components/FeaturesSection.tsx`

每個 feature card 對應一張截圖 + badge + 標題 + 說明。FeaturesSection 負責 stagger 動畫。

- [ ] **Step 1: 建立 `components/FeatureCard.tsx`**

```typescript
// components/FeatureCard.tsx
import Image from "next/image";

interface FeatureCardProps {
  badge: string;
  badgeColor: "green" | "orange" | "deepOrange" | "blue";
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const badgeStyles: Record<FeatureCardProps["badgeColor"], string> = {
  green: "bg-green-950 text-pc-green border border-green-800/50",
  orange: "bg-amber-950 text-pc-orange border border-amber-800/50",
  deepOrange: "bg-orange-950 text-orange-400 border border-orange-800/50",
  blue: "bg-blue-950 text-pc-blue border border-blue-800/50",
};

export default function FeatureCard({
  badge,
  badgeColor,
  title,
  description,
  imageSrc,
  imageAlt,
}: FeatureCardProps) {
  return (
    <div className="bg-pc-card border border-pc-border rounded-2xl overflow-hidden flex flex-col hover:border-slate-600 transition-colors group">
      {/* Screenshot */}
      <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Text content */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <span
          className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </span>
        <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
        <p className="text-pc-text-muted text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 建立 `components/FeaturesSection.tsx`**

```typescript
// components/FeaturesSection.tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import FeatureCard from "./FeatureCard";

const screenshots = [
  "/screenshots/screenshot1_pose_detection.png",
  "/screenshots/screenshot2_clip_feature.png",
  "/screenshots/screenshot3_speed_control.png",
  "/screenshots/screenshot4_overview.png",
];

const badgeColors = [
  "green",
  "orange",
  "deepOrange",
  "blue",
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as Array<{
    badge: string;
    title: string;
    description: string;
    alt: string;
  }>;

  return (
    <section id="features" className="bg-pc-bg py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase mb-3">
            {t("sectionLabel")}
          </p>
          <h2 className="text-4xl font-black text-white">{t("sectionTitle")}</h2>
        </div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {items.map((item, index) => (
            <motion.div key={index} variants={cardVariants}>
              <FeatureCard
                badge={item.badge}
                badgeColor={badgeColors[index]}
                title={item.title}
                description={item.description}
                imageSrc={screenshots[index]}
                imageAlt={item.alt}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add components/FeatureCard.tsx components/FeaturesSection.tsx
git commit -m "feat: FeatureCard and FeaturesSection with stagger scroll animation"
```

---

## Task 10: ComingSoonSection 元件

**Files:**
- Create: `components/ComingSoonSection.tsx`

- [ ] **Step 1: 建立 `components/ComingSoonSection.tsx`**

```typescript
// components/ComingSoonSection.tsx
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add components/ComingSoonSection.tsx
git commit -m "feat: ComingSoonSection for baseball swing analysis teaser"
```

---

## Task 11: DownloadCTASection 元件

**Files:**
- Create: `components/DownloadCTASection.tsx`

- [ ] **Step 1: 建立 `components/DownloadCTASection.tsx`**

```typescript
// components/DownloadCTASection.tsx
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add components/DownloadCTASection.tsx
git commit -m "feat: DownloadCTASection with App Store and TestFlight links"
```

---

## Task 12: Footer 元件

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: 建立 `components/Footer.tsx`**

```typescript
// components/Footer.tsx
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add components/Footer.tsx
git commit -m "feat: Footer with copyright, email, GitHub link"
```

---

## Task 13: 頁面組合 (page.tsx)

**Files:**
- Create: `app/[locale]/page.tsx`

- [ ] **Step 1: 建立 `app/[locale]/page.tsx`**

```typescript
// app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ComingSoonSection from "@/components/ComingSoonSection";
import DownloadCTASection from "@/components/DownloadCTASection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ComingSoonSection />
      <DownloadCTASection />
    </>
  );
}
```

- [ ] **Step 2: 刪除 Next.js 預設的 `app/page.tsx`（如果存在）**

```bash
rm -f /Users/wuderen/WorkSpace/posecoach-webv2/app/page.tsx
```

- [ ] **Step 3: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add -A
git commit -m "feat: assemble one-page site in [locale]/page.tsx"
```

---

## Task 14: SEO Metadata

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: 在 `app/[locale]/layout.tsx` 加入動態 metadata export**

在現有 `generateStaticParams` 下方加入 `generateMetadata`：

```typescript
// 在 app/[locale]/layout.tsx 的 generateStaticParams 後面加入：

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isEn = locale === "en";
  const title = isEn
    ? "Pose Coach — AI Sports Motion Coach"
    : "Pose Coach — 運動姿態分析教練";
  const description = isEn
    ? "Real-time pose detection, variable speed scrub, and precise clip editing. Turn your training footage into your most powerful coach."
    : "即時姿態偵測、可變速快刷、精準片段剪輯，讓你的訓練影片變成最強大的教練。";
  const url = isEn ? "https://pose-coach.com/en" : "https://pose-coach.com";

  return {
    title,
    description,
    metadataBase: new URL("https://pose-coach.com"),
    openGraph: {
      title,
      description,
      url,
      siteName: "Pose Coach",
      images: [
        {
          url: "/screenshots/screenshot4_overview.png",
          width: 1536,
          height: 660,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/screenshots/screenshot4_overview.png"],
    },
    other: {
      "apple-itunes-app": "app-id=1589037753",
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add app/[locale]/layout.tsx
git commit -m "feat: dynamic SEO metadata with og:image and apple-itunes-app"
```

---

## Task 15: Build 驗證

**Files:** None (verification only)

- [ ] **Step 1: 執行完整 build**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
npm run build 2>&1
```

Expected: `✓ Compiled successfully`，無 TypeScript error，無 ESLint error。

- [ ] **Step 2: 確認靜態路由生成正確**

Build 輸出應包含：
```
○ /
○ /en
```

- [ ] **Step 3: 啟動 production preview 並驗證頁面**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
npm run start &
sleep 3
curl -s http://localhost:3000 | grep -o "<title>[^<]*</title>"
curl -s http://localhost:3000/en | grep -o "<title>[^<]*</title>"
```

Expected:
```
<title>Pose Coach — 運動姿態分析教練</title>
<title>Pose Coach — AI Sports Motion Coach</title>
```

- [ ] **Step 4: 建立 Vercel 設定（如尚未存在）**

確認根目錄有 `vercel.json`（通常不需要，Next.js 專案 Vercel 自動偵測），若需要明確指定 framework：

```json
{
  "framework": "nextjs"
}
```

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
echo '{"framework":"nextjs"}' > vercel.json
git add vercel.json
git commit -m "chore: add vercel.json"
```

- [ ] **Step 5: Final commit**

```bash
cd /Users/wuderen/WorkSpace/posecoach-webv2
git add -A
git status
# 確認沒有遺漏的 unstaged 檔案
git log --oneline -15
```

Expected: log 顯示完整的 commit 歷史，最後狀態 clean。

---

## Self-Review

**Spec coverage:**

| Spec 需求 | 對應 Task |
|---|---|
| Sports Gradient 視覺風格 | Task 8 (HeroSection) |
| 中英雙語 + i18n 切換 | Task 3, 7 (middleware, Navbar) |
| Navbar + scroll blur | Task 7 |
| Hero + demo video + CTA | Task 8 |
| 4 feature cards + screenshots | Task 9 |
| Coming Soon 棒球揮棒 | Task 10 |
| Download CTA | Task 11 |
| Footer + 聯絡資訊 | Task 12 |
| SEO + og:image | Task 14 |
| Vercel 部署 | Task 15 |
| App Store link | Tasks 8, 11 |
| TestFlight link | Tasks 8, 10, 11 |
| © 2026 Pose Coach | Task 12 |

**Type consistency:**
- `FeatureCard` props 在 Task 9 定義，`FeaturesSection` 在同 task 正確使用
- `getTranslations` (server) / `useTranslations` (client) 分別用在正確的 component 類型
- `badgeColors` 陣列順序與截圖順序一致（green→orange→deepOrange→blue）

**No placeholders:** 無 TBD、無省略代碼。

---

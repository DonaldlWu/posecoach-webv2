# PoseCoach 官方網站 Pixel Art 改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **狀態：** ✅ 已完成並驗證（2026-10-02）。本文件為 as-built 紀錄，checkbox 已勾選。
> **取代：** [2026-04-18 PoseCoach 官方網站 Implementation Plan](./2026-04-18-posecoach-website.md)（Sports Gradient 深色主題初版建置）。

**Goal:** 把現有 PoseCoach 單頁官網改成 Pixel Art 視覺，新增 Angle / How it works 兩區塊、所有展示圖改為直式手機框影片輪播、移除 Coming Soon，Navbar 改為 Sidebar + MobileHeader。High-fidelity 照設計稿像素重現。

**Architecture:** Next.js 16 App Router。外層 wrapper 為 `max-w-[1200px]` ink 框容器，桌面 Sidebar 在左、main 在右；斷點 820px（`nav:821px`）切換 Sidebar / MobileHeader。三組影片播放器（Hero / How / Features）共用 `usePlaylist` hook + `PixelPhone` / `PhonePlayer` 元件；Hero 載入即播，How / Features 用 IntersectionObserver 捲動才播。深色區塊（Angle）與互動卡片為 Client Components，純文字區塊（Download / Footer）為 Server Components。

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 3.4, next-intl 4.x, next/font（DotGothic16 / Pixelify Sans / VT323）, Vercel。framer-motion 移除使用（依賴保留）。

**Spec:** `docs/superpowers/specs/2026-10-02-posecoach-pixel-art-redesign.md`

---

## File Map

```
posecoach-webv2/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # 改：像素字體 + 1200px ink 框 wrapper（Sidebar + MobileHeader + main>Footer）
│   │   └── page.tsx              # 改：Hero → Angle → How → Features → Download
│   ├── globals.css               # 改：#d9cfb6 body、像素字體、selection、focus-visible、reduced-motion
│   ├── icon.png                  # 改：換成 icon-pixel.png
│   └── layout.tsx                # Root layout（不變）
├── components/
│   ├── Sidebar.tsx               # 新：桌面 >820px 側欄
│   ├── MobileHeader.tsx          # 新：≤820px 頂欄 + 漢堡選單（'use client'）
│   ├── LanguageToggle.tsx        # 新：EN / 中 切換（'use client'，沿用 toggleLanguage 邏輯）
│   ├── PixelPhone.tsx            # 新：手機框 + 假狀態列（共用）
│   ├── PhonePlayer.tsx           # 新：PixelPhone 螢幕內疊放影片輪播（'use client'）
│   ├── HeroSection.tsx           # 改：左文右手機、4 支影片輪播 + 輪播點（'use client'）
│   ├── AngleSection.tsx          # 新：深色區 + 淺色手機框截圖
│   ├── HowItWorksSection.tsx     # 新：2 步驟卡 + 手機（'use client'）
│   ├── FeaturesSection.tsx       # 改：手機 + 4 功能卡影片（'use client'）
│   ├── DownloadCTASection.tsx    # 改：coral 底像素按鈕
│   └── Footer.tsx                # 改：Pixelify muted
│   （刪除：Navbar.tsx、FeatureCard.tsx、ComingSoonSection.tsx）
├── hooks/
│   └── usePlaylist.ts            # 新：activeIndex / progress / isVisible + 淡入淡出輪播
├── messages/
│   ├── zh.json                   # 改：nav 重寫、新增 angle/how、刪 comingSoon、features 改影片文案
│   └── en.json                   # 改：同上（英文頁只顯示英文，副標留空）
├── public/
│   ├── icon-pixel.svg            # 新：Sidebar / Header Logo
│   ├── images/
│   │   └── reference-line-angle.png   # 新：AngleSection 截圖
│   └── videos/
│       ├── live-detect.mp4 / clip.mp4 / rate.mp4 / angle.mp4   # 新：Hero + 功能 1–4
│       └── step1.mp4 / step2.mp4                               # 新：How 步驟 1–2
│       （刪除：demo_body_detect.mov / .mp4）
└── tailwind.config.ts            # 改：px-* 色票、nav 斷點、像素字體、格線 bg
```

---

## Task 1: Design Tokens（Tailwind + 全域 CSS + 字體）

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`, `app/[locale]/layout.tsx`

- [x] **Step 1: `tailwind.config.ts`** — 加入 17 個 `px-*` 色票、`screens.nav: '821px'`、`fontFamily { dot, pixelify, vt }`、像素格線 `backgroundImage`。
- [x] **Step 2: `app/globals.css`** — body 背景 `#d9cfb6` + `var(--font-dot)`；`a` / `a:hover`；`::selection`（yellow/ink）；`:focus-visible` 3px coral；`.pixelated`；保留隱藏 video controls；`prefers-reduced-motion` 關掉 transition/animation。
- [x] **Step 3: `app/[locale]/layout.tsx` 字體** — 移除 Inter / Noto，改用 `DotGothic16`(400)、`Pixelify_Sans`(400/700)、`VT323`(400)，掛 `--font-dot/-pixelify/-vt` 到 body。
- [x] **Verify:** `npm run build` 通過；fonts 正常下載（DotGothic16 latin subset 可用）。

---

## Task 2: 版面 wrapper + Sidebar / MobileHeader

**Files:**
- Modify: `app/[locale]/layout.tsx`
- Create: `components/Sidebar.tsx`, `components/MobileHeader.tsx`, `components/LanguageToggle.tsx`
- Delete: `components/Navbar.tsx`

- [x] **Step 1: wrapper** — body 下改為 `div.max-w-[1200px] mx-auto flex flex-wrap items-start bg-px-cream border-x-4 border-px-ink`，內含 `<Sidebar>`、`<MobileHeader>`、`<main class="flex-[1_1_320px] min-w-0">{children}<Footer/></main>`。
- [x] **Step 2: `LanguageToggle.tsx`** — 抽出共用的 locale 切換（EN / 中，沿用 `router.push` 邏輯），供 Sidebar 與 MobileHeader 共用。
- [x] **Step 3: `Sidebar.tsx`** — `hidden nav:flex`、220px sticky、Logo + 5 導覽項（Angle 帶 NEW）+ 底部 App Store 按鈕 + LanguageToggle；hover ink 底 cream 字；8×8 方塊項目符號。
- [x] **Step 4: `MobileHeader.tsx`**（`'use client'`）— `nav:hidden`、sticky、Logo + ▶下載按鈕 + 44×44 漢堡；`menuOpen` state；展開選單虛線分隔、min-height 44px、點擊收合；`matchMedia('(min-width:821px)')` 跨斷點自動收合。
- [x] **Step 5:** 刪除 `Navbar.tsx`。

---

## Task 3: 共用播放元件 + usePlaylist hook

**Files:**
- Create: `components/PixelPhone.tsx`, `components/PhonePlayer.tsx`, `hooks/usePlaylist.ts`

- [x] **Step 1: `PixelPhone.tsx`** — 292px 外框（ink 底、accent 陰影 8px coral/teal/yellow）、聽筒 64×8、268×560 螢幕（`px-ink-2`、overflow-hidden、relative）；內建假狀態列（9:41 VT323 + 訊號/Wi-Fi/電池，`absolute top z-2`）；`footer` 省略時顯示預設 Home 條。
- [x] **Step 2: `usePlaylist.ts`** — 回傳 `activeIndex / progress / isVisible / reducedMotion / select / sectionRef / videoRef / onTimeUpdate / onEnded / opacity`：
  - `onEnded` 依序播放、繞回第一支；`onTimeUpdate` 更新進度；`select` 跳片從 0 播。
  - 非 autoplay：`IntersectionObserver`（`-30% 0px -30% 0px`, threshold 0）用 callback ref 綁；autoplay（Hero）恆 visible。
  - 切換：active `currentTime=0; play()`，舊片 550ms 後 pause 歸零；`play().catch(()=>{})`。
  - `prefers-reduced-motion`：不自動播、不淡入淡出。
- [x] **Step 3: `PhonePlayer.tsx`**（`'use client'`）— 在 PixelPhone 螢幕內 `absolute inset-0` 疊放 N 支 `<video muted playsInline preload=auto>`，active opacity 1、其餘 0、`transition opacity .5s`（reduced-motion 時關閉）。

---

## Task 4: HeroSection（改版 + 輪播）

**Files:**
- Modify: `components/HeroSection.tsx`

- [x] **Step 1:** 移除 framer-motion / 舊漸層；cream + 24px 像素格線、flex-wrap 左文右手機。
- [x] **Step 2:** 左欄 — yellow 標籤、h1（`clamp(34,7vw,50)` 400）、Pixelify 英文副標（條件渲染）、單行內文、▶App Store（coral 5px 陰影）+ TestFlight（cream），連結沿用 `APP_STORE_URL` / `TESTFLIGHT_URL`。
- [x] **Step 3:** 右 — `usePlaylist(HERO_VIDEOS, { autoplay:true })` + `PhonePlayer accent="coral"`；footer 為 4 輪播點（選中 24×8 coral、其餘 8×8 ink-4，點擊 `select`）。

---

## Task 5: AngleSection（新）

**Files:**
- Create: `components/AngleSection.tsx`

- [x] **Step 1:** 深色區（`bg-px-ink text-px-cream`）、flex-wrap gap 44。
- [x] **Step 2:** 左 — 淺色手機框（240px、cream、yellow 8px 陰影、聽筒 56×7 bezel），內 `next/image` `reference-line-angle.png`（220×478、object-cover object-top、3px ink 框）含中文 alt。
- [x] **Step 3:** 右 — NEW 標籤（coral/cream 框/yellow 陰影）+ kicker、h2（30px/1.4，`°` 用 VT323 44px yellow）、中文 body、Pixelify 英文（`px-muted-light`）。

---

## Task 6: HowItWorksSection（新）

**Files:**
- Create: `components/HowItWorksSection.tsx`

- [x] **Step 1:**（`'use client'`）`usePlaylist(STEP_VIDEOS)` + `ref={sectionRef}` 掛在 `<section id="how">`。
- [x] **Step 2:** h2「怎麼量出來的」+ Pixelify「How it works」；左步驟列、右 `PhonePlayer accent="coral"`。
- [x] **Step 3:** 步驟卡（button）— 選中 `px-active` + 6px 陰影、hover `px-active`；編號方塊 44×44 yellow VT323；中文 DotGothic 20px + 英文 Pixelify 15px；進度條（track + 2px ink 框、內條 coral = `progress`）。下方 12.5px muted hint。

---

## Task 7: FeaturesSection（改影片）

**Files:**
- Modify: `components/FeaturesSection.tsx`
- Delete: `components/FeatureCard.tsx`

- [x] **Step 1:**（`'use client'`）`usePlaylist(FEATURE_VIDEOS)` + `ref={sectionRef}`；標題列 h2「核心功能」左、Pixelify「FEATURES」右。
- [x] **Step 2:** 左 `PhonePlayer accent="teal"`、右 4 功能卡（同步驟卡互動）：teal badge → 標題 19px → 描述 13.5px → 英文 Pixelify（條件渲染）→ teal 進度條。
- [x] **Step 3:** 刪除 `FeatureCard.tsx`；`screenshots/*` 保留（OG 仍用 `screenshot4_overview.png`）。

---

## Task 8: Download / Footer 換皮 + page 組合 + 刪 Coming Soon

**Files:**
- Modify: `components/DownloadCTASection.tsx`, `components/Footer.tsx`, `app/[locale]/page.tsx`
- Delete: `components/ComingSoonSection.tsx`

- [x] **Step 1: DownloadCTASection** — coral 底、左對齊；h2 `clamp(28,6vw,36)`、14px 副標；▶App Store（ink/cream 5px 陰影）+ TestFlight（cream/ink 5px 陰影）。
- [x] **Step 2: Footer** — `padding 24px clamp(18,5vw,56)`、flex-wrap space-between、Pixelify 14px muted；保留 copyright / email / GitHub / Privacy。
- [x] **Step 3: page.tsx** — 區塊順序改為 Hero → Angle → How → Features → Download；移除 `ComingSoonSection` 引用並刪檔。

---

## Task 9: i18n 文案

**Files:**
- Modify: `messages/zh.json`, `messages/en.json`

- [x] **Step 1:** 刪除 `comingSoon`。
- [x] **Step 2: nav** — `home / angle / how / features / download / new / cta / get / menu`（zh 導覽項中英並列、en 純英文）。
- [x] **Step 3: hero** — `description` 改單行、新增 `subtitle`（en 留空）。
- [x] **Step 4: 新增 angle** — `badge / kicker / title / titleSuffix / body / bodyEn / imageAlt`。
- [x] **Step 5: 新增 how** — `title / subtitle / hint / steps[]{title, subtitle}`。
- [x] **Step 6: features.items** — 改為影片文案；item[3]「關節角度顯示」/ "Joint Angle Display"。

---

## Task 10: 素材

**Files:**
- Create: `public/icon-pixel.svg`, `public/images/reference-line-angle.png`, `public/videos/*.mp4`
- Modify: `app/icon.png`
- Delete: `public/videos/demo_body_detect.*`

- [x] **Step 1:** 複製 `icon-pixel.svg` → `public/`、`icon-pixel.png` → `app/icon.png`、`reference-line-angle.png` → `public/images/`、6 支 `.mp4` → `public/videos/`。
- [x] **Step 2:** 移除未使用的 `demo_body_detect.mov` / `.mp4`。

---

## Task 11: Build / 執行驗證

**Files:** None（verification only）

- [x] **Step 1:** `npm run build` → `✓ Compiled successfully`、TypeScript clean、`/zh` + `/en` 皆生成。
- [x] **Step 2:** dev server smoke test — `/`、`/en`、`/videos/*.mp4`、`/icon-pixel.svg` 皆 200；影片 `Range` 請求回 **206**。
- [x] **Step 3:** 內容驗證 — 五個 section id、zh/en 關鍵文案、`reference-line-angle.png` 經 `next/image` 輸出。
- [x] **Step 4:** headless Chrome 截圖 1280px / 390px，確認像素邊框、硬陰影、假狀態列覆蓋、輪播點、深色 Angle 區、VT323 `°` 標題皆符合設計稿。

---

## Self-Review

**Spec coverage:**

| Spec 需求（2026-10-02） | 對應 Task |
|---|---|
| px-* 色票 / 字體 / 斷點 / 像素語彙 | Task 1 |
| 1200px ink 框 wrapper、Sidebar 取代 Navbar | Task 2 |
| MobileHeader（≤820）漢堡選單、斷點自動收合 | Task 2 |
| PixelPhone 手機框 + 假狀態列 | Task 3 |
| usePlaylist：依序播放 / 進度 / 捲動才播 / 淡入淡出 / reduced-motion | Task 3 |
| Hero 改版 + 4 影片輪播 + 輪播點（autoplay） | Task 4 |
| AngleSection（新，深色 + 淺色手機框截圖） | Task 5 |
| HowItWorksSection（新，2 步驟 + 進度條） | Task 6 |
| FeaturesSection 改影片（teal） | Task 7 |
| DownloadCTASection（coral）/ Footer 換皮 | Task 8 |
| 移除 Coming Soon | Task 8 |
| i18n：刪 comingSoon、新增 angle/how、features item4 | Task 9 |
| 素材搬移、移除 demo video | Task 10 |
| App Store / TestFlight 連結沿用 constants | Task 4, 8 |

**Type consistency:**
- `PlaylistApi` 介面集中於 `usePlaylist.ts`，Hero / How / Features 三處一致消費。
- `getTranslations`（server：Download / Footer）/ `useTranslations`（client 與 RSC：Hero / Angle / How / Features / Sidebar / MobileHeader）分別用於正確元件類型。
- `features.items` / `how.steps` 以 `t.raw()` 取陣列，英文副標 / 子標欄位條件渲染（en 留空不顯示）。

**No placeholders:** 無 TBD、無省略代碼；原型 `image-slot` 設計工具元件未實作（如規格所述）。

**已知取捨：**
- framer-motion 依賴保留但未使用（可後續移除以精簡 bundle）。
- 影片直接以 `/videos/*.mp4` 當 src（Vercel 支援 Range），未做 lazy src；總量約 3.3MB，行動裝置可接受。
- DotGothic16 為日文字型，部分繁中字 fallback;如需完整繁中像素字可改自架 Cubic 11。
```

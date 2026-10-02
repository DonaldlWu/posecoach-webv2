# PoseCoach 官方網站 Pixel Art 改版規格

**日期：** 2026-10-02
**專案路徑：** `/Users/wuderen/WorkSpace/posecoach-webv2`
**部署目標：** Vercel
**取代：** [2026-04-18 PoseCoach 官方網站設計規格](./2026-04-18-posecoach-website-design.md)（Sports Gradient 深色主題）

---

## 0. 本次改版摘要

把現有單頁官網從 **Sports Gradient 深色主題** 全面改成 **Pixel Art（像素風）** 視覺，並：

- 新增「參考線夾角」(Reference-line angle) **新功能介紹區塊**。
- 新增「運作方式」(How it works) **步驟教學區塊**。
- 所有展示圖從靜態截圖改為 **直式手機框內的影片輪播**。
- **移除** Coming Soon（棒球揮棒預告）區塊。
- Navbar 改為桌面 **Sidebar** + 手機 **MobileHeader**。

Fidelity：high-fidelity，色票／字體／邊框／陰影／間距／互動皆照設計稿像素重現。

---

## 1. 技術選型變更

| 項目 | 原（2026-04-18） | 新（本次） | 說明 |
|---|---|---|---|
| 框架 | Next.js 14 App Router | **Next.js 16 App Router** | 已於先前升級；`middleware` → `proxy` |
| 字體 | Inter / Noto Sans TC | **DotGothic16 / Pixelify Sans / VT323** | `next/font/google` |
| 動畫 | Framer Motion（scroll 進場） | **移除**，改用原生 + 像素風互動 | framer-motion 依賴保留但未使用 |
| 輸出 | `output: 'export'`（純靜態） | 一般 SSG（需 Range 支援影片） | Vercel 靜態檔支援 Range request |
| 其餘 | Tailwind CSS · next-intl · next/image | 不變 | |

---

## 2. 視覺設計語言（Pixel Art）

**圓角一律 0；邊框 3/4px 實線；硬陰影（無模糊）。**

### 2.1 色票（`tailwind.config.ts` → `theme.extend.colors`）

| token | hex | 用途 |
|---|---|---|
| `px-page` | `#d9cfb6` | body 背景（1200px 容器外） |
| `px-cream` | `#f4ecd8` | 主背景、淺色卡片 |
| `px-sand` | `#eadfc4` | 側欄、圖框底色 |
| `px-grid` | `#e8dec5` | Hero 像素格線 |
| `px-ink` | `#2b2340` | 文字、所有邊框、硬陰影、深色區背景 |
| `px-ink-2` | `#3a3054` | 手機螢幕底 |
| `px-ink-3` | `#443a60` | 深色格線 |
| `px-ink-4` | `#4a3f63` | 手機聽筒／Home 條、未選中輪播點 |
| `px-coral` | `#ff5a3c` | 主 CTA、NEW 標籤、進度條、下載區背景 |
| `px-yellow` | `#ffc93c` | 標籤底、步驟編號、強調字、選取色 |
| `px-teal` | `#2fa58f` | 功能 badge／進度條／功能區手機陰影 |
| `px-muted` | `#6a5f7a` | 次要文字、英文副標 |
| `px-muted-light` | `#c9bfd9` | 深色區英文副標 |
| `px-dash` | `#b9ac8e` | 虛線分隔 |
| `px-track` | `#e0d5b8` | 進度條軌道 |
| `px-active` | `#fff4d6` | 選中卡片／hover 背景 |
| `px-bezel` | `#c9bfa3` | 淺色手機框聽筒 |

全域：`::selection { bg #ffc93c / color #2b2340 }`、`a #2b2340 / a:hover #ff5a3c`、`:focus-visible` 3px coral outline。

### 2.2 字體

| 變數 | 字體 | 用途 |
|---|---|---|
| `--font-dot` | DotGothic16 400 | 中文內文與標題（body 預設） |
| `--font-pixelify` | Pixelify Sans 400/700 | 英文副標、Logo、標籤、footer |
| `--font-vt` | VT323 400 | 數字：步驟編號、`°` 符號 |

標題一律 `font-weight:400`，用字級分層。

### 2.3 像素語彙
- 硬陰影 `box-shadow: Npx Npx 0 <color>`：按鈕 5px、卡片 6px、手機/圖框 8px。
- `:active { transform: translate(Npx,Npx); box-shadow:none }`。
- 像素格線背景：亮區 `px-grid` 24px、深區 `px-ink-3` 20px。
- 項目符號：8×8 實心方塊（`currentColor`）；區塊分隔：`border-bottom:4px solid px-ink`。

---

## 3. 版面結構變更

### 3.1 外層 wrapper（`app/[locale]/layout.tsx`）
- body 背景 `#d9cfb6`。
- wrapper：`max-w-[1200px] mx-auto flex flex-wrap items-start bg-px-cream border-x-4 border-px-ink`。
- **Sidebar 在左、main 在右**（`flex-[1_1_320px] min-w-0`），Footer 移到 main 內最後。
- 斷點 **820px**（Tailwind `screens: { nav: '821px' }`）：>820 顯示 Sidebar、≤820 顯示 MobileHeader。

### 3.2 區塊順序（`app/[locale]/page.tsx`）
```
HeroSection        #home
AngleSection       #angle      （新）
HowItWorksSection  #how        （新）
FeaturesSection    #features   （改：影片）
DownloadCTASection #download   （改：coral）
Footer                          （改：像素）
```

---

## 4. 元件規格（重點）

| 元件 | 說明 |
|---|---|
| **Sidebar**（桌面 >820） | 220px sticky 側欄，Logo + 5 導覽項（Angle 帶 NEW 標籤）+ 底部 App Store 按鈕 + 語言切換。hover：ink 底 / cream 字。 |
| **MobileHeader**（≤820） | sticky 頂欄，Logo + ▶下載小按鈕 + 44×44 漢堡；展開選單虛線分隔、min-height 44px、點擊收合、斷點跨越自動收合。 |
| **PixelPhone**（共用） | 292px 外框、ink 底、8px accent 陰影、268×560 螢幕；含假狀態列（9:41 VT323 + 訊號/Wi-Fi/電池，蓋住錄影真實時間）。 |
| **PhonePlayer** | PixelPhone 螢幕內疊放 N 支 `<video>` 做淡入淡出輪播。 |
| **HeroSection** | 左文右手機；手機 coral 陰影、4 支功能影片輪播 + 4 輪播點；**載入即自動播放**。 |
| **AngleSection** | ink 深色區；左淺色手機框（yellow 陰影）內放 `reference-line-angle.png`；右 NEW 標籤 + `°`(VT323 yellow) 標題 + 中英文案。 |
| **HowItWorksSection** | 左 2 步驟卡（編號方塊 + 中英 + 進度條）、右手機（coral）；捲動進視窗才播放。 |
| **FeaturesSection** | 左手機（teal）、右 4 功能卡（teal badge + 進度條）；捲動進視窗才播放。 |
| **DownloadCTASection** | coral 底、ink / cream 按鈕。 |
| **Footer** | Pixelify 14px muted，保留 copyright / email / GitHub / Privacy。 |

---

## 5. 影片播放器互動（`hooks/usePlaylist.ts`）

Hero / How / Features 共三組，彼此獨立。`usePlaylist(srcs, { autoplay })` 管理 `activeIndex` / `progress` / `isVisible`。

- 所有 `<video>`：`muted playsInline preload="auto"`，無 loop、無 controls。
- **依序播放**：`onEnded` → 下一支，最後一支回到第一支。
- **進度條**：`onTimeUpdate` → `currentTime / duration`。
- **點擊卡片／輪播點**：跳到該支並從 0 播放。
- **捲動才播放（How / Features）**：`IntersectionObserver`，`rootMargin:'-30% 0px -30% 0px'`、`threshold:0`，離開暫停；observer 用 callback ref 綁定。
- **Hero**：載入即播、不受捲動控制。
- **換片不閃**：N 支影片疊放（`absolute inset-0`），active `opacity:1` 其餘 0、`transition:opacity .5s`；切換時新片 `currentTime=0; play()`，舊片 550ms 後 pause 歸零。
- `play()` 一律 `.catch(() => {})`。
- 尊重 `prefers-reduced-motion`：關掉淡入淡出與自動輪播。
- 正式環境直接用 `/videos/*.mp4` 當 src（Vercel 支援 Range，不需 Blob fetch）。

---

## 6. 國際化變更（`messages/zh.json` / `en.json`）

- **刪除** `comingSoon`。
- `nav`：改為 `home`、`angle`、`how`、`features`、`download`、`new`、`cta`、`get`、`menu`。
- `hero`：`description` 改單行；新增 `subtitle`（英文副標，en 頁留空）。
- 新增 `angle`：`badge`、`kicker`、`title`、`titleSuffix`、`body`、`bodyEn`、`imageAlt`。
- 新增 `how`：`title`、`subtitle`、`hint`、`steps[]`（`title` / `subtitle`）。
- `features.items[3]`：改為「關節角度顯示」/ "Joint Angle Display"。
- 設計為中英並列：**中文頁保留英文副標**；**英文頁只顯示英文**（副標欄位留空，元件條件渲染）。

---

## 7. 素材變更（`public/`）

| 素材 | 路徑 | 用途 |
|---|---|---|
| `icon-pixel.svg` | `public/icon-pixel.svg` | Sidebar / Header Logo |
| `icon-pixel.png` | `app/icon.png`（取代） | favicon / app icon |
| `reference-line-angle.png` | `public/images/` | AngleSection 截圖 |
| `live-detect / clip / rate / angle .mp4` | `public/videos/` | Hero 輪播 + 功能 1–4 |
| `step1 / step2 .mp4` | `public/videos/` | 運作方式 步驟 1–2 |

- 皆為使用者提供之直式 iPhone 螢幕錄影（MP4 / H.264）。
- **移除** 原 `demo_body_detect.mov/.mp4`（不再使用）。
- `screenshots/*` 保留（OG 圖仍引用 `screenshot4_overview.png`）。

---

## 8. 檔案異動對照

| 變更 | 檔案 |
|---|---|
| 色票 / 字體 / 斷點 | `tailwind.config.ts`、`app/globals.css`、`app/[locale]/layout.tsx` |
| Sidebar 取代 Navbar | 刪 `components/Navbar.tsx`；新增 `Sidebar.tsx`、`MobileHeader.tsx`、`LanguageToggle.tsx` |
| 區塊順序、刪 Coming Soon | `app/[locale]/page.tsx`；刪 `components/ComingSoonSection.tsx` |
| Hero 改版 + 輪播 | `components/HeroSection.tsx` |
| 新區塊 / 共用元件 | 新增 `AngleSection.tsx`、`HowItWorksSection.tsx`、`PixelPhone.tsx`、`PhonePlayer.tsx`、`hooks/usePlaylist.ts` |
| 功能區改影片 | `components/FeaturesSection.tsx`；刪 `components/FeatureCard.tsx` |
| 下載 / Footer 換皮 | `components/DownloadCTASection.tsx`、`components/Footer.tsx` |
| 文案 | `messages/zh.json`、`messages/en.json` |

---

## 9. 驗證

- `next build` 通過（TypeScript clean）；`/zh`、`/en` 皆 200。
- 影片以 HTTP 206 Range 提供，可正常播放。
- headless Chrome 1280px / 390px 截圖確認像素邊框、硬陰影、假狀態列、輪播點、深色 Angle 區與 VT323 `°` 標題皆符合設計稿。

---

## 10. 不在本次範圍內

- 後端 API / 資料庫、用戶認證、部落格。
- 棒球揮棒分析功能（本次連預告區塊一併移除）。
- 自架繁中像素字（Cubic 11）；目前以 DotGothic16 為主，部分繁中字會 fallback。

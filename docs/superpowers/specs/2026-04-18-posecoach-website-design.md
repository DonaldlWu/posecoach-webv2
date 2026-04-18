# PoseCoach 官方網站設計規格

**日期：** 2026-04-18
**專案路徑：** `/Users/wuderen/WorkSpace/posecoach-webv2`
**部署目標：** Vercel

---

## 1. 產品定位

PoseCoach 是一款 iOS 運動姿態分析教練 App，利用 Apple Vision 框架進行即時人體姿態偵測。官網定位為 **App 行銷落地頁（Landing Page）**，主要目標是引導訪客下載 App。

- **現階段主軸：** 姿態偵測功能展示
- **未來預告：** 棒球揮棒分析（YOLO，尚未正式上線）
- **目標受眾：** 運動員、教練、棒球愛好者

---

## 2. 技術選型

| 項目 | 選擇 | 理由 |
|---|---|---|
| 框架 | **Next.js 14 App Router** | SSG 靜態生成，SEO 友好，og 分享卡正確，Vercel 原生支援 |
| 樣式 | **Tailwind CSS** | 快速排版，深色主題易維護 |
| 動畫 | **Framer Motion** | scroll 進場動畫，feature card stagger |
| 國際化 | **next-intl** | 中英雙語，靜態路由 `/` (zh-TW) + `/en` (en) |
| 圖片 | **next/image** | 自動 WebP 轉換，lazy loading |
| 字體 | **next/font** (Inter / Noto Sans TC) | 無閃爍字體載入 |

---

## 3. 視覺設計語言

**主題：Sports Gradient**

| 角色 | 值 |
|---|---|
| 頁面背景 | `#080e1a`（深海軍藍） |
| Hero 漸層 | `linear-gradient(160deg, #1a0533, #0f2b5e, #0a1a3a)` |
| 主標題漸層文字 | `from-violet-400 via-blue-400 to-emerald-400` |
| 卡片背景 | `#0f172a` |
| 卡片邊框 | `#1e293b` |
| 強調綠 | `#22c55e`（姿態偵測 badge） |
| 強調橙 | `#f59e0b`（影片剪輯 badge） |
| 強調藍 | `#60a5fa`（播放器 badge） |
| 次要文字 | `#64748b` |

---

## 4. 頁面區塊結構（由上到下）

### 4.1 Navbar
- **左側：** App icon（綠色圓角方形）+ "Pose Coach" 文字 Logo
- **右側（桌機）：** 功能特色 / 下載 / 關於 anchor links + 語言切換 `中 / EN`
- **行為：** scroll 後背景加 `backdrop-blur`，固定於頂部
- **RWD：** 手機改為 hamburger menu

### 4.2 Hero Section
- **背景：** Sports Gradient 深紫藍漸層
- **標語（zh-TW）：** 「看見每個關鍵動作瞬間」
- **標語（en）：** "See Every Critical Moment in Motion"
- **副標（zh-TW）：** 「即時姿態偵測 · 可變速快刷 · 精準片段剪輯 · 讓你的訓練影片變成最強大的教練」
- **CTA 按鈕：**
  - 主要：App Store 下載（白底黑字）→ `https://apps.apple.com/tw/app/pose-coach/id1589037753`
  - 次要：TestFlight Beta（透明框）→ `https://testflight.apple.com/join/8obWFf50`
- **Demo 影片：** `demo_body_detect.mov` autoplay、muted、loop、rounded corners，位於 CTA 按鈕下方

### 4.3 Features Section（核心功能）
**標題：** 核心功能 / Core Features

2×2 網格（桌機），單欄（手機），共 4 張 feature card，每張包含：
- App 截圖（頂部），下方文字說明

| Card | 截圖 | 標題（zh） | 標題（en） | Badge 顏色 |
|---|---|---|---|---|
| 1 | `screenshot1_pose_detection.png` | 即時姿態偵測 | Real-time Pose Detection | 綠色 |
| 2 | `screenshot2_clip_feature.png` | 精準片段剪輯 | Precise Clip Editing | 橙色 |
| 3 | `screenshot3_speed_control.png` | 可變速快刷控制 | Variable Speed Scrub | 深橙色 |
| 4 | `screenshot4_overview.png` | 多功能播放器 | Multi-function Player | 藍色 |

**Feature card 說明文字（zh-TW）：**

1. 精準識別 18 個人體關節點，即時繪製骨架疊加於影片上。支援高信賴度邊界框標記。
2. 設定 IN / OUT 點，快速截取精彩動作片段並匯出儲存。匯出時可選擇含骨架的分析影片。
3. 向下拖曳進度條調整刷取速度，支援 1×、½×、¼×、⅛× 四段速度，輕鬆找出每個關鍵瞬間。
4. 姿態分析 · 捏合縮放（1×～4×）· 6 段速率 · 影片截圖 · 並排比對模式一體整合。

**動畫：** Framer Motion scroll 進場，cards 依序 stagger 0.1s 出現

### 4.4 Coming Soon Section
- **背景：** 同 Hero 漸層（深紫藍）
- **內容：** ⚾ 棒球揮棒分析預告
- **文字（zh）：** 「AI 自動識別揮棒軌跡，精準分析出手姿勢，即將推出」
- **CTA：** TestFlight Beta（搶先體驗）→ 同連結

### 4.5 Download CTA Section
- **標題：** 立即開始分析你的動作 / Start Analyzing Your Motion
- **副標：** 免費下載 · iOS 15+ · 支援 iPhone & iPad
- **按鈕：** App Store（主）+ TestFlight Beta（次）

### 4.6 Footer
- **版權：** © 2026 Pose Coach
- **聯絡：** derendeveloper@gmail.com
- **連結：** GitHub Issues → `https://github.com/DonaldlWu/PoseCoachDoc/issues`
- **其他：** Privacy Policy（placeholder 頁面）

---

## 5. 國際化（i18n）

- **zh-TW：** 預設語言，路由 `/`
- **en：** 英文版，路由 `/en`
- **實作：** `next-intl`，翻譯檔存於 `messages/zh.json` 和 `messages/en.json`
- **切換：** Navbar 右側 `中 / EN` toggle，切換時保持當前 scroll 位置

---

## 6. 素材清單

| 素材 | 來源路徑 | 用途 |
|---|---|---|
| `demo_body_detect.mov` | `/Users/wuderen/WorkSpace/PoseCoatch/resources/` | Hero demo 影片 |
| `video_edit.jpeg` | `/Users/wuderen/WorkSpace/PoseCoatch/resources/` | 備用素材 |
| `screenshot1_pose_detection.png` | `/Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/` | Feature card 1 |
| `screenshot2_clip_feature.png` | `/Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/` | Feature card 2 |
| `screenshot3_speed_control.png` | `/Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/` | Feature card 3 |
| `screenshot4_overview.png` | `/Users/wuderen/WorkSpace/PoseCoatch/Screenshots/export/` | Feature card 4 |

素材需複製至 `public/` 目錄：
- 影片：`public/videos/demo_body_detect.mov`
- 截圖：`public/screenshots/screenshot1~4`

---

## 7. 專案結構

```
posecoach-webv2/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx       # 含 Navbar、語言設定
│   │   └── page.tsx         # 一頁式首頁（含所有 sections）
│   └── layout.tsx           # Root layout（字體、meta）
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── FeatureCard.tsx
│   ├── ComingSoonSection.tsx
│   ├── DownloadCTASection.tsx
│   └── Footer.tsx
├── messages/
│   ├── zh.json
│   └── en.json
├── public/
│   ├── videos/
│   └── screenshots/
├── i18n.ts
├── middleware.ts             # next-intl locale 偵測
├── next.config.ts
└── tailwind.config.ts
```

---

## 8. SEO & Meta

- `og:title`、`og:description`、`og:image`（App Store 截圖）
- `og:image` 尺寸：1200×630（由 screenshot1 裁切）
- `apple-itunes-app` meta tag：`app-id=1589037753`
- `lang` 屬性根據 locale 動態設定

---

## 9. 部署

- **平台：** Vercel（`vercel.json` 不需特殊設定，Next.js 自動適配）
- **域名：** pose-coach.com（替換現有 Rails 部署）
- **輸出模式：** `output: 'export'`（純靜態，無需 Vercel serverless functions）

---

## 10. 不在本次範圍內

- 後端 API 或資料庫
- 棒球揮棒分析實際功能頁面（Coming Soon 只做預告）
- 用戶認證 / 登入
- 部落格或新聞區塊

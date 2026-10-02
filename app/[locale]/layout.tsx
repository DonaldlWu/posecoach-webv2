import type { Metadata } from "next";
import { DotGothic16, Pixelify_Sans, VT323 } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";

// 中文內文與標題（預設 body 字體）
const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dot",
  display: "swap",
});

// 英文副標、Logo 字、標籤、footer
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixelify",
  display: "swap",
});

// 數字：步驟編號、° 符號
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt",
  display: "swap",
});

const locales = ["zh", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
          width: 2796,
          height: 1290,
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
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${dotGothic.variable} ${pixelify.variable} ${vt323.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-start border-x-4 border-px-ink bg-px-cream">
            <Sidebar />
            <MobileHeader />
            <main className="flex-[1_1_320px] min-w-0">
              {children}
              <Footer />
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

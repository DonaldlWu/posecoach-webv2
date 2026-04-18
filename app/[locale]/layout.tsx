import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_TC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <body className={`${inter.variable} ${notoSansTC.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

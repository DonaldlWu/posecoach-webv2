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

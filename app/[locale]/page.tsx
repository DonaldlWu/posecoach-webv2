import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/HeroSection";
import AngleSection from "@/components/AngleSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
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
      <AngleSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DownloadCTASection />
    </>
  );
}

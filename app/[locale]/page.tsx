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

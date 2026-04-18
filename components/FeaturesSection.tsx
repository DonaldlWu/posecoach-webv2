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

const badgeColors = ["green", "orange", "deepOrange", "blue"] as const;

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
                priority={index === 0}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import Image from "next/image";

interface FeatureCardProps {
  badge: string;
  badgeColor: "green" | "orange" | "deepOrange" | "blue";
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
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
  priority = false,
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
          priority={priority}
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

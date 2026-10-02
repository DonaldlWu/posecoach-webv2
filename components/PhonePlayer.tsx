"use client";

import type { ReactNode } from "react";
import PixelPhone from "./PixelPhone";
import type { PlaylistApi } from "@/hooks/usePlaylist";

/** PixelPhone 螢幕內疊放的影片輪播（淡入淡出切換） */
export default function PhonePlayer({
  api,
  srcs,
  accent,
  footer,
}: {
  api: PlaylistApi;
  srcs: string[];
  accent: "coral" | "teal" | "yellow";
  footer?: ReactNode;
}) {
  return (
    <PixelPhone accent={accent} footer={footer}>
      {srcs.map((src, i) => (
        <video
          key={src}
          ref={api.videoRef(i)}
          src={src}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={() => api.onTimeUpdate(i)}
          onEnded={() => api.onEnded(i)}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{
            opacity: api.opacity(i),
            transition: api.reducedMotion ? "none" : "opacity .5s ease",
          }}
        />
      ))}
    </PixelPhone>
  );
}

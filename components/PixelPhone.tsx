import type { ReactNode } from "react";

const accentShadow: Record<string, string> = {
  coral: "shadow-[8px_8px_0_#ff5a3c]",
  teal: "shadow-[8px_8px_0_#2fa58f]",
  yellow: "shadow-[8px_8px_0_#ffc93c]",
};

/** 蓋住螢幕錄影裡真實時間的假狀態列 */
function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex h-9 items-center justify-between bg-px-ink pl-[22px] pr-[18px] text-px-cream">
      <span className="font-vt text-[22px] leading-none">9:41</span>
      <div className="flex items-center gap-2">
        {/* 訊號 */}
        <div className="flex h-3 items-end gap-0.5">
          <div className="h-1 w-[3px] bg-px-cream" />
          <div className="h-1.5 w-[3px] bg-px-cream" />
          <div className="h-[9px] w-[3px] bg-px-cream" />
          <div className="h-3 w-[3px] bg-px-cream" />
        </div>
        {/* Wi-Fi */}
        <div className="flex flex-col items-center gap-px">
          <div className="h-0.5 w-3.5 bg-px-cream" />
          <div className="h-0.5 w-2.5 bg-px-cream" />
          <div className="h-0.5 w-1.5 bg-px-cream" />
          <div className="h-0.5 w-0.5 bg-px-cream" />
        </div>
        {/* 電池 */}
        <div className="flex items-center gap-px">
          <div className="box-border h-2.5 w-5 border-2 border-px-cream p-px">
            <div className="h-full w-full bg-px-cream" />
          </div>
          <div className="h-1 w-0.5 bg-px-cream" />
        </div>
      </div>
    </div>
  );
}

export default function PixelPhone({
  accent = "coral",
  children,
  footer,
}: {
  accent?: "coral" | "teal" | "yellow";
  children: ReactNode;
  /** 手機框下方內容；省略時顯示預設 Home 條 */
  footer?: ReactNode;
}) {
  return (
    <div
      className={`flex w-[292px] flex-none flex-col items-center gap-3 bg-px-ink px-2.5 pb-[26px] pt-3.5 ${accentShadow[accent]}`}
    >
      {/* 聽筒 */}
      <div className="h-2 w-16 bg-px-ink-4" />
      {/* 螢幕 */}
      <div className="relative h-[560px] w-[268px] overflow-hidden bg-px-ink-2">
        <StatusBar />
        {children}
      </div>
      {/* Home 條 / footer */}
      {footer ?? <div className="h-2 w-14 bg-px-ink-4" />}
    </div>
  );
}

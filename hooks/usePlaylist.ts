"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PlaylistApi {
  /** 目前播放中的影片索引 */
  activeIndex: number;
  /** 目前影片播放進度 0–1 */
  progress: number;
  /** 區塊是否在視窗中（autoplay 模式恆為 true） */
  isVisible: boolean;
  reducedMotion: boolean;
  /** 跳到第 i 支影片並從頭播放 */
  select: (i: number) => void;
  /** 綁在要觀察的區塊上（autoplay 模式為 no-op） */
  sectionRef: (node: HTMLElement | null) => void;
  /** 綁在第 i 支 <video> 上 */
  videoRef: (i: number) => (node: HTMLVideoElement | null) => void;
  /** 第 i 支 <video> 的 onTimeUpdate */
  onTimeUpdate: (i: number) => void;
  /** 第 i 支 <video> 的 onEnded */
  onEnded: (i: number) => void;
  /** 第 i 支 <video> 的 opacity（疊放淡入淡出） */
  opacity: (i: number) => number;
}

/**
 * 依序播放一組直式影片，彼此疊放做淡入淡出切換。
 * - autoplay: Hero 用，載入即播、不受捲動控制。
 * - 非 autoplay: How / Features 用，區塊進入視窗中間 40% 才播，離開時暫停。
 */
export function usePlaylist(
  srcs: string[],
  opts: { autoplay?: boolean } = {}
): PlaylistApi {
  const { autoplay = false } = opts;
  const count = srcs.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(autoplay);
  const [reducedMotion, setReducedMotion] = useState(false);

  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // IntersectionObserver：在元素 mount 後才綁（用 callback ref）
  const sectionRef = useCallback(
    (node: HTMLElement | null) => {
      if (autoplay) return;
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
      if (!node) return;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => setIsVisible(e.isIntersecting)),
        { threshold: 0, rootMargin: "-30% 0px -30% 0px" }
      );
      io.observe(node);
      ioRef.current = io;
    },
    [autoplay]
  );

  useEffect(() => () => ioRef.current?.disconnect(), []);

  // 播放控制：播 active、暫停其餘；切換時從 0 開始
  useEffect(() => {
    const videos = videosRef.current;
    videos.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        if (isVisible) {
          v.currentTime = 0;
          setProgress(0);
          if (!reducedMotion) {
            v.play()?.catch(() => {});
          }
        } else {
          v.pause();
        }
      } else if (!v.paused) {
        if (reducedMotion) {
          v.pause();
          v.currentTime = 0;
        } else {
          // 等淡出結束再暫停並歸零，避免切換時閃一下
          window.setTimeout(() => {
            if (activeIndexRef.current !== i) {
              v.pause();
              v.currentTime = 0;
            }
          }, 550);
        }
      }
    });
  }, [activeIndex, isVisible, reducedMotion]);

  const select = useCallback((i: number) => {
    setActiveIndex(i);
    setProgress(0);
    const v = videosRef.current[i];
    if (v) {
      v.currentTime = 0;
      v.play()?.catch(() => {});
    }
  }, []);

  const videoRef = useCallback(
    (i: number) => (node: HTMLVideoElement | null) => {
      videosRef.current[i] = node;
    },
    []
  );

  const onTimeUpdate = useCallback(
    (i: number) => {
      if (i !== activeIndexRef.current) return;
      const v = videosRef.current[i];
      if (v && v.duration) setProgress(v.currentTime / v.duration);
    },
    []
  );

  const onEnded = useCallback(
    (i: number) => {
      if (i !== activeIndexRef.current) return;
      setActiveIndex((prev) => (prev + 1) % count);
      setProgress(0);
    },
    [count]
  );

  const opacity = useCallback(
    (i: number) => (i === activeIndex ? 1 : 0),
    [activeIndex]
  );

  return {
    activeIndex,
    progress,
    isVisible,
    reducedMotion,
    select,
    sectionRef,
    videoRef,
    onTimeUpdate,
    onEnded,
    opacity,
  };
}

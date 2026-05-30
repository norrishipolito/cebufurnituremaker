"use client";

import { useEffect } from "react";
import { useScroll } from "framer-motion";

export function useSyncedScrollY() {
  const { scrollY } = useScroll();

  useEffect(() => {
    let frame: number | null = null;

    function syncScrollPosition() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        scrollY.set(window.scrollY);
        frame = null;
      });
    }

    window.addEventListener("pageshow", syncScrollPosition);
    window.addEventListener("popstate", syncScrollPosition);
    syncScrollPosition();

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("pageshow", syncScrollPosition);
      window.removeEventListener("popstate", syncScrollPosition);
    };
  }, [scrollY]);

  return scrollY;
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminRoutePrefetcher({ hrefs }: { hrefs: string[] }) {
  const router = useRouter();
  const hrefsKey = hrefs.join("|");

  useEffect(() => {
    if (window.navigator.webdriver) {
      return;
    }

    const uniqueHrefs = [...new Set(hrefsKey.split("|").filter(Boolean))];
    const timers = uniqueHrefs.map((href, index) =>
      window.setTimeout(() => {
        router.prefetch(href);
      }, 350 + index * 125)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [hrefsKey, router]);

  return null;
}

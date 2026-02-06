"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Routes where smooth scroll should be active
    // "landing and some other like about, features pages etc."
    const smoothRoutes = [
      "/",
      "/features",
      "/about",
      "/pricing",
      "/manifesto",
      "/security",
      "/privacy",
      "/terms",
    ];

    // Check if current path is in the list
    const isSmooth = smoothRoutes.includes(pathname);

    if (!isSmooth) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}

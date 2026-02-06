"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on App/Workspace routes, show on Marketing routes
  const isExcludedPage =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/collab/") ||
    // Check if it's a dashboard route (single path segment that isn't a public page)
    (pathname.split("/").length === 2 &&
      ![
        "/",
        "/auth",
        "/about",
        "/features",
        "/pricing",
        "/contact",
        "/updates",
        "/terms",
        "/privacy",
        "/support",
        "/security",
        "/press",
        "/careers",
        "/manifesto",
      ].includes(pathname));

  if (isExcludedPage) {
    return null;
  }

  return <Footer />;
}

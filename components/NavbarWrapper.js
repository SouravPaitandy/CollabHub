"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Hide Navbar on chat, collab editor, and dashboard routes
  // Dashboard routes are typically /[username] where username is not a standard page
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
      ].includes(pathname));

  if (isExcludedPage) {
    return null;
  }

  return <Navbar />;
}

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/collab/", "/api/"],
    },
    sitemap: "https://getcoordly.vercel.app/sitemap.xml",
  };
}

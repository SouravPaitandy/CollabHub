import React from "react";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Coordly",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Coordly is the unified workspace where teams sync, create, and succeed.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
    publisher: {
      "@type": "Organization",
      name: "Coordly",
      url: "https://getcoordly.vercel.app",
    },
    author: {
      "@type": "Person",
      name: "Sourav Paitandy",
      url: "https://souravpaitandy.me",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

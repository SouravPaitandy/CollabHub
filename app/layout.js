import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import ClientSessionProvider from "@/app/SessionProvider";
// import { ThemeProvider } from "next-themes";
import ThemeProviderWrapper from "./ThemeProvider";
import { Toaster } from "react-hot-toast";
import "@/Styles/scrollbars.css";
import SplashWrapper from "@/components/SplashWrapper";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import JsonLd from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://getcoordly.vercel.app"),
  title: {
    default: "Coordly | The OS for Next-Gen Teams",
    template: "%s | Coordly",
  },
  description:
    "Coordly (formerly CollabHub) is the unified workspace where teams sync, create, and succeed. Real-time document collaboration, video calls, and task management in one premium interface.",
  keywords: [
    "Collaboration Tool",
    "Project Management",
    "Video Conferencing",
    "Real-time Editor",
    "Team Workspace",
    "Productivity Software",
    "Coordly",
    "CollabHub",
  ],
  authors: [{ name: "Sourav Paitandy", url: "https://souravpaitandy.me" }],
  creator: "Sourav Paitandy",
  publisher: "Coordly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getcoordly.vercel.app",
    title: "Coordly | The OS for Next-Gen Teams",
    description:
      "Stop juggling apps. Start coordinating. The unified workspace for high-performance teams.",
    siteName: "Coordly",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists in public folder later
        width: 1200,
        height: 630,
        alt: "Coordly Interface Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coordly | The OS for Next-Gen Teams",
    description:
      "Stop juggling apps. Start coordinating. The unified workspace for high-performance teams.",
    images: ["/og-image.png"],
    creator: "@PaitandySourav",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable}`}
    >
      <body className="antialiased select-none" suppressHydrationWarning>
        <SessionWrapper>
          <ClientSessionProvider>
            <ThemeProviderWrapper>
              <SplashWrapper>
                <JsonLd />
                <SmoothScroll />
                <CustomCursor />
                <NavbarWrapper />
                {children}
                <FooterWrapper />
              </SplashWrapper>
              <Toaster position="top-right" />
            </ThemeProviderWrapper>
          </ClientSessionProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
// import FooterWrapper from "@/components/FooterWrapper";
import ClientSessionProvider from "@/app/SessionProvider";
// import { ThemeProvider } from "next-themes";
import ThemeProviderWrapper from "./ThemeProvider";
import { Toaster } from "react-hot-toast";
import "@/Styles/scrollbars.css";

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
  title: "Coordly: Sync, Create, Succeed",
  description:
    "Coordly - The unified workspace for developers to coordinate code, video, and tasks in real-time.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable}`}
    >
      <body
        className="antialiased select-none"
        // className={inter.className}
        suppressHydrationWarning
      >
        <SessionWrapper>
          <ClientSessionProvider>
            <ThemeProviderWrapper>
              <NavbarWrapper />
              {children}
              <Toaster position="top-right" />
            </ThemeProviderWrapper>
          </ClientSessionProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

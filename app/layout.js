import { Geist, Geist_Mono } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
// import FooterWrapper from "@/components/FooterWrapper";
import ClientSessionProvider from "@/app/SessionProvider";
// import { ThemeProvider } from "next-themes";
import ThemeProviderWrapper from "./ThemeProvider";
import { Toaster } from 'react-hot-toast';
import '@/Styles/scrollbars.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CollabHub: Sync, Create, Succeed",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
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

import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVG FC · Abuja",
  description: "CVG FC: the club of Choose, Vascumi and Grace Pavillion estates, Abuja.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4f5ef" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap" />
      </head>
      <body>
        <div className="wrap">
          <header className="top">
            <Link href="/" className="brand"><span className="brand-mark">◆</span> CVG FC</Link>
          </header>
          {children}
          <footer className="foot">CVG FC · Abuja</footer>
        </div>
      </body>
    </html>
  );
}

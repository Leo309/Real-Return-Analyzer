import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investment Time Machine | SKYNEX DIGITAL",
  description: "Calculate how inflation and investments affect your money over time. Powered by SKYNEX GLOBAL COMMERCE & TECH INC.",
  openGraph: {
    title: "Investment Time Machine | SKYNEX DIGITAL",
    description: "Calculate how inflation and investments affect your money over time. Powered by SKYNEX GLOBAL COMMERCE & TECH INC.",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Investment Time Machine Preview",
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Time Machine | SKYNEX DIGITAL",
    description: "Calculate how inflation and investments affect your money over time. Powered by SKYNEX GLOBAL COMMERCE & TECH INC.",
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
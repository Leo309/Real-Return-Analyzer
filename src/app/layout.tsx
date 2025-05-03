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
  title: "Investment Calculator | SKYNEX DIGITAL",
  description: "Calculate how investments perform over time. Compare stocks, bonds, and real estate returns while accounting for inflation. Visualize your financial future with historical data.",
  keywords: "investment calculator, inflation calculator, stock returns, bond returns, real estate investment, historical returns, financial planning, investment time machine",
  
  openGraph: {
    title: "Investment Calculator | SKYNEX DIGITAL",
    description: "Calculate how investments perform over time. Compare stocks, bonds, and real estate returns while accounting for inflation. Visualize your financial future with historical data.",
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
    siteName: "SKYNEX DIGITAL",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Investment Calculator | SKYNEX DIGITAL",
    description: "Calculate how investments perform over time. Compare stocks, bonds, and real estate returns while accounting for inflation. Visualize your financial future with historical data.",
    images: ["/social-preview.png"],
    creator: "@skynexdigital",
  },
  
  authors: [{ name: "SKYNEX GLOBAL COMMERCE & TECH INC" }],
  publisher: "SKYNEX GLOBAL COMMERCE & TECH INC",
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  verification: {
    google: "verification_token",  // Add your Google Search Console verification token
  },
  
  alternates: {
    canonical: "https://investment.skynexdigital.com",
    languages: {
      'en': 'https://investment.skynexdigital.com',
      // Additional languages can be added later
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Rich Results */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Investment Calculator",
              "description": "Calculate how investments perform over time. Compare stocks, bonds, and real estate returns while accounting for inflation.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "SKYNEX GLOBAL COMMERCE & TECH INC",
                "url": "https://skynexdigital.com"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-fix`}>
        {children}
      </body>
    </html>
  );
}
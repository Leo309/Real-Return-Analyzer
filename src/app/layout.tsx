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
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://realreturns.skynexdigital.com'),
  title: "Real Return Analyzer | SKYNEX DIGITAL",
  description: "Calculate your real returns over time. See how inflation affects your purchasing power, and compare stocks, bonds, and real estate performance. Visualize your financial future.",
  keywords: "real return analyzer, investment calculator, inflation calculator, purchasing power, stock returns, bond returns, real estate investment, historical returns, financial planning",
  
  openGraph: {
    title: "Real Return Analyzer | SKYNEX DIGITAL",
    description: "Calculate your real returns over time. See how inflation affects your purchasing power, and compare stocks, bonds, and real estate performance. Visualize your financial future.",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Real Return Analyzer Preview",
      }
    ],
    type: "website",
    locale: "en_US",
    siteName: "SKYNEX DIGITAL",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Real Return Analyzer | SKYNEX DIGITAL",
    description: "Calculate your real returns over time. See how inflation affects your purchasing power, and compare stocks, bonds, and real estate performance.",
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
    canonical: "https://realreturns.skynexdigital.com",
    languages: {
      'en': 'https://realreturns.skynexdigital.com',
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
              "name": "Real Return Analyzer",
              "description": "Calculate your real returns over time. See how inflation affects your purchasing power, and compare stocks, bonds, and real estate performance.",
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
        {/* Fix for Chart.js on Vercel */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              // Pre-initialize chart.js context setup for Vercel
              window.onload = function() {
                if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype) {
                  // Define window extension to avoid TypeScript errors
                  if (typeof window !== 'undefined') {
                    // TypeScript definition approach that avoids empty interface errors
                    Object.defineProperty(window, '_originalGetContext', {
                      value: HTMLCanvasElement.prototype.getContext,
                      writable: true,
                      configurable: true
                    });
                  }
                  
                  // Create a patched version
                  HTMLCanvasElement.prototype.getContext = function(type, options) {
                    // Get the proper function from the stored property
                    const originalFunction = window._originalGetContext;
                    // TypeScript workaround - assert function
                    const originalGetter = originalFunction as typeof HTMLCanvasElement.prototype.getContext;
                    const ctx = originalGetter.call(this, type, options);
                    if (type === '2d' && ctx) {
                      // Fix for empty or undefined dimensions
                      if (!this.style.width) this.style.width = '100%';
                      if (!this.style.height) this.style.height = '100%';
                    }
                    return ctx;
                  };
                }
              };
            `
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-fix`}>
        {children}
      </body>
    </html>
  );
}
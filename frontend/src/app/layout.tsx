import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

export const metadata: Metadata = {
  title: {
    default: "E-Ticaret Platform | Tasarımcı Ürünleri",
    template: "%s | E-Ticaret Platform",
  },
  description: "Influencer ve tasarımcıların benzersiz ürünlerini keşfedin. Tişört, hoodie, poster ve daha fazlası. Premium kalite, özgün tasarımlar.",
  keywords: ["e-ticaret", "tasarım", "tişört", "hoodie", "influencer", "türkiye", "online alışveriş"],
  authors: [{ name: "E-Ticaret Platform" }],
  creator: "E-Ticaret Platform",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "E-Ticaret Platform",
    title: "E-Ticaret Platform | Tasarımcı Ürünleri",
    description: "Influencer ve tasarımcıların benzersiz ürünlerini keşfedin. Premium kalite, özgün tasarımlar.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "E-Ticaret Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Ticaret Platform | Tasarımcı Ürünleri",
    description: "Influencer ve tasarımcıların benzersiz ürünlerini keşfedin.",
    images: [`${siteUrl}/og-image.png`],
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
  verification: {
    // Google Search Console ve diğer doğrulamalar buraya eklenebilir
    // google: "verification_token",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1E293B',
                color: '#F1F5F9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '14px 18px',
                maxWidth: '400px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#1E293B' },
                style: {
                  background: '#1E293B',
                  color: '#F1F5F9',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderLeft: '4px solid #10B981',
                  borderRadius: '14px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 20px rgba(16,185,129,0.1)',
                },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#1E293B' },
                style: {
                  background: '#1E293B',
                  color: '#F1F5F9',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderLeft: '4px solid #EF4444',
                  borderRadius: '14px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 20px rgba(239,68,68,0.1)',
                },
              },
              loading: {
                style: {
                  background: '#1E293B',
                  color: '#F1F5F9',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderLeft: '4px solid #6366F1',
                  borderRadius: '14px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
                },
              },
            }}
          />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


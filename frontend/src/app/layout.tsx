import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ELEGANSIA | Modern Minimalist Fashion",
  description: "Discover unique designs from independent artists. Premium quality, minimalist style.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


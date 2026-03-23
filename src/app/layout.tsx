import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "РемонтТехники33 — ремонт телевизоров и бытовой техники",
  description: "Профессиональный ремонт жк телевизоров и микроволновых печей в г. Ковров",
  icons: {
    icon: "/images/znak-kachestva.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

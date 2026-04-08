import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import YandexMetrika from "@/components/YandexMetrika";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ремонт телевизоров в Коврове",
  description: "Профессиональный ремонт телевизоров в г. Ковров",
  icons: {
    icon: "/images/znak-kachestva.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
        <YandexMetrika />
      </body>
    </html>
  );
}

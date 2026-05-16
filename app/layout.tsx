import type { Metadata } from "next";
import { Ma_Shan_Zheng, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";

const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ma-shan-zheng",
});

const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
});

export const metadata: Metadata = {
  title: "张景皓的成长时光机",
  description: "宝宝满月祝福与照片墙",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${notoSc.variable} ${maShanZheng.variable} font-sans antialiased bg-baby-pink`}>
        <Navbar />
        <MusicPlayer />
        {children}
      </body>
    </html>
  );
}

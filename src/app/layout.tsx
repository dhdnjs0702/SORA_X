import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import { Atkinson_Hyperlegible, Noto_Sans_KR } from "next/font/google";
// import Footer from "../components/Footer";

// 영문 폰트
const atkinsonMono = Atkinson_Hyperlegible({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-atkinson",
});

// 한글 폰트
const notoSansKR = Noto_Sans_KR({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${atkinsonMono.className} ${notoSansKR.className} antialiased flex`}
      >
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}

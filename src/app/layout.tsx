import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import { Open_Sans, Noto_Sans_KR } from "next/font/google";
import ReactQueryProvider from "@/context/QueryClientProvider";

const openSans = Open_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-atkinson",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SORA_X",
  description:
    "Sora_X는 OpenAI의 강력한 언어 모델을 활용하여 다양한 수학 문제를 쉽고 빠르게 해결하는 AI 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="overflow-hidden">
      <body
        className={`${openSans.className} ${notoSansKR.className} antialiased h-screen flex flex-row`}
      >
        <ReactQueryProvider>
          <Header />
          <main className="overflow-y-auto flex-1">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

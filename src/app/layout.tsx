import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NY Archive", // 브라우저 탭에 뜨는 이름
  description: "나영 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {/* 모든 페이지 상단에 헤더 고정 */}
        <Header />

        {/* 실제 페이지 내용들이 들어가는 곳 */}
        <main>{children}</main>

        {/* 모든 페이지 하단에 푸터 고정 */}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const pretendard = localFont({
  src: "../../public/fonts/PretendardSubset.woff2",
  variable: "--font-sans",
  display: "swap",
  preload: true,
});
export const metadata: Metadata = {
  title: { default: "유상완 — Developer", template: "%s · 유상완" },
  description:
    "화면과 서버, AI 에이전트까지 결과를 끝까지 확인하는 개발자 유상완의 담당 범위, 기술적 판단과 구현 기록입니다.",
  openGraph: {
    title: "유상완 — Developer",
    description: "프론트엔드·백엔드·AI 에이전트. 개발자 유상완의 구현 기록.",
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}

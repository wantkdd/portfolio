import type { Metadata } from "next";
import Link from "next/link";
import { requireCareerAdmin } from "@/lib/career/config";
import "./admin.css";

export const metadata: Metadata = {
  title: "구직관리",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCareerAdmin();
  return (
    <div className="admin">
      <header className="admin-header">
        <Link href="/admin" className="admin-brand">
          구직관리
        </Link>
        <nav aria-label="구직관리 메뉴">
          <Link href="/admin">공고</Link>
          <Link href="/admin/documents">문서</Link>
          <Link href="/admin/saramin">사람인 검색</Link>
          <Link href="/">포트폴리오</Link>
        </nav>
      </header>
      <main id="main" className="admin-main">
        {children}
      </main>
    </div>
  );
}

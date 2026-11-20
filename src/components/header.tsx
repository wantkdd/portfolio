import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
export function Header({ detail = false }: { detail?: boolean }) {
  return (
    <header className="header">
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/" className="wordmark" aria-label="wantkdd · 유상완 홈">
          <Wordmark />
        </Link>
        <div className="nav-links">
          <a href={detail ? "/#work" : "#work"}>Work</a>
          <a href={detail ? "/#about" : "#about"}>About</a>
          <a className="nav-contact" href={detail ? "/#contact" : "#contact"}>
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </div>
      </nav>
    </header>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/wordmark";

export function Header({ detail = false }: { detail?: boolean }) {
  const home = detail ? "/" : "";
  return (
    <header className="header">
      <nav className="nav section-wrap" aria-label="주 메뉴">
        <div className="nav-brand">
          <Link href="/" className="wordmark" aria-label="wantkdd · 유상완 홈">
            <Wordmark />
          </Link>
          <span className="nav-edition">
            PORTFOLIO <i>/</i> 2026
          </span>
        </div>
        <div className="nav-links">
          <a href={home + "#work"}>Work</a>
          <a href={home + "#about"}>About</a>
          <a className="nav-contact" href={home + "#contact"}>
            Contact <ArrowUpRight aria-hidden="true" size={14} />
          </a>
        </div>
      </nav>
    </header>
  );
}

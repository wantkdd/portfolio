import { ArrowDown, ArrowDownToLine, Asterisk } from "lucide-react";
import { Header } from "@/components/header";
import { Comet } from "@/components/comet";
import { NightSky } from "@/components/night-sky";
import { PointerSurface } from "@/components/pointer-surface";
import { ProfileSections } from "@/components/profile-sections";
import { WorkSection } from "@/components/work-section";
import { profile } from "@/data/profile";
import "./profile.css";
import "./work.css";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <PointerSurface effect="sky" className="hero" labelledBy="hero-title">
          <div className="hero-atmosphere" aria-hidden="true" />
          <NightSky />
          <div className="hero-ridges" aria-hidden="true" />
          <div className="hero-body section-wrap">
            <div className="hero-content">
              <p className="hero-byline">
                <Asterisk size={20} aria-hidden="true" />
                <strong>{profile.name}</strong>
                <span className="byline-rule" aria-hidden="true" />
                <span>{profile.title}</span>
              </p>
              <h1 id="hero-title">
                {profile.summary.split(/(?<=\.) /).map((sentence, index) => (
                  <span key={sentence}>
                    {index > 0 && " "}
                    {sentence}
                  </span>
                ))}
              </h1>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  프로젝트 둘러보기 <ArrowDown size={16} aria-hidden="true" />
                </a>
                <a
                  className="button secondary"
                  href="/portfolio.pdf"
                  download="유상완_포트폴리오.pdf"
                >
                  포트폴리오 PDF{" "}
                  <ArrowDownToLine size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <Comet />
          <div className="hero-bottom section-wrap">
            <span>{profile.areas}</span>
            <a href="#work">
              Scroll to work <ArrowDown size={13} aria-hidden="true" />
            </a>
          </div>
        </PointerSurface>
        <WorkSection />
        <ProfileSections />
      </main>
    </>
  );
}

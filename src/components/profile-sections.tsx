import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Github,
  Layers3,
  Sparkles,
} from "lucide-react";
import { CopyEmail } from "@/components/copy-email";
import { Wordmark } from "@/components/wordmark";
import { about, award, timeline } from "@/data/profile";
import { email, github } from "@/data/portfolio";

export function ProfileSections() {
  return (
    <div className="profile-support">
      <section id="about" className="about" aria-labelledby="about-title">
        <div className="section-wrap about-inner">
          <div className="profile-section-label">
            <span>02 / ABOUT</span>
          </div>
          <div className="about-left">
            <h2 id="about-title">
              반복은 줄이고,
              <br />
              함께 가는 속도는
              <br />
              <em>지키도록.</em>
            </h2>
            <figure className="profile-note">
              <div className="profile-portrait">
                <Image
                  src="/images/portrait.webp"
                  alt="개발자 유상완"
                  width={416}
                  height={528}
                  sizes="(max-width: 760px) 88vw, 33vw"
                />
              </div>
              <figcaption>
                <strong>
                  유상완 <span>Sangwan Yu</span>
                </strong>
                <p>
                  반복되는 일을 자동화하고,
                  <br />
                  팀과 함께 쓰는 방법을 고민하는 개발자
                </p>
              </figcaption>
            </figure>
          </div>
          <div className="about-right">
            <p className="about-lead">
              {about.lead[0]}
              <br />
              {about.lead[1]}
            </p>
            {about.paragraphs.map((text) => (
              <p key={text.slice(0, 20)}>{text}</p>
            ))}
            <a
              className="text-link"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub에서 더 알아보기{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="principles">
            <article>
              <div className="principle-index">
                <Code2 size={23} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3>경험을 만드는 프론트엔드</h3>
              <p>
                SSR 인증 실패와 계정 전환 후 캐시 잔류를 다루며 화면에 보여줄
                상태를 구분했습니다.
              </p>
              <div className="principle-stack">
                React / Next.js / TypeScript
              </div>
            </article>
            <article>
              <div className="principle-index">
                <Layers3 size={23} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3>믿을 수 있는 서버</h3>
              <p>
                동시 요청의 중복 기록을 막고, 저장소 장애에도 응답하도록
                설계했습니다.
              </p>
              <div className="principle-stack">
                Spring Boot / FastAPI / Redis / PostgreSQL
              </div>
            </article>
            <article>
              <div className="principle-index">
                <Sparkles size={23} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3>검증하는 AI 에이전트</h3>
              <p>
                문서 검토 에이전트와 학교 시설 예약 MCP 서버를 만들고,
                산학공동연구의 CAD 변환 규칙 실험을 코딩 에이전트로
                운영했습니다.
              </p>
              <div className="principle-stack">
                AX 문서 검토 에이전트 / MCP 서버 / 2D Image To CAD
              </div>
            </article>
          </div>
        </div>
      </section>
      <section
        id="experience"
        className="experience section-wrap"
        aria-labelledby="experience-title"
      >
        <div className="profile-section-label">
          <span>03 / EXPERIENCE</span>
        </div>
        <div className="experience-heading">
          <h2 id="experience-title">
            계속 배우고,
            <br />
            <em>함께 자랍니다.</em>
          </h2>
          <p className="experience-intro">
            배운 것을 나누고 함께 만드는 과정도
            <br />
            개발의 중요한 일부라고 생각합니다.
          </p>
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <div className="timeline-row" key={item.title}>
              <span>{item.period}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                {item.link && (
                  <a
                    className="text-link"
                    href={item.link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.link.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                {item.tags && (
                  <div className="education-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="award-note">
            <Sparkles size={17} aria-hidden="true" />
            <span>{award}</span>
          </div>
        </div>
      </section>
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="contact-inner section-wrap">
          <div className="profile-section-label">
            <span>04 / CONTACT</span>
          </div>
          <div className="contact-content">
            <h2 id="contact-title">
              다음은,
              <br />
              <em>함께 만들까요?</em>
            </h2>
            <p>좋은 아이디어도, 가벼운 인사도 환영합니다.</p>
            <div className="email-row">
              <a href={`mailto:${email}`}>
                <span>{email}</span>
                <ArrowUpRight size={28} aria-hidden="true" />
              </a>
              <CopyEmail email={email} />
            </div>
            <a
              className="contact-github"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} aria-hidden="true" /> GitHub{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <footer className="footer section-wrap">
          <a href="#main" className="wordmark" aria-label="wantkdd · 맨 위로">
            <Wordmark />
          </a>
          <span>© 2026 Sangwan Yu</span>
          <a href="#main">
            맨 위로{" "}
            <ArrowRight size={15} className="up-arrow" aria-hidden="true" />
          </a>
        </footer>
      </section>
    </div>
  );
}

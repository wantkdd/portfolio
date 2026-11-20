import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUpRight,
  ArrowRight,
  Github,
  Code2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { imageDimensions } from "@/data/image-dimensions";
import { Header } from "@/components/header";
import { ProjectGallery } from "@/components/project-gallery";
import { CopyEmail } from "@/components/copy-email";
import { PaperPlane } from "@/components/paper-plane";
import { Wordmark } from "@/components/wordmark";
import { about, award, timeline } from "@/data/profile";
import { PointerSurface } from "@/components/pointer-surface";
import {
  areaLabels,
  email,
  github,
  projectAreas,
  projects,
  type Project,
} from "@/data/portfolio";
function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className={`project-card project-${p.slug}`}
    >
      <div className="project-visual" style={{ background: p.accent }}>
        <span className="pointer-light" aria-hidden="true" />
        <span className="project-category">
          {projectAreas(p)
            .map((area) => areaLabels[area])
            .join(" · ")}
        </span>
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={24} />
        </span>
        {p.slug === "moa" ? (
          <div className="browser-frame">
            <div className="browser-top">
              <i />
              <i />
              <i />
              <span>moa · find your people</span>
            </div>
            <div className="browser-screen">
              <Image
                src={p.image}
                alt={p.imageAlt}
                {...imageDimensions.moa}
                sizes="(max-width: 760px) 90vw, 70vw"
              />
            </div>
          </div>
        ) : p.slug === "moamoa" ? (
          <div className="phone-pair">
            <Image
              src={p.image}
              alt={p.imageAlt}
              {...imageDimensions.moamoa}
              sizes="(max-width:760px) 36vw, 18vw"
            />
            <Image
              src="/images/moamoa2.webp"
              alt="MOAMOA 목표 달성 소개 화면"
              {...imageDimensions.moamoa}
              sizes="(max-width:760px) 36vw, 18vw"
            />
          </div>
        ) : (
          <Image
            className="project-cover"
            src={p.image}
            alt={p.imageAlt}
            {...imageDimensions[p.slug as keyof typeof imageDimensions]}
            sizes="(max-width:760px) 90vw, 45vw"
          />
        )}
      </div>
      <div className="project-caption">
        <div>
          <div className="project-title-line">
            <h3>{p.name}</h3>
            <span>{p.period}</span>
          </div>
          <p className="project-role">{p.role}</p>
          <p className="project-contribution">{p.highlight ?? p.tagline}</p>
          <div className="stack-tags">
            {p.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <ArrowUpRight className="caption-arrow" size={24} />
      </div>
    </Link>
  );
}
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <PointerSurface effect="sky" className="hero" labelledBy="hero-title">
          <Image
            className="sky-image"
            src="/images/sky.webp"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            quality={85}
          />
          <div className="sky-wash" />
          <div className="hero-content">
            <div className="hero-intro">
              <span className="tiny-star">✳</span> Frontend · Backend · AI Agent
            </div>
            <h1 id="hero-title">
              Thoughtful code.
              <br />
              Effortless experiences.
            </h1>
            <p className="hero-description">
              화면과 서버, AI 에이전트까지.
              <br />
              <strong>결과를 끝까지 확인하는 개발자 유상완입니다.</strong>
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                프로젝트 둘러보기 <ArrowDown size={17} />
              </a>
              <a
                className="button secondary"
                href="/portfolio.pdf"
                download="유상완_포트폴리오.pdf"
              >
                포트폴리오 PDF <ArrowDownToLine size={17} />
              </a>
            </div>
          </div>
          <PaperPlane />
          <div className="hero-bottom">
            <span>유상완 · Software Developer</span>
            <a href="#work">
              Scroll to explore <ArrowDown size={14} />
            </a>
            <span>Portfolio / 2026</span>
          </div>
        </PointerSurface>
        <section
          id="work"
          className="work section-wrap"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div className="section-kicker">
              <span /> Selected work
            </div>
            <div className="heading-row">
              <h2 id="work-title">
                Ideas, made real<span>.</span>
              </h2>
              <p>
                화면부터 서버, AI 에이전트까지.
                <br />
                맡은 범위와 판단의 근거를 담았습니다.
              </p>
            </div>
          </div>
          <ProjectGallery
            items={projects.map((p) => ({
              slug: p.slug,
              areas: projectAreas(p),
              content: <ProjectCard project={p} />,
            }))}
          />
        </section>
        <section id="about" className="about" aria-labelledby="about-title">
          <div className="section-wrap about-inner">
            <div className="about-left">
              <div className="section-kicker">
                <span /> A little about me
              </div>
              <h2 id="about-title">
                반복은 줄이고,
                <br />
                함께 가는 속도는
                <br />
                지키도록.
              </h2>
              <div className="profile-note">
                <Image
                  src="/images/portrait.webp"
                  alt="개발자 유상완"
                  width={208}
                  height={264}
                />
                <div>
                  <strong>
                    유상완 <span>Sangwan Yu</span>
                  </strong>
                  <p>
                    반복되는 일을 자동화하고, 팀과 함께 쓰는 방법을 고민하는
                    개발자
                  </p>
                </div>
              </div>
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
                GitHub에서 더 알아보기 <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="principles">
              <article>
                <Code2 size={26} strokeWidth={1.4} />
                <h3>경험을 만드는 프론트엔드</h3>
                <p>
                  SSR 인증 실패와 계정 전환 후 캐시 잔류를 다루며
                  <br />
                  화면에 보여줄 상태를 구분했습니다.
                </p>
                <div>React / Next.js / TypeScript</div>
              </article>
              <article>
                <Layers3 size={26} strokeWidth={1.4} />
                <h3>믿을 수 있는 서버</h3>
                <p>
                  동시 요청의 중복 기록을 막고,
                  <br />
                  저장소 장애에도 응답하도록 설계했습니다.
                </p>
                <div>Spring Boot / FastAPI / Redis / PostgreSQL</div>
              </article>
              <article>
                <Sparkles size={26} strokeWidth={1.4} />
                <h3>검증하는 AI 에이전트</h3>
                <p>
                  문서 검토 에이전트와 학교 시설 예약 MCP 서버를 만들고,
                  <br />
                  산학공동연구의 CAD 변환 규칙 실험을 코딩 에이전트로
                  운영했습니다.
                </p>
                <div>AX 문서 검토 에이전트 / MCP 서버 / 2D Image To CAD</div>
              </article>
            </div>
          </div>
        </section>
        <section
          className="experience section-wrap"
          aria-labelledby="experience-title"
        >
          <div>
            <div className="section-kicker">
              <span /> Along the way
            </div>
            <h2 id="experience-title">
              계속 배우고,
              <br />
              함께 자랍니다.
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
                      {item.link.label}{" "}
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
              <Sparkles size={17} />
              <span>{award}</span>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-cloud" />
          <div className="contact-inner">
            <div className="section-kicker">
              <span /> Have something in mind?
            </div>
            <h2 id="contact-title">
              Let’s make
              <br />
              something good.
            </h2>
            <p>좋은 아이디어도, 가벼운 인사도 환영합니다.</p>
            <div className="email-row">
              <a href={`mailto:${email}`}>
                {email}
                <ArrowUpRight size={28} />
              </a>
              <CopyEmail email={email} />
            </div>
            <a
              className="contact-github"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} /> GitHub <ArrowUpRight size={15} />
            </a>
          </div>
          <footer className="footer section-wrap">
            <a href="#main" className="wordmark" aria-label="wantkdd · 맨 위로">
              <Wordmark />
            </a>
            <span>© 2026 Sangwan Yu</span>
            <a href="#main">
              Back to top <ArrowRight size={15} className="up-arrow" />
            </a>
          </footer>
        </section>
      </main>
    </>
  );
}

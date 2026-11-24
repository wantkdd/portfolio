import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  LockKeyhole,
} from "lucide-react";
import { Header } from "@/components/header";
import {
  areaLabels,
  projectAreas,
  projects,
  type EvidenceLink,
} from "@/data/portfolio";
import { imageDimensions } from "@/data/image-dimensions";
import "./project-detail.css";

export const dynamicParams = false;

function EvidenceLinks({ links }: { links: EvidenceLink[] }) {
  return (
    <ul className="evidence-links">
      {links.map(({ label, url }) => (
        <li key={url}>
          <a href={url} target="_blank" rel="noreferrer">
            {label} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  return {
    title: project?.name ?? "프로젝트",
    description: project?.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const dimensions = imageDimensions[slug as keyof typeof imageDimensions];

  return (
    <>
      <Header detail />
      <main id="main" className="detail-page section-wrap">
        <section className="detail-lead" aria-labelledby="project-title">
          <div className="detail-heading">
            <Link className="back-link" href="/#work">
              <ArrowLeft size={16} aria-hidden="true" /> 모든 프로젝트
            </Link>
            <p className="detail-eyebrow">
              {projectAreas(project)
                .map((area) => areaLabels[area])
                .join(" / ")}
            </p>
            <h1 id="project-title">{project.name}</h1>
            <p className="detail-tagline">{project.tagline}</p>
            <p className="detail-description">{project.description}</p>
          </div>
          <div
            className={`detail-visual ${slug === "moamoa" ? "mobile-visual" : ""}`}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              {...dimensions}
              sizes={
                slug === "moamoa"
                  ? "(max-width:760px) 40vw, 300px"
                  : "(max-width:640px) 90vw, (max-width:1200px) 48vw, 650px"
              }
              preload
            />
            {slug === "moamoa" && (
              <Image
                src="/images/moamoa2.webp"
                alt="MOAMOA 목표 달성 기능 소개"
                {...imageDimensions.moamoa2}
                sizes="(max-width:760px) 40vw, 300px"
              />
            )}
          </div>
        </section>
        <section className="detail-overview" aria-label="프로젝트 개요">
          <dl className="detail-meta">
            <div>
              <dt>기간</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>담당 역할</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>사용 기술</dt>
              <dd>{project.stack.join(" / ")}</dd>
            </div>
          </dl>
          <div className="project-brief">
            <div>
              <h2>직접 맡은 일</h2>
              <p>{project.scope ?? project.role}</p>
            </div>
            <div>
              <h2>핵심 개선</h2>
              <p>{project.highlight ?? project.description}</p>
            </div>
          </div>
          <div className="project-sources">
            {project.repository?.visibility === "public" &&
              project.repository.url && (
                <a
                  className="button primary"
                  href={project.repository.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={17} aria-hidden="true" /> 공개 저장소
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
            {project.repository?.visibility === "private" && (
              <p className="private-source">
                <LockKeyhole size={16} aria-hidden="true" />
                비공개 저장소 · 공개 포트폴리오 범위의 구현 사례를 정리했습니다.
              </p>
            )}
            {project.links && <EvidenceLinks links={project.links} />}
          </div>
          <nav className="case-nav" aria-label="구현 사례 바로가기">
            {project.cases.map((entry, caseIndex) => (
              <a key={entry.title} href={`#case-${caseIndex + 1}`}>
                <span>{String(caseIndex + 1).padStart(2, "0")}</span>
                <strong>{entry.title}</strong>
                <small className="case-areas">
                  {entry.areas.map((area) => areaLabels[area]).join(" · ")}
                </small>
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </section>
        {project.video && (
          <figure className="detail-video">
            <video
              src={project.video.src}
              poster={project.video.poster}
              controls
              preload="none"
              playsInline
            />
            <figcaption>{project.video.caption}</figcaption>
          </figure>
        )}
        {project.figures && (
          <div className="detail-figures">
            {project.figures.map((figure) => (
              <figure key={figure.image}>
                <Image
                  src={`/images/${figure.image}.webp`}
                  alt={figure.alt}
                  {...imageDimensions[figure.image]}
                  sizes="(max-width:760px) 90vw, 1100px"
                />
                <figcaption>{figure.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
        <div className="case-studies">
          {project.cases.map((entry, caseIndex) => (
            <article
              className="case-study"
              id={`case-${caseIndex + 1}`}
              key={entry.title}
            >
              <span className="case-number" aria-hidden="true">
                {String(caseIndex + 1).padStart(2, "0")}
              </span>
              <p className="case-areas">
                {entry.areas.map((area) => areaLabels[area]).join(" · ")}
              </p>
              <h2>{entry.title}</h2>
              <div className="case-step">
                <h3>문제</h3>
                <p>{entry.problem}</p>
              </div>
              <div className="case-step">
                <h3>판단과 구현</h3>
                <p>{entry.solution}</p>
              </div>
              <div className="case-step case-result">
                <h3>결과</h3>
                <p>{entry.result}</p>
              </div>
              {entry.verification && (
                <div className="case-verification">
                  <h3>검증과 기록</h3>
                  <p>{entry.verification}</p>
                </div>
              )}
              {entry.limitation && (
                <div className="case-step case-limitation">
                  <h3>남은 과제</h3>
                  <p>{entry.limitation}</p>
                </div>
              )}
              {entry.links && <EvidenceLinks links={entry.links} />}
            </article>
          ))}
          {project.benchmark && (
            <section className="benchmark" aria-labelledby="benchmark-title">
              <h2 id="benchmark-title">같은 조건에서 비교한 기록</h2>
              <p>{project.benchmark.context}</p>
              <table>
                <caption>{project.benchmark.caption}</caption>
                <thead>
                  <tr>
                    <th scope="col">측정 항목</th>
                    <th scope="col">개선 전</th>
                    <th scope="col">개선 후</th>
                  </tr>
                </thead>
                <tbody>
                  {project.benchmark.metrics.map((metric) => (
                    <tr key={metric.label}>
                      <th scope="row">{metric.label}</th>
                      <td>{metric.before}</td>
                      <td>{metric.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {project.benchmark.source && (
                <EvidenceLinks links={[project.benchmark.source]} />
              )}
            </section>
          )}
          {project.note && <aside className="case-note">{project.note}</aside>}
          <a
            className="text-link"
            href="/portfolio.pdf"
            download="유상완_포트폴리오.pdf"
          >
            전체 포트폴리오 PDF <ArrowUpRight size={17} />
          </a>
        </div>
        <Link className="next-project" href={`/projects/${next.slug}`}>
          <div>
            <small>다음 프로젝트</small>
            <h2>{next.name}</h2>
          </div>
          <ArrowUpRight size={40} strokeWidth={1} />
        </Link>
      </main>
      <footer className="detail-footer">
        <Link href="/#contact">함께 만들고 싶은 것이 있나요? 연락하기 ↗</Link>
      </footer>
    </>
  );
}

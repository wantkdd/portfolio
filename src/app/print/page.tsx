/* eslint-disable @next/next/no-img-element -- PDF 출력용 페이지라 지연 로딩 없이 모든 이미지를 바로 그린다. */
import type { Metadata } from "next";
import { Wordmark } from "@/components/wordmark";
import {
  areaLabels,
  email,
  github,
  projectAreas,
  projects,
} from "@/data/portfolio";
import { about, award, profile, timeline } from "@/data/profile";
import "./print.css";

// 포트폴리오 PDF의 원본 페이지. `npm run pdf`가 이 페이지를 A4 PDF로 저장한다.
export const metadata: Metadata = {
  title: "포트폴리오 PDF",
  robots: { index: false, follow: false },
};

const linkText = (url: string) => url.replace(/^https?:\/\//, "");

export default function PrintPage() {
  return (
    <main className="print-doc">
      <section className="print-cover">
        <Wordmark className="print-wordmark" />
        <p className="print-areas">{profile.areas}</p>
        <h1>
          {profile.name} <span>{profile.nameEn}</span>
        </h1>
        <p className="print-summary">{profile.summary}</p>
        <dl className="print-contact">
          <div>
            <dt>Email</dt>
            <dd>{email}</dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd>{linkText(github)}</dd>
          </div>
          <div>
            <dt>Web</dt>
            <dd>{linkText(profile.site)}</dd>
          </div>
        </dl>
        <div className="print-about">
          <p className="print-lead">{about.lead.join(" ")}</p>
          {about.paragraphs.map((text) => (
            <p key={text.slice(0, 20)}>{text}</p>
          ))}
        </div>
        <div className="print-timeline">
          {timeline.map((item) => (
            <div key={item.title}>
              <span>{item.period}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
                {item.tags && (
                  <p className="print-tags">{item.tags.join(" · ")}</p>
                )}
              </div>
            </div>
          ))}
          <div>
            <span>2026.06</span>
            <div>
              <strong>{award}</strong>
            </div>
          </div>
        </div>
        <ol className="print-index">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{p.name}</strong>
              <em>{p.role}</em>
              <small>
                {projectAreas(p)
                  .map((a) => areaLabels[a])
                  .join(" · ")}
              </small>
            </li>
          ))}
        </ol>
      </section>

      {projects.map((p, i) => (
        <section className="print-project" key={p.slug}>
          <header>
            <span className="print-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{p.name}</h2>
              <p>
                {p.period} · {p.role}
              </p>
            </div>
            <small>
              {projectAreas(p)
                .map((a) => areaLabels[a])
                .join(" · ")}
            </small>
          </header>
          <p className="print-tagline">{p.tagline}</p>
          <p>{p.description}</p>
          <img className="print-cover-image" src={p.image} alt={p.imageAlt} />
          <dl className="print-facts">
            <div>
              <dt>사용 기술</dt>
              <dd>{p.stack.join(" / ")}</dd>
            </div>
            <div>
              <dt>직접 맡은 일</dt>
              <dd>{p.scope}</dd>
            </div>
            <div>
              <dt>핵심 개선</dt>
              <dd>{p.highlight}</dd>
            </div>
            <div>
              <dt>저장소</dt>
              <dd>
                {p.repository.visibility === "public"
                  ? linkText(p.repository.url)
                  : "비공개 저장소 (면접에서 설명)"}
                {p.links?.map((link) => (
                  <span key={link.url}>
                    {" · "}
                    {link.label} {linkText(link.url)}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          {p.figures?.map((figure) => (
            <figure key={figure.image}>
              <img src={`/images/${figure.image}.webp`} alt={figure.alt} />
              <figcaption>{figure.caption}</figcaption>
            </figure>
          ))}
          {p.cases.map((c, ci) => (
            <article className="print-case" key={c.title}>
              <h3>
                <span>{String(ci + 1).padStart(2, "0")}</span> {c.title}
                <small>{c.areas.map((a) => areaLabels[a]).join(" · ")}</small>
              </h3>
              <dl>
                <div>
                  <dt>문제</dt>
                  <dd>{c.problem}</dd>
                </div>
                <div>
                  <dt>판단과 구현</dt>
                  <dd>{c.solution}</dd>
                </div>
                <div>
                  <dt>결과</dt>
                  <dd>{c.result}</dd>
                </div>
                {c.verification && (
                  <div>
                    <dt>검증과 기록</dt>
                    <dd>{c.verification}</dd>
                  </div>
                )}
                {c.limitation && (
                  <div>
                    <dt>남은 과제</dt>
                    <dd>{c.limitation}</dd>
                  </div>
                )}
              </dl>
              {c.links && (
                <ul className="print-links">
                  {c.links.map((link) => (
                    <li key={link.url}>
                      {link.label} — {linkText(link.url)}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
          {p.benchmark && (
            <div className="print-benchmark">
              <p>{p.benchmark.context}</p>
              <table>
                <caption>{p.benchmark.caption}</caption>
                <thead>
                  <tr>
                    <th>측정 항목</th>
                    <th>개선 전</th>
                    <th>개선 후</th>
                  </tr>
                </thead>
                <tbody>
                  {p.benchmark.metrics.map((m) => (
                    <tr key={m.label}>
                      <th>{m.label}</th>
                      <td>{m.before}</td>
                      <td>{m.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {p.note && <p className="print-note">{p.note}</p>}
        </section>
      ))}
    </main>
  );
}

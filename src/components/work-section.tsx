import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import { imageDimensions } from "@/data/image-dimensions";
import {
  areaLabels,
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
      <div className="project-visual">
        <span className="pointer-light" aria-hidden="true" />
        <span className="project-category">
          {projectAreas(p)
            .map((area) => areaLabels[area])
            .join(" · ")}
        </span>
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
        {p.slug === "moa" ? (
          <div className="browser-frame">
            <div className="browser-top" aria-hidden="true">
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
                sizes="(max-width: 760px) 82vw, 52vw"
              />
            </div>
          </div>
        ) : p.slug === "moamoa" ? (
          <div className="phone-pair">
            <Image
              src={p.image}
              alt={p.imageAlt}
              {...imageDimensions.moamoa}
              sizes="(max-width: 760px) 32vw, 16vw"
            />
            <Image
              src="/images/moamoa2.webp"
              alt="MOAMOA 목표 달성 소개 화면"
              {...imageDimensions.moamoa2}
              sizes="(max-width: 760px) 32vw, 16vw"
            />
          </div>
        ) : (
          <Image
            className="project-cover"
            src={p.image}
            alt={p.imageAlt}
            {...imageDimensions[p.slug as keyof typeof imageDimensions]}
            sizes="(max-width: 760px) 82vw, 42vw"
          />
        )}
      </div>
      <div className="project-caption">
        <div>
          <div className="project-title-line">
            <h3>{p.name}</h3>
            <span>{p.period}</span>
          </div>
          <p className="project-tagline">{p.tagline}</p>
          <p className="project-role">{p.role}</p>
          <p className="project-contribution">{p.highlight ?? p.tagline}</p>
          <div className="stack-tags">
            {p.stack.map((stack) => (
              <span key={stack}>{stack}</span>
            ))}
          </div>
          <span className="project-read">
            구현 사례 보기 <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function WorkSection() {
  return (
    <section
      id="work"
      className="work section-wrap"
      aria-labelledby="work-title"
    >
      <div className="work-heading">
        <div className="section-kicker">01 / SELECTED WORK</div>
        <h2 id="work-title">
          프로젝트<span>.</span>
        </h2>
        <p>
          화면부터 서버, AI 에이전트까지.
          <br />
          맡은 범위와 판단의 근거를 담았습니다.
        </p>
      </div>
      <ProjectGallery
        items={projects.map((project) => ({
          slug: project.slug,
          areas: projectAreas(project),
          content: <ProjectCard project={project} />,
        }))}
      />
    </section>
  );
}

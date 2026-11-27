"use client";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { PointerSurface } from "@/components/pointer-surface";
import { areaLabels, areas, type Area } from "@/data/portfolio";

type Filter = "all" | Area;
const isArea = (value: string | null): value is Area =>
  value !== null && (areas as readonly string[]).includes(value);
// 서버 렌더에는 쿼리가 없으므로 null, 브라우저에서는 현재 주소의 role 값을 읽는다.
const noSubscribe = () => () => {};
const readRole = () => new URLSearchParams(window.location.search).get("role");
const noRole = () => null;

export function ProjectGallery({
  items,
}: {
  items: { slug: string; areas: Area[]; content: ReactNode }[];
}) {
  // 지원 직무별 링크(/?role=ai#work)로 들어오면 그 분야로 시작하고, 이후에는 사용자의 선택을 따른다.
  const role = useSyncExternalStore(noSubscribe, readRole, noRole);
  const [chosen, setChosen] = useState<Filter | null>(null);
  const active: Filter = chosen ?? (isArea(role) ? role : "all");

  function choose(next: Filter) {
    setChosen(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("role");
    else url.searchParams.set("role", next);
    window.history.replaceState(null, "", url);
  }

  const filtered = items.filter(
    (p) => active === "all" || p.areas.includes(active),
  );
  return (
    <>
      <div className="work-toolbar">
        <div className="filters" role="group" aria-label="프로젝트 분야 선택">
          <button
            type="button"
            aria-pressed={active === "all"}
            onClick={() => choose("all")}
          >
            All
            <span>{String(items.length).padStart(2, "0")}</span>
          </button>
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              aria-pressed={active === area}
              onClick={() => choose(area)}
            >
              {areaLabels[area]}
            </button>
          ))}
        </div>
        <span className="result-count" role="status">
          {filtered.length} projects
        </span>
      </div>
      <div className={`project-grid ${active === "all" ? "all-projects" : ""}`}>
        {filtered.map((p, index) => (
          <PointerSurface
            effect="card"
            className={`project-item item-${p.slug}${active === "all" && index === 0 ? " is-featured" : ""}`}
            key={p.slug}
          >
            {p.content}
          </PointerSurface>
        ))}
      </div>
    </>
  );
}

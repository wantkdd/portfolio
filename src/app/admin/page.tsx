import Link from "next/link";
import { requireCareerAdmin } from "@/lib/career/config";
import {
  byDeadline,
  daysUntil,
  listPostings,
  postingStatuses,
  postingTracks,
  trackLabel,
} from "@/lib/career/postings";
import { updateStatus } from "./actions";
import { DeadlineBadge } from "./deadline-badge";

const closedStatuses: Record<string, true> = {
  offer: true,
  rejected: true,
  skipped: true,
};

export default async function AdminPostingsPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; all?: string }>;
}) {
  await requireCareerAdmin();
  const { track, all } = await searchParams;
  const postings = (await listPostings()).sort(byDeadline);
  const open = postings.filter((p) => !closedStatuses[p.status]);
  const urgent = open.filter(
    (p) =>
      p.deadline && daysUntil(p.deadline) >= 0 && daysUntil(p.deadline) <= 7,
  );
  const shown = postings.filter(
    (p) => (all || !closedStatuses[p.status]) && (!track || p.track === track),
  );
  const counts = postingStatuses.map(([key, label]) => [
    label,
    postings.filter((p) => p.status === key).length,
  ]);

  return (
    <>
      <section>
        <h1>지원할 공고</h1>
        <p className="admin-muted">
          {open.length}개 진행 중 · 7일 안에 마감 {urgent.length}개. 마감일과
          자격은 지원 직전에 공식 페이지에서 다시 확인하세요.
        </p>
      </section>

      <section className="admin-stats" aria-label="상태별 개수">
        {counts.map(([label, count]) => (
          <div key={label}>
            <span className="admin-muted">{label}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </section>

      <section>
        <div className="admin-actions" role="group" aria-label="직무 필터">
          <Link
            className={`admin-button ${track ? "ghost" : ""}`}
            href="/admin"
          >
            전체
          </Link>
          {postingTracks.map(([key, label]) => (
            <Link
              key={key}
              className={`admin-button ${track === key ? "" : "ghost"}`}
              href={`/admin?track=${key}`}
            >
              {label}
            </Link>
          ))}
          <Link
            className="admin-button ghost"
            href={all ? "/admin" : "/admin?all=1"}
          >
            {all ? "진행 중만 보기" : "끝난 공고도 보기"}
          </Link>
          <Link className="admin-button" href="/admin/postings/new">
            공고 추가
          </Link>
        </div>
      </section>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">마감</th>
              <th scope="col">회사 · 공고</th>
              <th scope="col">직무</th>
              <th scope="col">적합도</th>
              <th scope="col">자소서</th>
              <th scope="col">상태</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td>
                  <DeadlineBadge posting={p} />
                </td>
                <td>
                  <Link href={`/admin/postings/${encodeURIComponent(p.id)}`}>
                    <strong>{p.company}</strong>
                  </Link>
                  <div>{p.title}</div>
                  <div className="admin-muted">
                    {[p.employment, p.location].filter(Boolean).join(" · ")}
                  </div>
                </td>
                <td>{trackLabel(p.track)}</td>
                <td>{p.fit ?? "-"}</td>
                <td>
                  {p.resume ? (
                    <Link
                      href={`/admin/documents/view?path=${encodeURIComponent(p.resume)}`}
                    >
                      보기
                    </Link>
                  ) : (
                    <span className="admin-muted">없음</span>
                  )}
                </td>
                <td>
                  <form action={updateStatus} className="admin-inline-form">
                    <input type="hidden" name="id" value={p.id} />
                    <select
                      name="status"
                      defaultValue={p.status}
                      aria-label={`${p.company} 상태`}
                    >
                      {postingStatuses.map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button className="admin-button ghost" type="submit">
                      저장
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-muted">
                  해당하는 공고가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

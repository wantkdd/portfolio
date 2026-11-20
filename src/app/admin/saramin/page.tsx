import { requireCareerAdmin } from "@/lib/career/config";
import { listPostings } from "@/lib/career/postings";
import {
  saraminKeyConfigured,
  searchSaramin,
  type SaraminSearch,
} from "@/lib/career/saramin";
import { addSaraminJob } from "../actions";

const sorts: [SaraminSearch["sort"], string][] = [
  ["pd", "최근 게시순"],
  ["da", "마감 임박순"],
  ["rc", "조회수순"],
  ["ac", "지원자수순"],
];
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "short",
  day: "numeric",
});

export default async function SaraminPage({
  searchParams,
}: {
  searchParams: Promise<{
    keywords?: string;
    sort?: string;
    start?: string;
    entry?: string;
  }>;
}) {
  await requireCareerAdmin();
  const params = await searchParams;
  const keywords = params.keywords?.trim() ?? "";
  const sort = (sorts.find(([key]) => key === params.sort)?.[0] ??
    "pd") as SaraminSearch["sort"];
  const start = Number(params.start ?? 0) || 0;
  const entryOnly = params.entry !== "0";
  const configured = saraminKeyConfigured();
  const result =
    configured && keywords
      ? await searchSaramin({ keywords, sort, count: 50, start })
      : null;
  const saved = new Set(
    (await listPostings()).map((p) => p.saraminId).filter(Boolean),
  );
  // 1 신입, 3 신입/경력, 0 경력무관
  const jobs =
    result?.ok === true
      ? result.jobs.filter(
          (j) =>
            j.active && (!entryOnly || [0, 1, 3].includes(j.experienceCode)),
        )
      : [];

  return (
    <>
      <section>
        <h1>사람인 공고 검색</h1>
        <p className="admin-muted">
          사람인 채용공고 API로 검색합니다. 하루 500회까지 호출할 수 있어
          페이지를 열 때마다가 아니라 검색할 때만 부릅니다.
        </p>
      </section>

      {!configured && (
        <section className="admin-card admin-prose">
          <h2>access-key가 필요합니다</h2>
          <ol>
            <li>
              <a
                href="https://oapi.saramin.co.kr/join"
                target="_blank"
                rel="noreferrer"
              >
                사람인 API 이용신청
              </a>
              에서 신청하고 승인 메일을 기다립니다 (사용할 URL, 50자 이상 이용
              목적 필요).
            </li>
            <li>
              승인 뒤 Application → 앱 등록 → 내 앱리스트에서 키를 확인합니다.
            </li>
            <li>
              이 폴더의 <code>.env.local</code>에{" "}
              <code>SARAMIN_ACCESS_KEY=발급받은키</code>를 넣고 개발 서버를 다시
              켭니다.
            </li>
          </ol>
        </section>
      )}

      <form className="admin-card admin-actions" method="get">
        <input
          name="keywords"
          defaultValue={keywords}
          placeholder="예: AI 에이전트, LLM, FastAPI"
          aria-label="검색어"
          style={{ flex: "1 1 260px" }}
        />
        <select name="sort" defaultValue={sort} aria-label="정렬">
          {sorts.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="entry"
          defaultValue={entryOnly ? "1" : "0"}
          aria-label="경력 조건"
        >
          <option value="1">신입 지원 가능만</option>
          <option value="0">경력 포함 전체</option>
        </select>
        <button className="admin-button" type="submit" disabled={!configured}>
          검색
        </button>
      </form>

      {result?.ok === false && <p className="admin-card">{result.message}</p>}

      {result?.ok === true && (
        <section className="admin-table-wrap">
          <table className="admin-table">
            <caption
              className="admin-muted"
              style={{ textAlign: "left", padding: "12px 14px" }}
            >
              전체 {result.total.toLocaleString()}건 중 {start * 50 + 1}~
              {start * 50 + result.jobs.length}번째 · 조건에 맞는 {jobs.length}
              건
            </caption>
            <thead>
              <tr>
                <th scope="col">회사 · 공고</th>
                <th scope="col">경력 · 학력</th>
                <th scope="col">마감</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.company}</strong>
                    <div>
                      <a href={job.url} target="_blank" rel="noreferrer">
                        {job.title}
                      </a>
                    </div>
                    <div className="admin-muted">
                      {[job.jobType, job.location].filter(Boolean).join(" · ")}
                    </div>
                  </td>
                  <td>
                    {job.experience}
                    <div className="admin-muted">{job.education}</div>
                  </td>
                  <td>
                    {job.deadline
                      ? dateFormat.format(new Date(job.deadline))
                      : job.closeType}
                  </td>
                  <td>
                    {saved.has(job.id) ? (
                      <span className="admin-badge">추가됨</span>
                    ) : (
                      <form action={addSaraminJob}>
                        <input type="hidden" name="saraminId" value={job.id} />
                        <input
                          type="hidden"
                          name="company"
                          value={job.company}
                        />
                        <input type="hidden" name="title" value={job.title} />
                        <input type="hidden" name="url" value={job.url} />
                        <input
                          type="hidden"
                          name="employment"
                          value={job.jobType}
                        />
                        <input
                          type="hidden"
                          name="location"
                          value={job.location}
                        />
                        <input
                          type="hidden"
                          name="deadline"
                          value={job.deadline ?? ""}
                        />
                        <input
                          type="hidden"
                          name="deadlineNote"
                          value={job.deadline ? "" : job.closeType}
                        />
                        <button className="admin-button ghost" type="submit">
                          목록에 추가
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-actions" style={{ padding: 12 }}>
            {start > 0 && (
              <a
                className="admin-button ghost"
                href={`?${new URLSearchParams({ keywords, sort, entry: entryOnly ? "1" : "0", start: String(start - 1) })}`}
              >
                이전
              </a>
            )}
            {(start + 1) * 50 < result.total && (
              <a
                className="admin-button ghost"
                href={`?${new URLSearchParams({ keywords, sort, entry: entryOnly ? "1" : "0", start: String(start + 1) })}`}
              >
                다음
              </a>
            )}
          </div>
        </section>
      )}
    </>
  );
}

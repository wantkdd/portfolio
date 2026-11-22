/**
 * 사람인 채용공고 API (https://oapi.saramin.co.kr/guide/job-search).
 * access-key 는 서버에서만 쓴다. 하루 500회, 한 번에 최대 110건.
 */

export type SaraminJob = {
  id: string;
  url: string;
  active: boolean;
  company: string;
  title: string;
  location: string;
  jobType: string;
  experience: string;
  /** 1 신입, 2 경력, 3 신입/경력, 0 경력무관 */
  experienceCode: number;
  education: string;
  keyword: string;
  /** ISO 8601 또는 null (채용 시 마감·상시 등) */
  deadline: string | null;
  closeType: string;
};

export type SaraminSearch = {
  keywords: string;
  sort: "pd" | "da" | "rc" | "ac";
  count: number;
  start: number;
};

export type SaraminResult =
  | { ok: true; total: number; jobs: SaraminJob[] }
  | { ok: false; message: string };

type Named = {
  code?: string | number;
  name?: string;
  min?: number;
  max?: number;
};
type RawJob = {
  id: string;
  url: string;
  active: number | string;
  company?: { detail?: { name?: string } };
  position?: {
    title?: string;
    location?: Named;
    "job-type"?: Named;
    "experience-level"?: Named;
    "required-education-level"?: Named;
  };
  keyword?: string;
  "expiration-timestamp"?: string;
  "close-type"?: Named;
};

export function saraminKeyConfigured(): boolean {
  return Boolean(process.env.SARAMIN_ACCESS_KEY);
}

function normalize(job: RawJob): SaraminJob {
  const p = job.position ?? {};
  const closeCode = String(job["close-type"]?.code ?? "");
  const ts = Number(job["expiration-timestamp"]);
  return {
    id: String(job.id),
    url: job.url,
    active: Number(job.active) === 1,
    company: job.company?.detail?.name ?? "",
    title: p.title ?? "",
    location: p.location?.name ?? "",
    jobType: p["job-type"]?.name ?? "",
    experience: p["experience-level"]?.name ?? "",
    experienceCode: Number(p["experience-level"]?.code ?? -1),
    education: p["required-education-level"]?.name ?? "",
    keyword: job.keyword ?? "",
    // 접수 마감일(1)일 때만 마감 시각이 의미 있다.
    deadline:
      closeCode === "1" && ts > 0 ? new Date(ts * 1000).toISOString() : null,
    closeType: job["close-type"]?.name ?? "",
  };
}

export async function searchSaramin(
  query: SaraminSearch,
): Promise<SaraminResult> {
  const key = process.env.SARAMIN_ACCESS_KEY;
  if (!key)
    return { ok: false, message: "SARAMIN_ACCESS_KEY 가 설정되지 않았습니다." };
  const params = new URLSearchParams({
    "access-key": key,
    keywords: query.keywords,
    sort: query.sort,
    count: String(Math.min(Math.max(query.count, 1), 110)),
    start: String(Math.max(query.start, 0)),
  });
  let res: Response;
  try {
    res = await fetch(`https://oapi.saramin.co.kr/job-search?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    return {
      ok: false,
      message: `사람인 API 요청 실패: ${(error as Error).message}`,
    };
  }
  const body = (await res.json().catch(() => null)) as {
    jobs?: { total?: string | number; job?: RawJob[] };
    result?: { code?: string; message?: string };
  } | null;
  if (!body)
    return {
      ok: false,
      message: `사람인 API 응답을 읽지 못했습니다 (HTTP ${res.status}).`,
    };
  if (body.result) {
    return {
      ok: false,
      message:
        `사람인 API 오류 ${body.result.code}: ${body.result.message ?? ""}`.trim(),
    };
  }
  const jobs = (body.jobs?.job ?? []).map(normalize);
  return { ok: true, total: Number(body.jobs?.total ?? jobs.length), jobs };
}

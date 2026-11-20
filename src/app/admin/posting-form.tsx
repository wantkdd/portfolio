import {
  postingStatuses,
  postingTracks,
  type Posting,
} from "@/lib/career/postings";
import { savePosting } from "./actions";

const kstLocal = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** datetime-local 입력값 (한국 시간, YYYY-MM-DDTHH:mm) */
const toLocalInput = (iso: string | null | undefined) =>
  iso ? kstLocal.format(new Date(iso)).replace(" ", "T") : "";

export function PostingForm({
  posting,
  documentPaths,
}: {
  posting?: Posting;
  documentPaths: string[];
}) {
  return (
    <form action={savePosting} className="admin-form admin-card">
      <input type="hidden" name="id" value={posting?.id ?? ""} />
      <label>
        회사 *
        <input name="company" required defaultValue={posting?.company} />
      </label>
      <label className="wide">
        공고명 *
        <input name="title" required defaultValue={posting?.title} />
      </label>
      <label className="wide">
        공식 공고 링크
        <input name="url" type="url" defaultValue={posting?.url} />
      </label>
      <label>
        직무
        <select name="track" defaultValue={posting?.track ?? "ai"}>
          {postingTracks.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        상태
        <select name="status" defaultValue={posting?.status ?? "interested"}>
          {postingStatuses.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        적합도
        <select name="fit" defaultValue={posting?.fit ?? ""}>
          <option value="">-</option>
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
        </select>
      </label>
      <label>
        고용 형태
        <input name="employment" defaultValue={posting?.employment} />
      </label>
      <label>
        근무지
        <input name="location" defaultValue={posting?.location} />
      </label>
      <label>
        마감 (한국 시간)
        <input
          name="deadline"
          type="datetime-local"
          defaultValue={toLocalInput(posting?.deadline)}
        />
      </label>
      <label>
        마감 메모 (마감일이 없을 때)
        <input
          name="deadlineNote"
          placeholder="상시, 채용 시 마감 …"
          defaultValue={posting?.deadlineNote}
        />
      </label>
      <label>
        마지막 확인일
        <input name="checkedAt" type="date" defaultValue={posting?.checkedAt} />
      </label>
      <label className="wide">
        이 공고에 쓸 자소서
        <input
          name="resume"
          list="career-docs"
          defaultValue={posting?.resume}
        />
      </label>
      <label className="wide">
        포트폴리오
        <input
          name="portfolio"
          list="career-docs"
          defaultValue={posting?.portfolio}
        />
      </label>
      <datalist id="career-docs">
        {documentPaths.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <label className="wide">
        메모
        <textarea name="notes" defaultValue={posting?.notes} />
      </label>
      <div className="wide admin-actions">
        <button className="admin-button" type="submit">
          저장
        </button>
      </div>
    </form>
  );
}

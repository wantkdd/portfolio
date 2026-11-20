import { readFile } from "node:fs/promises";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCareerAdmin, resolveStoredPath } from "@/lib/career/config";
import { listDocuments } from "@/lib/career/documents";
import { getPosting, statusLabel, trackLabel } from "@/lib/career/postings";
import { removePosting } from "../../actions";
import { DeadlineBadge } from "../../deadline-badge";
import { Markdown } from "../../markdown";
import { PostingForm } from "../../posting-form";

export default async function PostingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCareerAdmin();
  const id = decodeURIComponent((await params).id);
  const documents = await listDocuments();
  const documentPaths = documents
    .filter((d) => d.kind === "md" || d.kind === "pdf")
    .map((d) => d.stored);

  if (id === "new") {
    return (
      <>
        <h1>공고 추가</h1>
        <PostingForm documentPaths={documentPaths} />
      </>
    );
  }

  const posting = await getPosting(id);
  if (!posting) notFound();
  const resumePath = posting.resume && resolveStoredPath(posting.resume);
  const resume = resumePath
    ? await readFile(resumePath, "utf8").catch(() => null)
    : null;

  return (
    <>
      <section>
        <p className="admin-muted">
          <Link href="/admin">← 공고 목록</Link>
        </p>
        <h1>
          {posting.company} — {posting.title}
        </h1>
      </section>

      <section className="admin-card">
        <dl className="admin-dl">
          <dt>마감</dt>
          <dd>
            <DeadlineBadge posting={posting} />
          </dd>
          <dt>상태</dt>
          <dd>{statusLabel(posting.status)}</dd>
          <dt>직무</dt>
          <dd>{trackLabel(posting.track)}</dd>
          <dt>형태 · 근무지</dt>
          <dd>
            {[posting.employment, posting.location]
              .filter(Boolean)
              .join(" · ") || "-"}
          </dd>
          <dt>적합도</dt>
          <dd>{posting.fit ?? "-"}</dd>
          <dt>공식 공고</dt>
          <dd>
            {posting.url ? (
              <a href={posting.url} target="_blank" rel="noreferrer">
                {posting.url}
              </a>
            ) : (
              "-"
            )}
          </dd>
          <dt>포트폴리오</dt>
          <dd>
            {posting.portfolio ? (
              <a
                href={`/admin/files?path=${encodeURIComponent(posting.portfolio)}`}
                target="_blank"
                rel="noreferrer"
              >
                {posting.portfolio}
              </a>
            ) : (
              "없음"
            )}
          </dd>
          <dt>확인일</dt>
          <dd>{posting.checkedAt ?? "-"}</dd>
          <dt>출처</dt>
          <dd>
            {posting.source === "saramin"
              ? `사람인 (${posting.saraminId})`
              : "직접 입력"}
          </dd>
        </dl>
        {posting.notes && <p style={{ marginTop: 16 }}>{posting.notes}</p>}
      </section>

      <section>
        <h2>이 공고에 쓸 자소서</h2>
        {resume ? (
          <div className="admin-card admin-prose">
            <p className="admin-muted">
              {posting.resume} ·{" "}
              <Link
                href={`/admin/documents/view?path=${encodeURIComponent(posting.resume!)}`}
              >
                문서 페이지에서 보기
              </Link>
            </p>
            <Markdown source={resume} />
          </div>
        ) : (
          <p className="admin-muted">
            연결된 자소서가 없습니다. 아래에서 경로를 지정하세요.
          </p>
        )}
      </section>

      <section>
        <h2>수정</h2>
        <PostingForm posting={posting} documentPaths={documentPaths} />
      </section>

      <form action={removePosting}>
        <input type="hidden" name="id" value={posting.id} />
        <button className="admin-button danger" type="submit">
          이 공고 삭제
        </button>
      </form>
    </>
  );
}

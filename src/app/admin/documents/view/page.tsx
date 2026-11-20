import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCareerAdmin, resolveStoredPath } from "@/lib/career/config";
import { Markdown } from "../../markdown";

export default async function DocumentViewPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  await requireCareerAdmin();
  const stored = (await searchParams).path ?? "";
  const full = resolveStoredPath(stored);
  if (!full) notFound();
  const ext = path.extname(full).toLowerCase();
  const fileUrl = `/admin/files?path=${encodeURIComponent(stored)}`;

  let body: React.ReactNode;
  if (ext === ".md" || ext === ".json") {
    const text = await readFile(full, "utf8").catch(() => null);
    if (text === null) notFound();
    body =
      ext === ".md" ? (
        <div className="admin-card admin-prose">
          <Markdown source={text} />
        </div>
      ) : (
        <pre className="admin-card" style={{ overflowX: "auto" }}>
          {text}
        </pre>
      );
  } else if (ext === ".pdf") {
    body = (
      <iframe
        className="admin-frame"
        src={fileUrl}
        title={path.basename(full)}
      />
    );
  } else {
    // eslint-disable-next-line @next/next/no-img-element -- 로컬 파일을 그대로 보여준다
    body = <img src={fileUrl} alt={path.basename(full)} />;
  }

  return (
    <>
      <section>
        <p className="admin-muted">
          <Link href="/admin/documents">← 문서 목록</Link> ·{" "}
          <a href={fileUrl} target="_blank" rel="noreferrer">
            원본 파일 열기
          </a>
        </p>
        <h1>{path.basename(full)}</h1>
        <p className="admin-muted">{stored}</p>
      </section>
      {body}
    </>
  );
}

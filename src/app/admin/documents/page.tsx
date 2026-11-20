import Link from "next/link";
import { requireCareerAdmin } from "@/lib/career/config";
import {
  documentGroupOrder,
  listDocuments,
  type CareerDocument,
} from "@/lib/career/documents";

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  dateStyle: "medium",
});
const viewable: Record<string, true> = {
  md: true,
  pdf: true,
  image: true,
  json: true,
};

export default async function DocumentsPage() {
  await requireCareerAdmin();
  const docs = await listDocuments();
  const groups = new Map<string, CareerDocument[]>();
  for (const doc of docs)
    groups.set(doc.group, [...(groups.get(doc.group) ?? []), doc]);
  const ordered = [...groups.entries()].sort(
    ([a], [b]) =>
      (documentGroupOrder.indexOf(a) + 1 || 99) -
      (documentGroupOrder.indexOf(b) + 1 || 99),
  );

  return (
    <>
      <section>
        <h1>문서</h1>
        <p className="admin-muted">
          career/ 폴더와 직무별 PDF 폴더를 그대로 보여줍니다. 원본
          docx(주민번호·주소 포함)는 내려받기만 됩니다.
        </p>
      </section>
      {ordered.map(([group, items]) => (
        <section key={group} className="admin-card">
          <h2>
            {group} <span className="admin-muted">({items.length})</span>
          </h2>
          <ul className="admin-doc-list">
            {items
              .sort((a, b) => b.modified.getTime() - a.modified.getTime())
              .map((doc) => (
                <li key={doc.stored}>
                  <Link
                    href={`/admin/${viewable[doc.kind] ? "documents/view" : "files"}?path=${encodeURIComponent(doc.stored)}`}
                  >
                    {doc.name}
                  </Link>
                  <span className="admin-muted">
                    {doc.kind.toUpperCase()} · {(doc.size / 1024).toFixed(0)}KB
                    · {dateFormat.format(doc.modified)}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}

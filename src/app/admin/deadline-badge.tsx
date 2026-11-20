import { daysUntil, formatDeadline, type Posting } from "@/lib/career/postings";

export function DeadlineBadge({ posting }: { posting: Posting }) {
  if (!posting.deadline)
    return <span className="admin-muted">{formatDeadline(posting)}</span>;
  const days = daysUntil(posting.deadline);
  const label = days < 0 ? "마감" : days === 0 ? "오늘 마감" : `D-${days}`;
  const tone = days < 0 ? "past" : days <= 3 ? "urgent" : "";
  return (
    <span>
      <span className={`admin-badge ${tone}`}>{label}</span>{" "}
      <span className="admin-muted">{formatDeadline(posting)}</span>
    </span>
  );
}

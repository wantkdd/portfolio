import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { rootDir } from "./config";

export const postingStatuses = [
  ["interested", "관심"],
  ["drafting", "작성 중"],
  ["applied", "지원 완료"],
  ["document_pass", "서류 합격"],
  ["interview", "면접"],
  ["offer", "최종 합격"],
  ["rejected", "불합격"],
  ["skipped", "지원 안 함"],
] as const;

export type PostingStatus = (typeof postingStatuses)[number][0];
export const postingTracks = [
  ["ai", "AI 에이전트"],
  ["frontend", "프론트엔드"],
  ["backend", "백엔드"],
  ["other", "기타"],
] as const;
export type PostingTrack = (typeof postingTracks)[number][0];
export type Fit = "상" | "중" | "하";

export type Posting = {
  id: string;
  company: string;
  title: string;
  url: string;
  source: "manual" | "saramin";
  saraminId?: string;
  track: PostingTrack;
  employment?: string;
  location?: string;
  /** ISO 8601. 마감일이 없으면 null 이고 deadlineNote 에 이유(상시, 채용 시 마감 등). */
  deadline: string | null;
  deadlineNote?: string;
  fit?: Fit;
  status: PostingStatus;
  /** 저장 경로. 예: career/profile/기본이력서-수정본-v3-AI에이전트.md */
  resume?: string;
  /** 저장 경로. 예: pdf/유상완 포트폴리오(프론트) v2.pdf */
  portfolio?: string;
  notes?: string;
  checkedAt?: string;
};

const statusLabels: Record<string, string> = Object.fromEntries(postingStatuses);
const trackLabels: Record<string, string> = Object.fromEntries(postingTracks);
export const statusLabel = (s: string) => statusLabels[s] ?? s;
export const trackLabel = (t: string) => trackLabels[t] ?? t;
export const isStatus = (s: string): s is PostingStatus => Object.hasOwn(statusLabels, s);
export const isTrack = (t: string): t is PostingTrack => Object.hasOwn(trackLabels, t);

const dataFile = path.join(rootDir("career"), "data", "postings.json");

export async function listPostings(): Promise<Posting[]> {
  try {
    return JSON.parse(await readFile(dataFile, "utf8")) as Posting[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getPosting(id: string): Promise<Posting | undefined> {
  return (await listPostings()).find((p) => p.id === id);
}

async function saveAll(postings: Posting[]): Promise<void> {
  const tmp = `${dataFile}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(postings, null, 2) + "\n", "utf8");
  await rename(tmp, dataFile);
}

/** id 가 같으면 교체, 없으면 추가한다. */
export async function upsertPosting(posting: Posting): Promise<void> {
  const all = await listPostings();
  const i = all.findIndex((p) => p.id === posting.id);
  if (i === -1) all.push(posting);
  else all[i] = posting;
  await saveAll(all);
}

export async function deletePosting(id: string): Promise<void> {
  await saveAll((await listPostings()).filter((p) => p.id !== id));
}

export function newPostingId(): string {
  return randomUUID().slice(0, 8);
}

const kstDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 마감까지 남은 날 (한국 날짜 기준). 0 = 오늘 마감, 음수 = 지남. */
export function daysUntil(deadline: string, now = new Date()): number {
  const day = (d: Date) => Date.parse(kstDate.format(d));
  return Math.round((day(new Date(deadline)) - day(now)) / 86_400_000);
}

const deadlineFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatDeadline(p: Posting): string {
  if (!p.deadline) return p.deadlineNote ?? "미기재";
  return deadlineFormat.format(new Date(p.deadline));
}

/** 마감 있는 공고는 빠른 순, 마감 없는 공고는 뒤로. */
export function byDeadline(a: Posting, b: Posting): number {
  if (a.deadline && b.deadline) return Date.parse(a.deadline) - Date.parse(b.deadline);
  if (a.deadline) return -1;
  if (b.deadline) return 1;
  return a.company.localeCompare(b.company, "ko");
}

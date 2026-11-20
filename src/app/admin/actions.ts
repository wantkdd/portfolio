"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { careerAdminEnabled, resolveStoredPath } from "@/lib/career/config";
import {
  deletePosting,
  getPosting,
  isStatus,
  isTrack,
  newPostingId,
  upsertPosting,
  type Fit,
  type Posting,
} from "@/lib/career/postings";

function guard() {
  if (!careerAdminEnabled()) notFound();
}

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string) => text(form, key) || undefined;

/** datetime-local 값(한국 시간)을 ISO 로. 비어 있으면 null. */
function deadlineFrom(form: FormData): string | null {
  const value = text(form, "deadline");
  return value ? new Date(`${value}:00+09:00`).toISOString() : null;
}

function storedPathFrom(form: FormData, key: string): string | undefined {
  const value = optional(form, key);
  if (value && !resolveStoredPath(value))
    throw new Error(`허용되지 않은 경로: ${value}`);
  return value;
}

export async function updateStatus(form: FormData) {
  guard();
  const posting = await getPosting(text(form, "id"));
  const status = text(form, "status");
  if (!posting || !isStatus(status)) notFound();
  await upsertPosting({ ...posting, status });
  revalidatePath("/admin");
}

export async function savePosting(form: FormData) {
  guard();
  const id = text(form, "id") || newPostingId();
  const existing = await getPosting(id);
  const track = text(form, "track");
  const status = text(form, "status");
  const fit = text(form, "fit");
  const posting: Posting = {
    ...existing,
    id,
    company: text(form, "company"),
    title: text(form, "title"),
    url: text(form, "url"),
    source: existing?.source ?? "manual",
    track: isTrack(track) ? track : "other",
    status: isStatus(status) ? status : "interested",
    employment: optional(form, "employment"),
    location: optional(form, "location"),
    deadline: deadlineFrom(form),
    deadlineNote: optional(form, "deadlineNote"),
    fit: ["상", "중", "하"].includes(fit) ? (fit as Fit) : undefined,
    resume: storedPathFrom(form, "resume"),
    portfolio: storedPathFrom(form, "portfolio"),
    notes: optional(form, "notes"),
    checkedAt: optional(form, "checkedAt"),
  };
  if (!posting.company || !posting.title)
    throw new Error("회사와 공고명은 필수입니다.");
  await upsertPosting(posting);
  revalidatePath("/admin");
  redirect(`/admin/postings/${encodeURIComponent(id)}`);
}

export async function removePosting(form: FormData) {
  guard();
  await deletePosting(text(form, "id"));
  revalidatePath("/admin");
  redirect("/admin");
}

export async function addSaraminJob(form: FormData) {
  guard();
  const saraminId = text(form, "saraminId");
  const id = `saramin-${saraminId}`;
  if (!(await getPosting(id))) {
    await upsertPosting({
      id,
      saraminId,
      source: "saramin",
      company: text(form, "company"),
      title: text(form, "title"),
      url: text(form, "url"),
      track: "ai",
      employment: optional(form, "employment"),
      location: optional(form, "location"),
      deadline: optional(form, "deadline") ?? null,
      deadlineNote: optional(form, "deadlineNote"),
      status: "interested",
      checkedAt: new Date().toISOString().slice(0, 10),
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/saramin");
}

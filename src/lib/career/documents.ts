import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { rootDir, toStoredPath, type FileRoot } from "./config";

export type CareerDocument = {
  stored: string;
  name: string;
  group: string;
  kind: "md" | "pdf" | "docx" | "image" | "json" | "other";
  size: number;
  modified: Date;
};

function kindOf(name: string): CareerDocument["kind"] {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".md") return "md";
  if (ext === ".pdf") return "pdf";
  if (ext === ".docx") return "docx";
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return "image";
  if (ext === ".json") return "json";
  return "other";
}

const groupLabels: Record<string, string> = {
  "career/profile": "이력서·자소서",
  "career/mentoring": "멘토링",
  "career/references": "합격 자소서 정리",
  "career/references/합격자소서-원문": "합격 자소서 원문",
  "career/applications": "지원·공고 기록",
  "career/data": "데이터",
  pdf: "직무별 이력서·포트폴리오 PDF",
};

async function walk(root: FileRoot, dir: string, out: CareerDocument[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(root, full, out);
    } else if (entry.isFile()) {
      const info = await stat(full);
      const stored = toStoredPath(root, full);
      const groupKey = stored.slice(0, stored.lastIndexOf("/"));
      out.push({
        stored,
        name: entry.name,
        group: groupLabels[groupKey] ?? groupKey,
        kind: kindOf(entry.name),
        size: info.size,
        modified: info.mtime,
      });
    }
  }
}

export async function listDocuments(): Promise<CareerDocument[]> {
  const out: CareerDocument[] = [];
  await walk("career", rootDir("career"), out);
  await walk("pdf", rootDir("pdf"), out);
  return out;
}

export const documentGroupOrder = Object.values(groupLabels);

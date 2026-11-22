import os from "node:os";
import path from "node:path";
import { notFound } from "next/navigation";
import { connection } from "next/server";

/**
 * 구직관리 페이지는 개인 자료(career/)를 읽으므로 로컬에서만 켠다.
 * .env.local 에 CAREER_ADMIN=local 이 없으면 /admin 은 404다 (배포 환경 포함).
 */
export function careerAdminEnabled(): boolean {
  return process.env.CAREER_ADMIN === "local";
}

/** 페이지·라우트 진입점에서 호출한다. 요청 시점에 렌더링하고, 꺼져 있으면 404. */
export async function requireCareerAdmin(): Promise<void> {
  await connection();
  if (!careerAdminEnabled()) notFound();
}

/** 저장 경로의 첫 마디가 어느 폴더를 가리키는지 정한다. 이 밖의 파일은 열지 않는다. */
const fileRoots = {
  career: path.join(process.cwd(), "career"),
  pdf: path.join(os.homedir(), "Documents", "New project 2", "output", "pdf"),
} as const;

export type FileRoot = keyof typeof fileRoots;

export function rootDir(root: FileRoot): string {
  return fileRoots[root];
}

/**
 * "career/profile/a.md", "pdf/b.pdf" 같은 저장 경로를 실제 경로로 바꾼다.
 * 허용된 폴더를 벗어나면(../ 등) null.
 */
export function resolveStoredPath(stored: string): string | null {
  const [head, ...rest] = stored.split("/");
  if (!(head in fileRoots) || rest.length === 0) return null;
  const base = fileRoots[head as FileRoot];
  const full = path.resolve(base, ...rest);
  return full.startsWith(base + path.sep) ? full : null;
}

export function toStoredPath(root: FileRoot, full: string): string {
  return [root, ...path.relative(fileRoots[root], full).split(path.sep)].join(
    "/",
  );
}

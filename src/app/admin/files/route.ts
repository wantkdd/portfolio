import { readFile } from "node:fs/promises";
import path from "node:path";
import { careerAdminEnabled, resolveStoredPath } from "@/lib/career/config";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(request: Request) {
  if (!careerAdminEnabled()) return new Response("Not Found", { status: 404 });
  const stored = new URL(request.url).searchParams.get("path") ?? "";
  const full = resolveStoredPath(stored);
  if (!full) return new Response("Not Found", { status: 404 });
  let data: Buffer;
  try {
    data = await readFile(full);
  } catch {
    return new Response("Not Found", { status: 404 });
  }
  const ext = path.extname(full).toLowerCase();
  const name = encodeURIComponent(path.basename(full));
  const inline = ext !== ".docx";
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": contentTypes[ext] ?? "application/octet-stream",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${name}`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

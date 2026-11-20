"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="copy-wrap">
      <button
        className="copy-button"
        onClick={copy}
        aria-label="이메일 주소 복사"
      >
        {status === "copied" ? <Check size={19} /> : <Copy size={19} />}
      </button>
      <span className="copy-status" role="status">
        {status === "copied"
          ? "이메일을 복사했어요."
          : status === "error"
            ? "주소를 선택해 복사하거나 이메일 링크를 눌러주세요."
            : ""}
      </span>
    </div>
  );
}

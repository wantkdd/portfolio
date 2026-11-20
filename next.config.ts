import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  // next dev 가 AGENTS.md 에 규칙 블록을 덧붙이지 않게 한다. AGENTS.md 는 취업 작업 지침이다.
  agentRules: false,
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85] },
};
export default config;

/** 랜딩과 PDF(/print)가 함께 쓰는 자기소개·경력 정보. */

export const profile = {
  name: "유상완",
  nameEn: "Sangwan Yu",
  title: "Software Developer",
  areas: "Frontend · Backend · AI Agent",
  summary:
    "화면과 서버, AI 에이전트까지. 결과를 끝까지 확인하는 개발자 유상완입니다.",
  site: "https://sangwan-portfolio.vercel.app",
};

export const about = {
  lead: [
    "자동화는 혼자 빨라지는 일이지만,",
    "팀에서는 모두가 따라올 수 있어야 빨라집니다.",
  ],
  paragraphs: [
    "어릴 때 게임 속 번거로운 작업을 줄이려고 매크로를 짜면서 개발을 시작했습니다. 지금도 같은 일을 두 번 하게 되면 자동화부터 생각합니다. 학교 시설 예약을 AI에게 말로 맡기는 MCP 서버를 만든 것도, 매번 같은 화면을 눌러 예약하던 일이 번거로웠기 때문입니다.",
    "하지만 팀에서 내 자동화는 다른 사람에게 새 규칙이 됩니다. WhyLog에서 한 사람이 화면부터 API까지 맡는 방식을 제안했을 때, 처음에는 모두가 낯선 구조에 맞추느라 오히려 느려졌습니다. 그래서 팀 규칙을 문서로 정리하고 그 규칙을 AI 코드 리뷰가 확인하는 CI를 만들었고, 그다음에야 기다리는 시간이 사라졌습니다. 반대로 10명이 짧은 기한 안에 끝내야 했던 PLOG에서는 새 방식을 꺼내지 않고 익숙한 파트별 개발로 기한을 지켰습니다.",
    "UMC에서는 2025년 3월부터 한 기수도 빠지지 않고 활동해 지금은 회장을 맡고 있습니다. 지금은 새로운 방법을 꺼내기 전에 기한과 인원을 먼저 따집니다.",
  ],
};

export type TimelineItem = {
  period: string;
  title: string;
  detail: string;
  link?: { label: string; url: string };
  tags?: string[];
};

export const timeline: TimelineItem[] = [
  {
    period: "2026.09 — 현재",
    title: "UMC 11기 교내 회장",
    detail: "IT 연합 동아리 University MakeUs Challenge",
  },
  {
    period: "2026.03 — 08",
    title: "UMC 10기 교내 부회장 · Web 파트장",
    detail:
      "개인 브랜치 → 주차별 PR → 피드백 반영 → 직접 머지하는 워크북 제출 절차와 폴더 규칙을 문서화했습니다.",
    link: {
      label: "직접 작성한 스터디 운영 가이드",
      url: "https://github.com/HSU-Makeus-Challenge-10th/Web/commit/cf7fee1f5ceef921d36932f9aa3c608e60a92c00",
    },
  },
  {
    period: "2025.03 — 2026.02",
    title: "UMC 8·9기 Web 챌린저",
    detail: "웹 서비스 개발과 팀 프로젝트",
  },
  {
    period: "2021.03 — 2027.02",
    title: "한성대학교 컴퓨터공학부",
    detail: "모바일소프트웨어 · 웹공학 트랙 / 졸업 예정",
    tags: ["학점 4.11 / 4.5", "정보처리기사", "SQLD", "OPIc IM1"],
  },
];

export const award = "2026 한성대학교 AX 프런티어 공모전 장려상";

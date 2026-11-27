import type { imageDimensions } from "@/data/image-dimensions";
export type EvidenceLink = { label: string; url: string };

export const areas = ["frontend", "backend", "ai"] as const;
export type Area = (typeof areas)[number];
export const areaLabels: Record<Area, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI",
};

export type ProjectCase = {
  title: string;
  /** 이 사례가 보여주는 분야. 풀스택 사례는 여러 분야에 함께 넣는다. */
  areas: Area[];
  problem: string;
  solution: string;
  result: string;
  verification?: string;
  limitation?: string;
  links?: EvidenceLink[];
};

export type Project = {
  slug: string;
  name: string;
  period: string;
  role: string;
  tagline: string;
  description: string;
  stack: string[];
  image: string;
  imageAlt: string;
  accent: string;
  highlight: string;
  scope: string;
  repository: { visibility: "public"; url: string } | { visibility: "private" };
  links?: EvidenceLink[];
  cases: ProjectCase[];
  /** 대표 이미지 아래에 보여줄 추가 결과 이미지. */
  figures?: {
    image: keyof typeof imageDimensions;
    alt: string;
    caption: string;
  }[];
  /** 상세 페이지에 넣을 시연 영상 (public/videos). */
  video?: { src: string; poster: string; caption: string };
  benchmark?: {
    context: string;
    caption: string;
    metrics: { label: string; before: string; after: string }[];
    source?: EvidenceLink;
  };
  note?: string;
};
/** 사례에 붙은 분야를 모은다. 카드 표시와 필터의 기준이다. */
export function projectAreas(project: Project): Area[] {
  return areas.filter((area) =>
    project.cases.some((c) => c.areas.includes(area)),
  );
}

export const email = "ryusangwan12@gmail.com";
export const github = "https://github.com/wantkdd";
export const projects: Project[] = [
  {
    slug: "whylog",
    name: "WhyLog",
    period: "2026.01 — 09",
    role: "AI 백엔드 · 기능 단위 풀스택",
    tagline: "코드에 담긴 “왜”를 잇다.",
    description:
      "회의의 의사결정과 코드 변경을 연결합니다. 회의 분석·검색과 기능 단위 개발 구조를 설계했습니다.",
    stack: ["React", "TypeScript", "Spring Boot", "FastAPI", "ChromaDB"],
    image: "/images/whylog.webp",
    imageAlt: "WhyLog 코드 변경의 이유를 기록하는 서비스 랜딩 화면",
    accent: "#eaeafa",
    highlight:
      "로그인·계정 복구·프로필의 화면과 API를 한 PR에서 연결하고, AI 분석의 완료 상태를 나눴습니다.",
    scope:
      "AI 전사 병합과 커밋 분석 파이프라인을 구현했습니다. 이후 로그인·인증·계정 복구·프로필을 웹과 서버에 걸쳐 개발하고, 팀의 공통 규칙과 영역별 CI를 개선했습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/WhyLog-App/WhyLog",
    },
    links: [
      {
        label: "웹·서버 통합 구현 PR #18",
        url: "https://github.com/WhyLog-App/WhyLog/pull/18",
      },
    ],
    cases: [
      {
        title: "화면부터 API까지, 하나의 기능으로",
        areas: ["frontend", "backend"],
        problem:
          "로그인 성공 여부만으로는 이메일 인증 필요, 탈퇴 계정 복구 필요, 정상 로그인 상태를 화면에 정확히 연결할 수 없었습니다. 프로필 변경도 여러 화면의 캐시에 함께 반영해야 했습니다.",
        solution:
          "인증·복구·프로필의 서버 계약과 웹 화면을 같은 PR에서 구현했습니다. 로그인 응답에 따라 다음 화면을 나누고, 로그인·로그아웃 시 토큰과 Query 캐시를 함께 초기화했습니다. 이름·이미지 변경 뒤에는 관련 프로필 캐시를 갱신하고 회의·결정 표시 데이터를 무효화했습니다.",
        result:
          "로그인부터 인증·복구·마이페이지까지 기능 단위 변경을 전달했습니다. PR에 웹·서버의 검토 지점과 미검증 범위를 명시하고, 팀의 공통 기록 규칙과 변경 영역별 CI도 개선했습니다.",
        verification:
          "제가 작성하고 머지한 PR #18에서 web quality, server quality, quality gate의 성공 기록을 확인할 수 있습니다. 웹은 Biome·타입 검사·빌드, 서버는 Gradle clean build 대상입니다. 실제 S3 업로드와 탈퇴·복구 전체 경로의 재검증은 당시 PR에서도 제외했습니다.",
        links: [
          {
            label: "화면·API 변경과 검증 기록 #18",
            url: "https://github.com/WhyLog-App/WhyLog/pull/18",
          },
          {
            label: "해당 변경의 CI 실행",
            url: "https://github.com/WhyLog-App/WhyLog/actions/runs/34174852861",
          },
          {
            label: "공통 CI·개발 규칙 개선 #4",
            url: "https://github.com/WhyLog-App/WhyLog/pull/4",
          },
        ],
      },
      {
        title: "10분 동안, 한 번만 쓰이는 복구 확인값",
        areas: ["backend"],
        problem:
          "탈퇴 유예 중인 계정을 회원 ID만으로 복구하게 두면 안 됐습니다. 복구 요청은 짧은 시간 안에, 한 번만 쓰이는 확인값과 묶여야 했습니다.",
        solution:
          "SecureRandom 32바이트로 챌린지를 만들고, 원문 대신 SHA-256 해시를 회원 ID와 함께 Redis 키로 10분 동안 저장했습니다. 확인할 때는 getAndDelete로 꺼내면서 바로 지워 같은 값을 다시 쓸 수 없게 했습니다. 소비에 성공하면 회원 행을 잠금 조회해 탈퇴 유예 상태인지 다시 확인한 뒤 복구했습니다.",
        result:
          "만료와 재사용을 막는 복구 챌린지 발급·소비 서비스와 복구 명령 서비스를 추가했습니다.",
        verification:
          "제가 작성한 공개 커밋의 두 서비스 파일에서 확인할 수 있습니다. 이 커밋에는 TTL·중복 소비를 검사하는 전용 테스트가 없습니다. 리프레시 토큰의 Redis 저장 구조는 팀원이 만들었습니다.",
        limitation:
          "Redis에서 지우는 동작과 DB 복구는 하나의 트랜잭션이 아닙니다. 복구 중 DB가 실패하면 사용자는 챌린지를 다시 받아야 합니다.",
        links: [
          {
            label: "복구 챌린지 구현 커밋",
            url: "https://github.com/WhyLog-App/WhyLog/commit/fa77c9844758a773d84d4be83ae138cf0285756d",
          },
          {
            label: "발급·소비 코드",
            url: "https://github.com/WhyLog-App/WhyLog/blob/fa77c9844758a773d84d4be83ae138cf0285756d/server/src/main/java/com/whylog/server/domain/user/service/WithdrawalRecoveryChallengeService.java#L18-L47",
          },
        ],
      },
      {
        title: "내 PC의 쿠버네티스에서 일부러 서버를 죽여 보기",
        areas: ["backend"],
        problem:
          "WhyLog 서버가 파드 하나를 잃거나, 새 버전으로 바뀌거나, Redis·MySQL이 재시작될 때 사용자 요청이 어떻게 되는지 확인한 적이 없었습니다.",
        solution:
          "Spring 서버 2개, FastAPI AI 서버, MySQL, Redis를 로컬 kind 클러스터에 올렸습니다. 클러스터 안에서 0.1초마다 마이페이지 API를 호출하면서 서버 파드 강제 종료, 무중단 업데이트, Redis·MySQL 재시작을 차례로 실험했습니다. 서비스 이름 server 때문에 자동 주입된 SERVER_PORT 환경 변수로 Spring이 시작하지 못하는 원인을 로그로 찾아 막았고, 업데이트 중 연결 실패는 종료 전 5초 대기를 넣어 없앴습니다.",
        result:
          "서버 파드를 죽여도 359건이 모두 성공했습니다. 무중단 업데이트의 연결 실패는 896건 중 4건에서, 종료 대기를 넣은 뒤 두 번 모두 0건이 됐습니다. MySQL은 재시작 후 데이터가 남고 서버가 다시 붙었지만, Redis를 재시작하면 리프레시 토큰이 모두 사라진다는 것도 확인했습니다.",
        verification:
          "2026-11-07 로컬 실습입니다. 팀 저장소에는 올리지 않은 제 로컬 브랜치에서 진행했고, 운영 배포 경험이 아닙니다. 종료 대기를 넣기 전 측정은 한 번뿐이라 실패율은 참고용입니다.",
        limitation:
          "서버에 상태 확인 엔드포인트가 없어 쿠버네티스는 포트가 열렸는지만 봅니다. DB나 Redis 연결이 끊겨도 서버를 정상으로 판단합니다.",
      },
      {
        title: "내용과 화자를 하나의 기록으로",
        areas: ["ai"],
        problem:
          "녹음 전사는 내용이 정확하지만 실제 화자를 알 수 없고, 실시간 로그는 화자를 알지만 내용이 누락됐습니다. 두 기록의 시간 기준도 달랐습니다.",
        solution:
          "텍스트를 정규화한 뒤 SequenceMatcher 유사도와 시간·순서 점수를 조합했습니다. 절대시각과 상대시간을 직접 비교하지 않고, 시간 신뢰도가 낮으면 텍스트와 순서의 비중을 높였습니다. 점수가 높은 후보부터 일대일로 연결하고 짧은 로그가 긴 전사 원문을 덮어쓰지 않도록 했습니다.",
        result:
          "전사에 화자 정보를 붙여 Gemini 분석으로 전달하고, 연결되지 않은 발화와 원문을 보존했습니다.",
        verification:
          "제가 작성한 PR #43·#55에서 병합 로직과 회귀 테스트를 함께 추가했습니다. 시간 신뢰도에 따른 가중치, 일대일 연결, 짧은 부분 전사의 원문 덮어쓰기 방지를 코드로 확인할 수 있습니다.",
        limitation:
          "일부 발화 구간의 중복은 남았습니다. 정확도 향상률이나 중복 완전 제거를 입증한 수치는 없습니다.",
        links: [
          {
            label: "병합 기준·회귀 테스트 #55",
            url: "https://github.com/WhyLog-App/Whylog-AI/pull/55",
          },
          {
            label: "시간·텍스트·순서 점수 구현",
            url: "https://github.com/WhyLog-App/Whylog-AI/blob/cd139b09dc4f1d88b500af35cc39984ef714ce2b/app/domains/transcribe/services/live_transcript_merge.py#L218",
          },
        ],
      },
      {
        title: "생성 완료와 검색 준비 완료는 다르다",
        areas: ["ai", "backend"],
        problem:
          "요약 생성 직후 분석 완료로 표시해, 벡터 저장 중인 새 커밋이 검색에서 빠졌습니다.",
        solution:
          "summary_ready와 embedding_ready를 나눠 요약은 먼저 제공하고, ChromaDB 저장 완료를 검색 준비의 기준으로 삼았습니다. 생성한 분석 객체를 임베딩 저장 단계에도 전달해 같은 diff를 다시 분석하지 않도록 했습니다.",
        result:
          "정상 성공 경로에서 커밋당 중복 생성 호출을 2회에서 1회로 줄였습니다. Embedding API 호출은 유지되므로 전체 API 요청이나 비용이 절반이 됐다는 의미는 아닙니다.",
        verification:
          "PR #67에는 추가 생성 호출이 없는지와 Chroma 저장 실패 시 failed 상태를 유지하는지 검사하는 회귀 테스트가 있습니다. PR에 적힌 115개 pytest 통과는 작성 당시 실행 기록이며, 당시 CI는 Ruff·Docker build를 검사했습니다. 별도로 저장된 검색 응답을 비교하는 오프라인 평가 도구도 추가했습니다.",
        limitation:
          "당시 실행 상태 저장소는 메모리 기반이었습니다. 서버 재시작을 견디는 영속 작업 큐까지 구현한 것은 아닙니다.",
        links: [
          {
            label: "분석·검색 준비 상태 분리 #27",
            url: "https://github.com/WhyLog-App/Whylog-AI/pull/27",
          },
          {
            label: "생성 호출 재사용·회귀 테스트 #67",
            url: "https://github.com/WhyLog-App/Whylog-AI/pull/67",
          },
          {
            label: "검색 결과 오프라인 평가 도구 #68",
            url: "https://github.com/WhyLog-App/Whylog-AI/pull/68",
          },
        ],
      },
    ],
  },
  {
    slug: "moamoa",
    name: "MOAMOA",
    period: "2026.02 주요 개선",
    role: "프론트엔드",
    tagline: "작은 실천이 쌓이는 매일.",
    description:
      "출석과 미션으로 목표를 만드는 서비스. 화면의 흐름과 서버의 상태가 일치하도록 다듬었습니다.",
    stack: ["React", "TanStack Query", "Zustand"],
    image: "/images/moamoa.webp",
    imageAlt: "MOAMOA 출석과 목표 달성을 돕는 서비스 소개 화면",
    accent: "#fff2d7",
    highlight:
      "출석·목표 팝업의 실행 순서를 연결하고, 로그인 방식에 따라 남던 계정 캐시를 정리했습니다.",
    scope:
      "출석 확인과 목표 팝업의 순서·큐·확인 API를 연결했습니다. 로그아웃 시 팝업 상태를 초기화하고, 로그인 성공 시 계정 관련 Query를 제거하도록 수정했습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/UMC-9th-MOAMOA/Front-end",
    },
    links: [
      {
        label: "계정 전환 개선 PR #276",
        url: "https://github.com/UMC-9th-MOAMOA/Front-end/pull/276",
      },
    ],
    cases: [
      {
        title: "팝업에도 자연스러운 순서가 필요하다",
        areas: ["frontend"],
        problem:
          "출석과 목표를 따로 조회하면 팝업이 겹치거나 순서가 바뀔 수 있었습니다.",
        solution:
          "출석을 먼저 확인하고, 출석 모달이 있으면 닫힘 콜백에서 목표 조회를 실행했습니다. 목표 큐와 현재 팝업을 나누고, 조회 중이거나 큐가 남아 있으면 중복 조회를 생략했습니다. 정상 경로에서는 goalResultId 확인 API의 성공을 기다린 뒤 다음 팝업으로 이동했습니다.",
        result:
          "출석 → 목표 결과 순서를 화면 흐름으로 연결했습니다. 탭 복귀 시 출석을 다시 확인하고, 로그아웃 시 큐·현재 팝업·실행 참조를 초기화했습니다.",
        verification:
          "제가 작성한 PR #256과 고정 커밋의 초기화·목표 hook에서 실행 순서를 확인할 수 있습니다. PR에는 시연 첨부와 당시 확인 조건이 있습니다. 자동화된 회귀 테스트 결과가 제시된 사례는 아닙니다.",
        limitation:
          "목표 확인 API가 실패하면 현재 팝업과 큐를 비웁니다. 실패 항목을 유지해 재시도하는 흐름은 남은 개선점입니다.",
        links: [
          {
            label: "출석·로그아웃 상태 개선 #256",
            url: "https://github.com/UMC-9th-MOAMOA/Front-end/pull/256",
          },
          {
            label: "목표 큐와 성공·실패 처리",
            url: "https://github.com/UMC-9th-MOAMOA/Front-end/blob/138aec08014e7e5c3a36e37b9cbf2ceebc7607c4/src/hooks/goal/useGoalPopupCheck.ts#L13-L73",
          },
        ],
      },
      {
        title: "새 계정에는 새로운 상태로",
        areas: ["frontend"],
        problem:
          "로컬 로그인은 SPA 이동이어서 이전 계정의 홈·프로필 캐시가 남았습니다. 새로고침을 거치는 소셜 로그인과 달랐고, 전체 Query 캐시를 지우면 마이페이지 렌더링에 영향을 줬습니다.",
        solution:
          "로그인 성공 시 home과 members/me/profile Query만 제거해 공통 캐시는 유지했습니다. 로그아웃 구독에서는 출석 store와 목표 큐·현재 팝업·조회 참조를 각각 초기화했습니다.",
        result:
          "캐시 삭제 범위를 계정 관련 데이터로 좁히고, 이전 사용자 상태가 정상 전환 경로에 남는 문제를 수정했습니다.",
        verification:
          "제가 작성하고 머지한 PR #276에 전체 캐시 삭제를 피한 이유와 계정 전환 시연이 있습니다. 소셜 → 로컬 전환은 당시 PR에서 후속 테스트 대상으로 남겼으므로 모든 전환 조합을 검증했다고 보지는 않습니다.",
        limitation:
          "이미 시작된 이전 계정 요청의 늦은 응답을 차단하는 취소·세션 확인 처리는 추가 검증이 필요합니다.",
        links: [
          {
            label: "선택적 캐시 제거의 이유·변경 #276",
            url: "https://github.com/UMC-9th-MOAMOA/Front-end/pull/276",
          },
          {
            label: "초기화와 로그아웃 구독 코드",
            url: "https://github.com/UMC-9th-MOAMOA/Front-end/blob/138aec08014e7e5c3a36e37b9cbf2ceebc7607c4/src/hooks/useAppInitializer.ts#L17-L69",
          },
        ],
      },
    ],
  },
  {
    slug: "plog",
    name: "PLOG",
    period: "2026.07 — 현재",
    role: "백엔드 · 프론트엔드 지원",
    tagline: "함께한 과정도, 기여가 되도록.",
    description:
      "흩어진 협업 활동을 모아 기여 리포트로. 데이터 수집과 제출 흐름, 조회 성능을 개선했습니다.",
    stack: ["Spring Boot", "PostgreSQL", "React"],
    image: "/images/plog.webp",
    imageAlt: "PLOG 협업 활동 수집과 기여 리포트 서비스 소개 이미지",
    accent: "#e6efff",
    highlight:
      "중복 수집을 DB 제약으로 막고, 평가 저장과 최종 제출의 경계를 서버·화면에 반영했습니다.",
    scope:
      "활동 수집의 중복 방지·상태 갱신과 명시적 최종 제출을 백엔드에서 구현했습니다. 프론트엔드에서도 서버의 제출 상태에 맞춰 버튼·대기 화면을 수정했습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/UMC-Plog/Plog-BE",
    },
    links: [
      {
        label: "최종 제출 백엔드 PR #426",
        url: "https://github.com/UMC-Plog/Plog-BE/pull/426",
      },
      {
        label: "제출 상태 프론트엔드 PR #261",
        url: "https://github.com/UMC-Plog/Plog-FE/pull/261",
      },
    ],
    cases: [
      {
        title: "동시에 수집해도 한 번만 기록",
        areas: ["backend"],
        problem:
          "이벤트 존재 여부를 조회한 뒤 저장하는 방식에서는, 두 수집 요청이 같은 활동을 동시에 새 기록으로 판단할 수 있었습니다.",
        solution:
          "리소스 ID와 제공자 이벤트 키의 유니크 제약에 맞춰 ON CONFLICT DO NOTHING으로 삽입을 원자화했습니다. 삭제 댓글처럼 상태 변경이 가능한 이벤트는 별도 upsert로 처리하고, 재수집 중 확인한 사용자 식별 정보는 기존 행에 보강했습니다.",
        result: "중복 삽입을 막으면서 변경된 기록은 갱신하도록 수정했습니다.",
        verification:
          "제가 작성한 PR #174에서 원자적 삽입 호출과 빈 이벤트 키 무시 테스트를 추가했습니다. 이후에는 같은 키의 행 수 유지·삭제 상태 갱신·사용자 정보 보강을 다루는 PostgreSQL Testcontainers 테스트가 있습니다. Docker가 없으면 건너뛰도록 설정돼 있어 테스트 코드와 실행 성공은 구분합니다.",
        links: [
          {
            label: "중복 방지 구현·단위 테스트",
            url: "https://github.com/UMC-Plog/Plog-BE/commit/ce9d27aa0cab356e428a0a24addc068f7f99160e",
          },
          {
            label: "payload·사용자 정보 갱신 SQL",
            url: "https://github.com/UMC-Plog/Plog-BE/blob/2a308bb25eb7668345a9cab94deda8d65f6b1207/src/main/java/com/plog/domain/integration/repository/IntegrationActivityRepository.java#L18-L104",
          },
        ],
      },
      {
        title: "저장과 최종 제출의 경계",
        areas: ["backend", "frontend"],
        problem:
          "평가를 저장하면 최종 제출로 취급되어 작성 중인 리포트가 발행됐습니다.",
        solution:
          "멤버별 finalSubmittedAt으로 명시적 제출을 관리했습니다. ACTIVE 멤버 전원이 제출하거나 기존 평가 기한이 지나야 완료하도록 바꿨습니다. 프론트엔드의 localStorage 추론과 탭 진입 시 상태 변경을 제거하고 서버 응답으로 버튼·대기 화면을 복원했습니다.",
        result:
          "작성 저장 상태가 유지되고, 버튼과 대기 화면이 서버의 제출 상태를 따르도록 개선했습니다.",
        verification:
          "제가 작성한 BE #426·FE #261의 변경입니다. 평가 미완료 제출 거절, 다른 멤버 대기, 전원 제출, 중복 제출, 타임아웃의 서버 회귀 테스트와 당시 Gradle build CI 성공 기록이 있습니다. 실제 백엔드와 연결한 프론트 E2E는 해당 변경에서 실행하지 않았다고 기록했습니다.",
        links: [
          {
            label: "제출 경계와 회귀 테스트",
            url: "https://github.com/UMC-Plog/Plog-BE/commit/25c90640d2edeb0479f44496bb5f0da912653fe4",
          },
          {
            label: "서버 상태를 따르는 화면 변경",
            url: "https://github.com/UMC-Plog/Plog-FE/commit/b52eec2918067764859619d14f69a7ed4d73c078",
          },
          {
            label: "당시 백엔드 CI 실행",
            url: "https://github.com/UMC-Plog/Plog-BE/actions/runs/31603522842",
          },
        ],
      },
      {
        title: "10만 건의 이력에서 최신 한 건 찾기",
        areas: ["backend"],
        problem:
          "원본 포트폴리오의 로컬 실험에서는 프로젝트 100개·수집 이력 10만 건에서 최신 작업 조회가 최대 99,000행을 탐색했습니다. 500 RPS 기준선의 한 실행에서 DB 실행시간의 89%를 차지했습니다.",
        solution:
          "로컬 실험에서 (project_id, integration_collection_job_id DESC) 복합 인덱스를 추가하고 제거·복원 비교를 진행했습니다. 요청당 SELECT 6개와 API 응답·권한을 유지한 조건에서 부하별 전후 측정을 기록했습니다.",
        result:
          "PDF에 기록한 500 RPS 측정 중앙값은 p95 1,811.90ms → 8.58ms, 실제 처리량 264.02 → 499.99 RPS입니다. 당시 기록에는 회귀 테스트 65개 통과가 포함돼 있습니다.",
        verification:
          "원본 포트폴리오에 조건과 결과를 기록한 당시 로컬 합성 데이터 측정입니다. 위 공개 PR의 CI 결과와는 별개이며, 재현용 인덱스 SQL·부하 스크립트·원시 실행 로그의 공개 링크는 현재 제공하지 않습니다.",
      },
    ],
    benchmark: {
      caption: "로컬 합성 데이터 · 목표 부하 500 RPS · 전후 각 3회 측정 중앙값",
      context:
        "원본 포트폴리오에 기록한 로컬 실험입니다. 프로젝트 100개·수집 이력 10만 건에서 요청당 SELECT 6개를 유지했습니다. 완료 요청의 HTTP 오류율은 전후 0%로 기록됐습니다.",
      metrics: [
        { label: "실제 처리량", before: "264.02 RPS", after: "499.99 RPS" },
        { label: "응답 p95", before: "1,811.90 ms", after: "8.58 ms" },
        { label: "실행 누락", before: "6,840건", after: "0건" },
        { label: "DB 시간 / 요청", before: "25.690 ms", after: "0.902 ms" },
      ],
      source: {
        label: "측정 조건이 기록된 원본 포트폴리오 쪽 (2026-09)",
        url: "/evidence/plog-benchmark-2026-09.pdf",
      },
    },
    note: "성능 수치는 프로젝트 100개·수집 이력 10만 건의 로컬 합성 데이터 결과입니다. 25·100·200·500 RPS에서 전후 각 3회, 30초 측정했습니다. 개선 후 500 RPS p95는 3.51~70.46ms로 변동했고, 100 RPS의 한 실행에서는 지연이 증가했습니다. 운영 성능이나 최대 처리량을 보장하지 않습니다.",
  },
  {
    slug: "moa",
    name: "MOA",
    period: "2026.05 — 06",
    role: "프론트엔드 · 백엔드 (인기 랭킹·배포)",
    tagline: "좋은 아이디어가, 좋은 팀을 만나도록.",
    description:
      "프로젝트 탐색부터 팀 참여까지. Next.js 화면과 Spring Boot 대시보드 API를 함께 만들었습니다.",
    stack: ["Next.js", "TypeScript", "TanStack Query", "Spring Boot", "Redis"],
    image: "/images/moa.webp",
    imageAlt: "MOA 프로젝트 탐색 웹사이트 원본 화면",
    accent: "#e3f2f2",
    highlight:
      "SSR 인증 뒤의 빈 대시보드를 복구하고, Redis 일간 인기 랭킹과 장애 시 DB 대체 경로를 만들었습니다.",
    scope:
      "프로필 조회·설정 화면과 인증 흐름을 구현했습니다. 백엔드에서는 메인 대시보드 API의 Redis 일간 인기 랭킹을 만들고, 이미지 업로드 500 오류의 배포 원인을 찾아 수정했습니다.",
    repository: { visibility: "private" },
    cases: [
      {
        title: "로그인했는데 비어 있는 대시보드",
        areas: ["frontend"],
        problem:
          "SSR 서버에서는 백엔드 도메인의 갱신 쿠키를 사용할 수 없었습니다. 인증 조회 실패가 빈 목록으로 내려오고 브라우저에서도 갱신되지 않아, 참여 중인 프로젝트가 없는 것처럼 보였습니다.",
        solution:
          "SSR의 빈 목록을 최종 결과로 확정하지 않고, 마운트 후 브라우저에서 인증을 거쳐 대시보드를 다시 조회했습니다. 성공하면 프로젝트와 보낸 신청·받은 신청 목록을 함께 갱신하고, 재조회 실패 시에는 기존 화면을 유지했습니다.",
        result:
          "SSR 인증 조회에 실패해도 사용자의 프로젝트와 신청 목록을 정상적으로 불러오도록 수정했습니다.",
        verification:
          "당시 CI validate가 통과했고, 회귀 테스트로 서버의 빈 목록을 모킹한 브라우저 조회 결과로 복구하는 동작을 검사했습니다. 실제 배포 환경의 쿠키 도메인 문제를 재현한 통합 테스트와는 구분합니다. 구현·CI 기록은 비공개 저장소에 있습니다.",
      },
      {
        title: "토큰 수명과 로그인 세션 분리",
        areas: ["frontend"],
        problem:
          "액세스 토큰이 만료될 때 갱신 세션까지 삭제되어 로그인이 풀렸습니다.",
        solution:
          "액세스 토큰만 제거하는 처리와 전체 인증 상태를 정리하는 처리를 나눴습니다. 갱신 가능한 상태라면 요청 전에 토큰을 재발급하고, 새 인증 헤더로 API를 호출하도록 수정했습니다.",
        result:
          "짧은 액세스 토큰 수명 때문에 갱신 가능한 로그인까지 종료되던 문제를 수정했습니다.",
        verification:
          "만료 토큰 → 재발급 → 새 인증 헤더를 검사하는 회귀 테스트와 당시 CI 성공 기록을 비공개 저장소에 남겼습니다. 만료 토큰을 직접 넣어 재발급·사용자 조회를 확인한 브라우저 검사도 기록했습니다. 실 API 인증 차단 검사는 별도 보고 항목이었습니다.",
      },
      {
        title: "조회와 저장 사이, 사라지지 않는 정보",
        areas: ["frontend"],
        problem:
          "서버 응답과 폼의 데이터 형태가 달라 스킬·경력·소셜 링크가 누락됐습니다.",
        solution:
          "조회 응답을 폼 초기값으로 바꾸는 경계와, 입력값을 수정 요청으로 바꾸는 경계를 분리했습니다. 스킬·관심 분야 ID·소셜 링크를 보존하고, 연락 시간은 HH:mm으로, 진행 중 경력의 종료일은 null로 변환했습니다.",
        result:
          "자기소개를 수정한 뒤 다시 조회해 저장값과 일치하는지 검증했습니다.",
        verification:
          "DTO 양방향 매핑, nullable 값, 연락 시간, 진행 중 경력의 종료일을 다루는 테스트를 비공개 저장소에 남겼고, 관련 PR의 CI validate가 통과했습니다. 자기소개 저장 후 재조회는 원본 포트폴리오에 기록한 수동 확인 범위입니다.",
      },
      {
        title: "오늘의 인기 프로젝트, 한 사람은 한 번만",
        areas: ["backend"],
        problem:
          "메인 대시보드에 오늘 많이 본 프로젝트를 보여줘야 했습니다. 같은 사람이 새로고침할 때마다 조회수가 오르면 안 되고, 비공개 프로젝트는 순위에 나오지 않아야 했습니다.",
        solution:
          "날짜별 Redis ZSET에 조회수를 쌓고 높은 순으로 꺼냈습니다. 날짜·프로젝트·회원을 묶은 키를 setIfAbsent로 먼저 기록해 같은 날 같은 회원의 조회는 한 번만 셌습니다. 키는 2일 뒤 만료됩니다. 순위 후보는 공개·모집 중·진행 중인 프로젝트만 남기고, Redis가 실패하거나 후보가 모자라면 DB의 최신 공개 프로젝트로 채웠습니다.",
        result:
          "일간 인기 프로젝트와 기존 매칭 추천을 함께 내려주는 대시보드 API를 병합했습니다. 프로젝트 상세 응답에도 오늘 조회수를 넣었습니다.",
        verification:
          "제가 작성하고 병합된 PR입니다. PR에 기존 테스트 통과를 체크했고 승인 리뷰를 받았지만, 랭킹·중복 방지·대체 경로를 위한 전용 테스트는 추가하지 않았습니다. 비공개 저장소라 코드는 면접에서 설명합니다.",
        limitation:
          "Redis 장애 때는 인기순을 다시 계산하지 않고 최신 공개 프로젝트를 보여줍니다. 당시 회원 식별은 임시 헤더를 썼고, 로그인하지 않은 조회는 중복을 막지 않습니다.",
      },
      {
        title: "호스트에서는 되고, 컨테이너에서는 안 되는 업로드",
        areas: ["backend"],
        problem:
          "개발 서버에서 프로필·프로젝트 이미지 업로드가 500을 반환했습니다. EC2 호스트에서는 IAM 역할을 읽었지만, 브리지 네트워크의 앱 컨테이너에서는 메타데이터 서버(IMDS) 조회가 시간 초과됐습니다.",
        solution:
          "같은 이미지를 호스트·브리지·호스트 네트워크에서 비교해 원인을 자격증명 조회 경로로 좁혔습니다. 앱 컨테이너를 호스트 네트워크로 바꾸되 Spring은 127.0.0.1에만 열어 공인 IP의 8080 직접 접근을 막았습니다. Redis도 호스트 내부 주소에만 열고, 배포 스크립트에서 포트를 점유하던 이전 Redis 컨테이너를 정리했습니다.",
        result:
          "컨테이너 안의 앱이 인스턴스 역할로 S3 자격증명을 읽도록 dev·prod 배포 설정을 함께 고쳤습니다.",
        verification:
          "PR에 Gradle 테스트·빌드, dev·prod Compose 설정 렌더링, EC2에서 네트워크 모드별로 자격증명을 비교한 기록을 남겼습니다. 수정 후 업로드 API를 다시 호출한 응답은 PR에 남기지 않았습니다.",
      },
    ],
  },
  {
    slug: "image-to-cad",
    name: "2D Image To CAD",
    period: "2026.09 — 12",
    role: "산학공동연구 · 벡터화 규칙 설계",
    tagline: "캡처 한 장을, 고칠 수 있는 도면으로.",
    description:
      "협력기업 (주)픽셀부스트의 도면 캡처 이미지를 편집 가능한 CAD(DXF)로 바꾸는 규칙 기반 파이프라인을 개선했습니다. 학생 3명 중 선·화살촉·치수를 CAD 요소로 해석하는 벡터화 규칙 설계를 맡았습니다.",
    stack: ["Python", "OpenCV", "NumPy", "ezdxf", "Codex · Claude"],
    image: "/images/image-to-cad.webp",
    imageAlt:
      "협력기업 평가 도면의 CAD 화면 캡처 입력과, 파이프라인이 만든 편집 가능한 DXF 출력 비교. 치수 67.8·57.6·51.6·35.1·R6.5가 치수 객체로 복원됨",
    accent: "#eef3f7",
    highlight:
      "오차를 유형별로 나눠 벡터화 규칙을 설계하고, 병합 MR 22건으로 보조선 끝점 일치 263→277개, 1mm 넘게 어긋난 꼭짓점 72→38개, 10px/mm 치수 인식 0→173개(190개 중)를 만들었습니다.",
    scope:
      "벡터화 단계의 보조선 끝점 규칙, 교차·중심선 잔해 제거, 해상도 비례 상수, 화살촉 꼬리 축 보정, 사선 화살촉 폴백을 설계·구현했습니다. 병합 MR 22건이 기업 멘토의 재현 검토를 거쳤습니다. 초기 OCR+측정 파이프라인과 품질 게이트는 기업 멘토가, CAD 치수 객체 저장·채점과 입력 변형 실험은 팀원이 만들었습니다.",
    repository: { visibility: "private" },
    figures: [
      {
        image: "image-to-cad-2",
        alt: "단차가 있는 부품 도면의 캡처 입력과 DXF 출력. 63.5·51.4·35·31.4·39.6·13·8 치수가 객체로 복원됨",
        caption:
          "직선과 단차가 많은 도면. 가로·세로 치수 7개가 모두 치수 객체로 복원됐습니다.",
      },
      {
        image: "image-to-cad-3",
        alt: "곡면과 반경이 있는 부품 도면의 캡처 입력과 DXF 출력. 1.9는 치수가 아닌 글자로 남음",
        caption:
          "곡면과 반경이 있는 도면. R6 반경은 복원했지만, 1.9 치수는 치수선과 연결되지 못하고 글자로 남았습니다.",
      },
    ],
    cases: [
      {
        title: "틀린 끝점을 고치는 규칙 설계",
        areas: ["ai"],
        problem:
          "캡처 이미지에는 선의 시작과 끝 정보가 없어서, 보조선이 어디서 멈추는지 픽셀만 보고 정해야 했습니다. 오차를 멘토와 함께 분류해 보니 이미 맞는 끝점의 정밀도보다, 보조선이 일찍 멈추거나(51건) 너무 길게 뻗는(28건) 틀린 끝점이 결과를 크게 흔들고 있었습니다.",
        solution:
          "틀린 끝점이 생기는 모양을 유형별로 나누고, 유형마다 규칙을 따로 설계했습니다. 닫힌 윤곽, 원색 선의 접속, 짝을 이루는 보조선, 흰 영역에 가린 선, 공유 축, 짧은 공백 접합, 대각 모서리 같은 경우마다 끝점을 정하는 규칙 10개입니다. 규칙 하나가 실제로 바꾸는 입력이 하나만 있도록 변경을 쪼개, 어느 규칙이 어떤 도면을 바꿨는지 추적할 수 있게 했습니다.",
        result:
          "공식 31장에서 보조선 끝점 일치가 263/338개에서 끝점 규칙으로 275/338개, 화살촉 꼬리 축 보정 후 277/340개가 됐습니다. 교차점·중심선에 남는 가짜 선을 지우는 규칙까지 더해, 1mm 넘게 어긋난 꼭짓점이 처음 72개에서 38개로 줄었습니다. 이 중 60→38 구간이 제 MR 4건(!41·!42·!44·!45)입니다.",
        verification:
          "변경마다 기본 31장, 해상도 4종, 실제 캡처 2장, 수동 입력 3경로를 합친 160개 조건의 출력을 기존 결과와 비교하고, 좋아진 도면과 나빠진 도면을 함께 기록했습니다. 기업 멘토가 같은 조건으로 재현해 수치가 일치한 뒤 병합했습니다.",
        limitation:
          "형상 겹침 지표(IoU)는 88.7%로 바뀌지 않았습니다. 이번 개선은 끝점과 꼭짓점 위치에 한정됩니다.",
      },
      {
        title: "해상도에 묶이지 않는 규칙",
        areas: ["ai"],
        problem:
          "규칙의 기준값이 픽셀 단위로 고정돼 있었습니다. 같은 도면이라도 10px/mm처럼 해상도가 높은 캡처에서는 화살촉과 치수선을 찾지 못해, 공식 평가의 치수 190개를 하나도 인식하지 못했습니다.",
        solution:
          "흩어져 있던 벡터화 상수 81개를 단위별로 정리하고, 길이 기준은 1mm에 해당하는 픽셀 수에 비례하도록 바꿨습니다. 입력 해상도를 지정하는 옵션을 추가하되, 기본 해상도에서는 기존 출력이 바이트 단위로 같도록 유지해 기존 결과를 흔들지 않았습니다.",
        result:
          "변경 직후 연습 21장의 10px/mm 치수 인식이 0/127에서 82/127이 됐습니다. 이후 화살촉 꼬리를 정확한 축으로 잇는 변경까지 더해, 공식 31장을 모두 10px/mm로 렌더했을 때 치수 190개 중 173개(약 91%)를 맞혔습니다.",
        verification:
          "160개 조건 비교와 기업 멘토의 재현 검토를 거쳐 병합했습니다. 화살촉 꼬리 축 보정은 멘토가 이슈에서 제안한 방법을 제가 구현한 것입니다.",
        limitation:
          "고해상도 치수 17개는 아직 인식하지 못합니다. 일부 도면은 이 변경으로 나빠졌고(10px/mm cell25의 경사선 소실), 변경 기록에 공개했습니다.",
      },
      {
        title: "좋아 보여도, 나빠진 도면이 있으면 넣지 않는다",
        areas: ["ai"],
        problem:
          "반경 치수의 지시선이 짧으면 반경 치수로 분류되지 않았습니다. 원호의 R 값을 더 정확히 맞추는 방법도 함께 검토해야 했습니다.",
        solution:
          "짧은 반경 지시선을 알아보는 규칙을 추가했습니다. 함께 시험한 'R 값을 표기값에 고정해 원호를 다시 맞추는' 규칙은 일부 도면을 오히려 나쁘게 만드는 사례를 확인하고, 멘토와 합의해 채택하지 않았습니다.",
        result:
          "짧은 지시선 인식으로 반경 치수 분류가 깨지던 9개 조건을 복원했습니다. 미채택 규칙은 실험 근거와 함께 기록으로 남겼습니다.",
        verification:
          "채택과 미채택 모두 같은 160개 조건 비교를 근거로 판단했습니다.",
      },
      {
        title: "코딩 에이전트로 규칙 실험을 운영하기",
        areas: ["ai"],
        problem:
          "규칙 여러 개를 한 번에 바꾸면 어떤 규칙이 좋아지게 했고 어떤 규칙이 망가뜨렸는지 가릴 수 없었습니다. 세 명이 같은 파일을 고치면서 서로의 기여가 섞일 위험도 있었습니다.",
        solution:
          "Codex가 실험을 조정하고 Claude가 독립적으로 리뷰하도록 역할을 나눴습니다. 정답 데이터와 평가기는 수정하지 않는다는 규칙을 두고, 가설마다 실험 세션을 따로 띄워 결과와 실패 사례를 기록했습니다.",
        result:
          "제 변경 요청 22건이 모두 재현 검토를 거쳐 병합됐고, 규칙별 설계 근거와 기각한 후보의 이유가 남았습니다.",
        verification:
          "AI 에이전트 제품을 만든 경험이 아니라, 코딩 에이전트로 연구 과정을 운영한 경험입니다. 저장소와 변경 기록은 기업 비공개라 링크하지 않습니다.",
      },
    ],
    benchmark: {
      context:
        "협력기업 원본 도면에서 렌더한 공식 31장 평가셋(연습 21·시험 10)에서 같은 평가기로 잰 수치입니다. 꼭짓점 오차의 분모(출력 점 수)는 3,519개에서 3,485개로 바뀌었고, 형상 겹침(IoU)은 88.7%로 그대로입니다. 팀 최종 포스터의 '치수 위치 67%→100%'는 실제 캡처 2장 기준이라 이 표에 넣지 않았습니다.",
      caption: "공식 31장 평가셋 · 10월 초 기준선 대비 11/17 병합본 · 기업 멘토 재현",
      metrics: [
        { label: "보조선 끝점 일치", before: "263 / 338", after: "277 / 340" },
        { label: "1mm 넘게 어긋난 꼭짓점", before: "72개", after: "38개" },
        {
          label: "10px/mm 입력 치수 인식",
          before: "0 / 190",
          after: "173 / 190",
        },
      ],
    },
    note: "협력기업 인터뷰에서는 도면 한 장을 사람이 다시 그리는 데 5~7일이 걸리고, 일주일에 약 50장이 들어온다고 들었습니다. 도면 이미지는 협력기업의 허락을 받아 실은 공식 평가 도면과, 팀 전체 변경이 반영된 최신 파이프라인의 출력입니다. 소스 코드는 싣지 않았습니다.",
  },
  {
    slug: "sightline",
    name: "Sightline",
    period: "2026.09 — 12",
    role: "AI · 데이터셋 구축과 LoRA 학습 · 수업 팀 프로젝트",
    tagline: "인터넷이 끊겨도, “살려주세요”는 먼저 닿도록.",
    description:
      "시설 관리자용 대화형 AI 관제 서비스. 현장에서 구조를 요청하는 말을 보드가 직접 알아듣는 온디바이스 AI 수업 팀 프로젝트에서, 음성 명령 모델의 데이터셋과 LoRA 파인튜닝을 맡았습니다.",
    stack: ["Llama 3.2 1B", "LoRA", "Colab T4", "QCS6490 NPU", "Python"],
    image: "/images/sightline.webp",
    imageAlt:
      "Sightline 발표 표지. 시설 관리업체용 대화형 AI 관제 서비스와 앱 화면",
    accent: "#e8effc",
    highlight:
      "학습 데이터를 직접 설계해 Llama 3.2 1B를 LoRA로 파인튜닝했습니다. 구조 요청 기능 정확도 26.0%→98.4%, 정확 일치 6.1%→78.7%.",
    scope:
      "5명 팀(PM 겸 프론트엔드 1, 프론트엔드 1, 백엔드 3)의 백엔드 소속으로 AI를 맡았습니다. 중간발표의 관리자 음성 조회 모델과 최종 구조 요청 모델의 데이터셋을 AI 도구로 생성·검수하고, Colab에서 LoRA 학습·평가와 병합까지 진행했습니다. 양자화·보드 변환은 마음AI가, 앱·서버·보드 연동은 팀원이 맡았습니다.",
    repository: { visibility: "private" },
    video: {
      src: "/videos/sightline-demo.mp4",
      poster: "/videos/sightline-demo-poster.jpg",
      caption:
        "팀 시연 영상. 카메라 감지와 낙상 후보 알림, 근거 장면 확인, 조치 기록까지의 흐름입니다.",
    },
    figures: [
      {
        image: "sightline-2",
        alt: "구조 요청 모델의 학습 전·LoRA·병합본 정확도와 보드 양자화 후 정확도 79.41%를 정리한 발표 슬라이드",
        caption:
          "최종 발표 슬라이드. 학습 전 기본 모델, LoRA, 병합본을 같은 평가셋으로 비교했습니다.",
      },
      {
        image: "sightline-3",
        alt: "클라우드 AI와 온디바이스 AI의 처리 흐름을 비교한 발표 슬라이드",
        caption:
          "인터넷 없이 보드 안에서 음성 인식·분류·안내까지 처리하는 구조입니다.",
      },
    ],
    cases: [
      {
        title: "같은 위급 상황, 수십 가지 말투",
        areas: ["ai"],
        problem:
          "현장에서는 같은 구조 요청도 사람마다 다르게 말합니다. 반대로 “불이야”와 “불 좀 꺼 줘”처럼 비슷하지만 위급하지 않은 말까지 알림으로 보내면 관리자가 경보를 믿지 않게 됩니다. 학습 전 기본 모델은 기능을 26%만 맞혔습니다.",
        solution:
          "출력을 구조 요청·요청 취소·해당 없음 세 기능과 상황(넘어짐·출혈·끼임·화재·호흡 이상), 대상(본인·타인) 인자로 좁혔습니다. 상황절·외침·취소·일상 대화 문구를 조합해 학습 2,020문장을 만들고, 학습에 쓰지 않은 표현으로 일반 평가 442문장과 헷갈리는 표현 쌍 30개를 따로 만들었습니다. 음성 인식 오류 형태와 띄어쓰기 변형도 섞고, 중복과 평가셋 누수를 자동으로 검사했습니다.",
        result:
          "일반 평가에서 기능 정확도 26.0%→98.4%, 기능·인자·형식이 모두 맞는 정확 일치 6.1%→78.7%, 헷갈리는 표현 쌍 10.0%→86.7%가 됐습니다.",
        verification:
          "학습 전 모델, LoRA 어댑터, 병합본에 같은 평가셋을 샘플링 없이 넣어 채점했고, 병합본이 어댑터와 같은 점수인지 다시 확인했습니다. 데이터와 학습 노트북은 팀 저장소 밖에서 관리해 공개 링크가 없습니다.",
        limitation:
          "오답 98건 중 본인·타인 혼동이 22건, 넘어짐을 호흡 이상으로 고른 것이 11건이었습니다. 실제 사람 녹음으로 만든 평가는 후속 과제로 남았습니다.",
      },
      {
        title: "보드 위에서, 실제로 말해 보기",
        areas: ["ai"],
        problem:
          "Colab의 텍스트 점수가 좋아도, 보드의 마이크로 들은 말을 NPU에서 분류해야 실제로 쓸 수 있습니다. 1B 모델을 문장마다 새로 올리면 한 문장에 약 10초가 걸렸습니다.",
        solution:
          "LoRA 가중치와 새로 추가한 기능 토큰의 임베딩을 기본 모델에 병합해 넘기고, 마음AI의 W8A16 양자화와 QCS6490 NPU 변환을 거쳤습니다. 팀은 모델을 한 번만 올려 두고 문장마다 대화 상태만 비우는 상주 실행으로 바꿨습니다.",
        result:
          "NPU 분류가 문장당 약 10초에서 0.5~1.6초로 줄었습니다. 보드 스피커로 말하고 보드 마이크로 듣는 종단 시험 최종 회차에서 기능 정확도 83.3%(12문장 중 10문장), 위급하지 않은 말과 주변 대화의 오경보 0건이었습니다.",
        verification:
          "양자화 후 텍스트 정확도 79.41%는 마음AI 측정값입니다. 보드 상주 실행과 종단 시험은 팀 작업이고, 종단 시험은 5회 중 회차별 정확도가 50~83.3%로 흔들렸습니다.",
        limitation:
          "목표로 잡은 보드 기능 정확도 95%에는 못 미쳤습니다. 구조 요청 8문장 중 2문장은 말 구간을 잡지 못해 놓쳤고, 장시간 실행과 메모리·전력 측정은 하지 못했습니다.",
      },
    ],
    benchmark: {
      context:
        "학습에 쓰지 않은 일반 평가 442문장과 헷갈리는 표현 쌍 30개로, 학습 전 기본 모델과 LoRA 병합본을 같은 조건에서 채점했습니다 (Colab T4, 샘플링 없음).",
      caption:
        "구조 요청 모델 · Llama 3.2 1B · LoRA r16 · 학습 2,020문장 + 띄어쓰기 변형 503문장 · 2 epochs",
      metrics: [
        { label: "기능 정확도 (442)", before: "26.0%", after: "98.4%" },
        { label: "인자 정확도 (442)", before: "12.2%", after: "86.0%" },
        { label: "정확 일치 (442)", before: "6.1%", after: "78.7%" },
        {
          label: "헷갈리는 표현 쌍 정확 일치 (30)",
          before: "10.0%",
          after: "86.7%",
        },
      ],
    },
    note: "중간발표에서는 같은 방식으로 관리자 음성 조회 7개 기능 모델을 학습해, 학습에 쓰지 않은 464문장 정확도를 0.6%에서 96.6%로 올렸습니다. 양자화와 보드용 변환은 협력사 마음AI가 했고, 저장소는 비공개입니다.",
  },
  {
    slug: "ax-frontier",
    name: "AX-frontier",
    period: "2026.04 — 06",
    role: "문서 검토 에이전트 · AI·서버·화면 연결",
    tagline: "학교 일을, 한 번의 질문으로.",
    description:
      "학교 정보·도서 검색·전자결재 문서 검토를 하나의 대화로 연결한 교내 AI 서비스. 3명이 만들어 교내 AX 프런티어 공모전 장려상을 받았습니다.",
    stack: ["FastAPI", "Spring Boot", "React", "pgvector", "SSE"],
    image: "/images/ax-frontier.webp",
    imageAlt:
      "AX-frontier 대표 이미지. 문서와 확인 표시가 담긴 말풍선 로고, 학교 정보·도서 검색·전자결재 검토",
    accent: "#e8f1fb",
    highlight:
      "전자결재 문서 검토 에이전트를 만들고, 근거가 서로 맞을 때만 금액을 고치도록 자동 수정 범위를 좁혔습니다.",
    scope:
      "AI·서버·화면 저장소에 제가 작성한 PR 38건이 병합됐습니다. 문서 검토 에이전트와 검토 작업 공간, 공지·학술정보관 수집과 증분 적재, 세 계층의 SSE 연결을 맡았습니다. 학교 정보 RAG와 도서 검색 에이전트는 팀원이 만들었습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/AX-frontier/AI",
    },
    links: [
      { label: "화면 저장소", url: "https://github.com/AX-frontier/FE" },
      { label: "서버 저장소", url: "https://github.com/AX-frontier/BE" },
    ],
    cases: [
      {
        title: "근거가 맞을 때만 고치는 금액",
        areas: ["ai"],
        problem:
          "본문의 정산 금액과 표의 숫자가 다를 때, 표 하나만 보고 본문을 고치면 모순된 자료를 그대로 옮길 수 있었습니다. 한글 웹 편집기에서 복사한 금액은 여러 태그로 쪼개져 HTML 수정이 빠지기도 했습니다.",
        solution:
          "날짜·금액·항목 번호·붙임 표기 같은 형식은 규칙으로 먼저 검사하고, 매뉴얼 기반 LLM 검토는 규칙이 놓친 '직접 확인 필요' 항목만 덧붙이게 했습니다. 금액은 상세내역 표의 항목 합과 합계 행이 맞고, 소요예산 표도 같은 금액을 뒷받침할 때만 본문 수정안을 만들었습니다. 데이터 표 안의 값은 건드리지 않았습니다.",
        result:
          "예산 표가 없거나 근거가 서로 어긋나면 본문 금액을 자동으로 바꾸지 않는 검토 정책과 회귀 테스트를 병합했습니다.",
        verification:
          "PR #33 본문에 Claude 교차 검토 결과를 반영했다고 적었고, PR #39에는 문서 검토 테스트 40개 통과 로그를 남겼습니다. 실제 행정 업무의 오류 감소율은 측정하지 않았습니다.",
        links: [
          {
            label: "문서 검토 에이전트 #17",
            url: "https://github.com/AX-frontier/AI/pull/17",
          },
          {
            label: "금액 자동 수정 조건 #33",
            url: "https://github.com/AX-frontier/AI/pull/33",
          },
          {
            label: "금액·표 회귀 테스트",
            url: "https://github.com/AX-frontier/AI/blob/develop/agents/document_review/tests/test_document_review_agent.py#L1019-L1159",
          },
        ],
      },
      {
        title: "답변이 아니라, 고칠 수 있는 문서로",
        areas: ["ai", "backend", "frontend"],
        problem:
          "채팅 답변만으로는 원문과 수정안, 사람이 확인해야 할 항목, 표의 수정 위치를 구분하기 어려웠습니다. 지난 대화를 다시 열면 검토 결과도 그대로 보여야 했습니다.",
        solution:
          "문서 검토 요청이 들어오면 문서 입력 화면으로 전환하고, 붙여 넣은 본문과 표를 검토해 자동 수정과 직접 확인 항목을 나눠 돌려주는 API를 만들었습니다. 서버는 검토·표 정보를 응답과 함께 저장하고, 화면은 이를 전후 비교로 다시 그리게 연결했습니다.",
        result:
          "자연어 요청에서 문서 입력으로 넘어가 수정안을 확인하고, 지난 대화의 검토 결과를 다시 볼 수 있게 했습니다.",
        verification:
          "AI·서버·화면 PR을 각각 작성해 병합했습니다. 한글 문서의 모든 서식 호환을 보장하지는 않으며, 글꼴·줄 간격처럼 복사한 텍스트로 판단할 수 없는 항목은 검토 범위에서 뺐습니다.",
        links: [
          {
            label: "검토 작업 공간 FE #3",
            url: "https://github.com/AX-frontier/FE/pull/3",
          },
          {
            label: "검토 결과 저장 BE #20",
            url: "https://github.com/AX-frontier/BE/pull/20",
          },
          {
            label: "자동화 범위 문서",
            url: "https://github.com/AX-frontier/AI/blob/develop/agents/document_review/MANUAL_COVERAGE.md",
          },
        ],
      },
      {
        title: "에이전트를 고르기 전의 기다림 줄이기",
        areas: ["ai", "backend"],
        problem:
          "어떤 에이전트로 보낼지 정하기 전에 학교 정보와 도서 검색 근거를 차례로 모으면 지연이 쌓였습니다. 문서 검토가 분명한 요청에도 불필요한 검색을 했습니다.",
        solution:
          "근거 수집을 병렬로 실행하고, 문서 검토 점수가 0.85 이상이면 다른 검색을 건너뛰게 했습니다. AI 서버의 routing·chunk·done 이벤트를 Spring 서버가 SSE로 중계하고 화면이 받아 그리도록 세 계층을 연결했습니다.",
        result:
          "라우팅 병렬화와 빠른 경로, 세 계층의 SSE 전송 구조를 병합했습니다.",
        verification:
          "PR에는 라우팅 시간이 줄었다고 적었지만 전후 측정 기록을 남기지 않아 수치는 쓰지 않습니다.",
        limitation:
          "현재 일반 질문 경로는 모델 출력을 모은 뒤 완성된 답변을 한 번에 보냅니다. 글자 단위 실시간 표시는 되지 않습니다.",
        links: [
          {
            label: "SSE·라우팅 병렬화 AI #22",
            url: "https://github.com/AX-frontier/AI/pull/22",
          },
          {
            label: "SSE 중계 BE #16",
            url: "https://github.com/AX-frontier/BE/pull/16",
          },
          {
            label: "스트리밍 화면 FE #4",
            url: "https://github.com/AX-frontier/FE/pull/4",
          },
        ],
      },
    ],
  },
  {
    slug: "hsu-reserve",
    name: "HSU Reserve",
    period: "2026.11",
    role: "개인 프로젝트 · 설계와 구현",
    tagline: "말로 하는 시설 예약.",
    description:
      "AI 앱에서 학교 시설의 빈자리 조회·예약·취소를 할 수 있게 만든 MCP 서버. 제가 직접 쓰고 있고, 친구 3명에게도 공유했습니다.",
    stack: ["Python", "MCP", "HTTPX", "BeautifulSoup", "keyring"],
    image: "/images/hsu-reserve.webp",
    imageAlt:
      "HSU Reserve 대표 이미지. 확인 표시가 있는 달력 로고와 2시~4시 말풍선, 빈자리·예약·취소·MCP",
    accent: "#e9f4ef",
    highlight:
      "학교 서버가 신청을 실제로 받아들였는지 다시 조회한 뒤에만 '예약됐다'고 답하게 했습니다.",
    scope:
      "학교 예약 웹의 로그인·조회·신청 흐름을 HTTP로 재현하고 도구 5개를 MCP로 열었습니다. 7개 AI 앱 자동 등록과 OS 키체인 계정 보관까지 혼자 설계하고 구현했습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/wantkdd/hsu-reserve",
    },
    cases: [
      {
        title: "제출했다와 예약됐다는 다르다",
        areas: ["ai", "backend"],
        problem:
          "학교 예약은 사전 검증과 실제 제출이 나뉘어 있고, 제출 응답만으로는 예약이 잡혔는지 알 수 없었습니다. AI가 제출 직후 '예약됐어요'라고 말하면 사용자는 틀린 정보를 믿게 됩니다.",
        solution:
          "제출 전에 운영 시간·요일·예약 가능 기간·하루 최대 시간·인원·필수 항목을 확인하고, 학교 화면과 같은 순서로 사전 검증과 제출을 보냈습니다. 제출 뒤에는 내 신청내역과 시간표를 다시 조회해, 둘 다 맞을 때만 reserved를 돌려주고 아니면 submitted_unverified로 구분했습니다. 빈자리가 없으면 다른 공간, 가까운 시간, 다음 7일의 같은 시간을 차례로 제안합니다.",
        result:
          "AI 앱이 결과 값에 따라 '예약 완료'와 '신청은 했지만 확인 필요'를 다르게 안내합니다. 지침에도 reserved일 때만 완료라고 말하도록 적었습니다.",
        verification:
          "공개 저장소의 서비스 코드에서 규칙 확인과 재조회 판정을 확인할 수 있습니다. 자동 테스트는 아직 없고, 학교 시스템에 대한 검증은 제가 실제로 예약하며 쓴 범위입니다.",
        limitation:
          "인원 규칙과 하루 최대 시간은 학교 안내문을 근거로 코드에 넣었습니다. 학교 규정이 바뀌면 직접 고쳐야 합니다.",
        links: [
          {
            label: "규칙 확인·재조회 코드",
            url: "https://github.com/wantkdd/hsu-reserve/blob/7e0b19a48f7f5fc1e89aec5c6dced881b63d7b91/src/hsu_reserve/service.py#L294-L418",
          },
        ],
      },
      {
        title: "학교 계정은 앱 설정 밖에",
        areas: ["ai"],
        problem:
          "여러 AI 앱에서 쓰려면 실행 환경 설치, 학교 계정 설정, 앱마다 다른 MCP 등록을 각각 해야 했습니다. 계정을 앱 설정 파일에 넣으면 비밀번호가 평문으로 남습니다.",
        solution:
          "macOS·Windows에서 더블클릭 한 번으로 실행 환경을 설치하고, 학교 로그인이 실제로 되는지 확인한 뒤 계정을 OS 키체인에 저장했습니다. 설치된 AI 앱만 찾아 실행 명령을 등록하고, 기존 설정은 백업하며 읽을 수 없는 설정 파일은 덮어쓰지 않았습니다. Codex에는 조회 도구 3개만 자동 승인하고 예약·취소는 매번 확인받게 했습니다.",
        result:
          "7개 AI 앱을 대상으로 계정 설정과 MCP 등록을 하나의 설치 흐름으로 묶었습니다. 앱 설정에는 학번과 비밀번호가 들어가지 않습니다.",
        verification:
          "설치·제거 스크립트와 설치기 코드를 공개했습니다. 7개 앱 전체에서 설치 성공률을 측정하지는 않았습니다.",
        links: [
          {
            label: "설치기 코드",
            url: "https://github.com/wantkdd/hsu-reserve/blob/7e0b19a48f7f5fc1e89aec5c6dced881b63d7b91/src/hsu_reserve/installer.py",
          },
        ],
      },
    ],
  },

  {
    slug: "leafly",
    name: "Leafly",
    period: "2025.09 — 12",
    role: "모바일 프론트엔드 · 학교 수업 팀 프로젝트",
    tagline: "책 한 권이, 나의 기록이 되기까지.",
    description:
      "추천부터 검색, 독후감까지. 학교 수업 팀 프로젝트로 React Native와 Expo 앱의 화면 기능을 맡았습니다.",
    stack: ["React Native", "Expo", "Zustand"],
    image: "/images/leafly.webp",
    imageAlt: "Leafly 맞춤 도서 추천과 독서 기록 서비스 소개 이미지",
    accent: "#eaf0e5",
    highlight:
      "모바일 프론트엔드를 맡아 초안 복원과 새 글 작성을 나누고, 촬영에서 도서 검색까지 연결했습니다.",
    scope:
      "프론트엔드 2명 중 기능 개발을 맡아 병합 PR 41건 중 32건을 작성했습니다. 온보딩·홈·검색·도서 상세·독후감·서재·스캔 화면의 기능과 API·OCR 연동을 구현했고, 팀원은 스플래시·로그인 퍼블리싱과 디자인 수정을 맡았습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/Leafly-app/client",
    },
    links: [
      {
        label: "독후감 화면 구현 PR #8",
        url: "https://github.com/Leafly-app/client/pull/8",
      },
    ],
    cases: [
      {
        title: "다시 돌아와도 남아 있는 초안",
        areas: ["frontend"],
        problem:
          "앱 재진입 때 독후감 초안을 복원하되, 다른 책으로 새 글을 시작하면 이전 초안이 끼어들지 않아야 했습니다.",
        solution:
          "사용자가 임시저장을 누르면 도서·별점·제목·본문·이미지 URI를 AsyncStorage에 기록했습니다. 작성 화면에 다시 들어오면 복원 여부를 묻고, 새 도서를 선택해 들어온 경우에는 이전 초안을 불러오지 않았습니다. 등록 성공 후 초안 삭제를 요청하고 입력 폼을 초기화했습니다.",
        result:
          "이어서 쓰기와 새 글 쓰기를 구분하고, 갤러리 사진을 multipart로 전송하도록 구현했습니다.",
        verification:
          "제가 작성한 PR #8·#84와 초안 hook에서 저장·복원·등록 후 초기화 경로를 확인할 수 있습니다. 갤러리 권한 거부 안내와 최대 3장 첨부 제한도 구현했습니다. 자동 테스트 실행 결과를 제시하는 사례는 아닙니다.",
        limitation:
          "초안은 단일 키에 저장되며 이미지 URI만 보존합니다. 계정별 초안 분리와 앱 재실행 후 첨부 파일의 유효성 검증은 남은 개선점입니다.",
        links: [
          {
            label: "독후감·초안 구현 #8",
            url: "https://github.com/Leafly-app/client/pull/8",
          },
          {
            label: "등록 후 초기화 개선 #84",
            url: "https://github.com/Leafly-app/client/pull/84",
          },
          {
            label: "초안 저장·복원 코드",
            url: "https://github.com/Leafly-app/client/blob/d4ac1f079169ee668a04a3d922ec24114ab5d271/hooks/useDraftReview.ts#L16-L78",
          },
        ],
      },
      {
        title: "책을 찍으면 검색으로 이어지도록",
        areas: ["frontend"],
        problem:
          "직접 ISBN을 입력하지 않고 실물 책을 촬영해 검색하는 흐름이 필요했습니다.",
        solution:
          "Expo Camera의 사진을 multipart로 업로드하고 OCR 응답의 isbn13으로 도서 상세 화면에 이동했습니다. OCR 처리 중 추가 촬영을 제한하고, 성공·실패 후 finally에서 임시 파일 삭제를 시도했습니다. 삭제 실패는 로그로 남겼습니다.",
        result:
          "촬영부터 도서 상세 화면까지 연결했습니다. 인식 실패에는 ISBN 수동 검색을 제공했습니다.",
        verification:
          "제가 작성한 PR #15와 OCR hook에서 업로드·ISBN 이동·파일 정리 흐름을 확인할 수 있습니다. 요청 제한 시간은 30초이며 카메라 권한 화면과 OCR 실패 알림을 제공합니다. 실제 기기별 권한 재설정이나 업로드 재시도 검증 결과는 포함하지 않았습니다.",
        links: [
          {
            label: "스캔 기능·임시 사진 정리 #15",
            url: "https://github.com/Leafly-app/client/pull/15",
          },
          {
            label: "OCR 요청과 finally 처리",
            url: "https://github.com/Leafly-app/client/blob/d4ac1f079169ee668a04a3d922ec24114ab5d271/hooks/useBookOCR.ts#L11-L36",
          },
        ],
      },
    ],
  },
  {
    slug: "ekec",
    name: "EKEC",
    period: "2025.06 — 08",
    role: "프론트엔드 팀장 · UMC 8기",
    tagline: "나와 맞는 모임을, 처음부터 편하게.",
    description:
      "성향에 맞는 모임(크루)을 찾아 주는 매칭 플랫폼. 첫 협업 프로젝트에서 프론트엔드 팀장을 맡아 초기 세팅부터 로그인·게시판·일정까지 연결했습니다.",
    stack: ["React", "TypeScript", "Vite", "Zustand", "Axios"],
    image: "/images/ekec.webp",
    imageAlt: "EKEC 로고와 성향 맞춤 모임 매칭 플랫폼 소개",
    accent: "#eceefe",
    highlight:
      "PR 템플릿과 초기 구조를 만들고, 다른 기기 로그인으로 끊긴 세션을 이유와 함께 안내하도록 했습니다.",
    scope:
      "프론트엔드 4명 중 팀장으로 PR 템플릿과 라우터·레이아웃·API 클라이언트 초기 구조를 만들었습니다. 로그인·회원가입·프로필 생성, 게시판, 일정 생성·조회·수정·삭제와 캘린더·댓글·좋아요 API를 연동했고, 제가 작성한 PR 52건이 병합됐습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/EKEC-crew/FE",
    },
    links: [
      {
        label: "초기 프로젝트 세팅 PR #13",
        url: "https://github.com/EKEC-crew/FE/pull/13",
      },
    ],
    cases: [
      {
        title: "왜 로그아웃됐는지 알려주는 세션 처리",
        areas: ["frontend"],
        problem:
          "다른 기기에서 같은 계정으로 로그인하면 기존 기기의 세션이 끊깁니다. 이유가 화면에 드러나지 않으면 사용자는 왜 로그아웃됐는지 알 수 없습니다. 한 번도 로그인하지 않은 방문자에게 '세션 만료' 안내가 뜨는 것도 막아야 했습니다.",
        solution:
          "요청이 401로 실패하면 토큰 재발급을 한 번만 시도하고, 성공하면 원래 요청을 다시 보냈습니다. 재발급까지 실패하면 서버의 오류 코드로 이유를 나눠, 다른 기기 로그인(REFRESH_REVOKED, SESSION_CONFLICT)과 기간 만료(REFRESH_EXPIRED)를 서로 다른 안내로 보여 줬습니다. 로그인한 기록이 있을 때만 안내 모달을 띄우고, 인증 상태를 정리한 뒤 로그인 화면으로 보냈습니다.",
        result:
          "중복 로그인으로 세션이 끊긴 기기에서 '다른 기기에서 로그인되었습니다'를 보고 다시 로그인할 수 있게 했습니다.",
        verification:
          "제가 작성한 PR #178에 동작 영상이 있습니다. 중복 로그인 판정과 오류 코드는 서버 응답을 따랐고, 이 변경의 자동 테스트는 없습니다.",
        links: [
          {
            label: "중복 로그인 안내 PR #178",
            url: "https://github.com/EKEC-crew/FE/pull/178",
          },
        ],
      },
      {
        title: "첫 협업에서 같은 방식으로 일하기",
        areas: ["frontend"],
        problem:
          "제 첫 협업 프로젝트였고, 네 명이 한 저장소에서 동시에 화면을 만들기 시작했습니다. 각자 다른 방식으로 PR을 올리고 구조를 잡으면 리뷰와 연동이 어려워질 상황이었습니다.",
        solution:
          "프로젝트 시작과 함께 PR 템플릿, 라우터·레이아웃·API 클라이언트의 초기 구조를 먼저 만들어 팀원이 같은 틀에서 화면을 붙이게 했습니다. 이후 인증·게시판·일정처럼 API가 많은 화면을 맡아, 일정 화면은 캘린더·범례·툴팁 컴포넌트로 나눠 연동했습니다.",
        result:
          "저장소의 병합 PR 108건 중 52건을 제가 작성했고, 데모데이까지 인증·게시판·일정 기능을 연결했습니다.",
        verification:
          "PR 목록과 각 PR의 작업 내용·스크린샷으로 확인할 수 있습니다. 당시 저장소에는 자동 테스트와 CI가 없었습니다.",
        links: [
          {
            label: "캘린더·일정 연동 PR #115",
            url: "https://github.com/EKEC-crew/FE/pull/115",
          },
          {
            label: "일정 CRUD API 연동 PR #111",
            url: "https://github.com/EKEC-crew/FE/pull/111",
          },
        ],
      },
    ],
  },
  {
    slug: "gotit",
    name: "gotIT",
    period: "2025.11 — 12",
    role: "프론트엔드 · AI 챗봇",
    tagline: "어려운 IT 용어를, 대화로 이해하도록.",
    description:
      "누구나 쉽게 이해하는 IT 용어 사전. 웹프레임워크 수업 팀 프로젝트로, Gemini 챗봇과 검색·대시보드 화면을 만들었습니다.",
    stack: ["Next.js", "TypeScript", "Gemini API", "Tailwind CSS"],
    image: "/images/gotit.webp",
    imageAlt: "gotIT IT 용어 사전 서비스 소개 이미지",
    accent: "#ece8f6",
    highlight:
      "Gemini 챗봇이 정해진 형식의 짧은 답과 다음 질문 3개를 함께 돌려주도록 만들었습니다.",
    scope:
      "4명 팀에서 로그인·온보딩·대시보드 화면과 Gemini 챗봇을 구현했습니다. 용어 100개에 역할별 대화 예시를 추가하고, 검색 화면의 로딩·비로그인 추천을 고쳤습니다. 제가 작성한 PR 14건이 병합됐습니다.",
    repository: {
      visibility: "public",
      url: "https://github.com/ButterWaffle-GotIT/GotIT",
    },
    links: [{ label: "서비스 사이트", url: "https://www.gotit.cloud" }],
    cases: [
      {
        title: "짧게 답하고, 다음 질문을 건네는 챗봇",
        areas: ["ai", "frontend"],
        problem:
          "IT 용어에 대한 긴 설명은 모바일 화면에서 읽기 어렵고, 처음 배우는 사람은 답을 읽은 뒤 무엇을 더 물어야 할지 알기 어렵습니다.",
        solution:
          "Gemini 2.5 Flash를 서버 액션에서 호출해 API 키가 브라우저에 노출되지 않게 했습니다. 응답 형식을 JSON으로 고정하고, 용어 정의 질문에는 한 문장 정의·핵심 특징 3개·쉬운 비유·짧은 대화 예시를, 로드맵 질문에는 번호 목록을 쓰도록 규칙을 나눴습니다. 답과 함께 추천 질문 3개를 받아 버튼으로 바로 이어 묻게 했습니다.",
        result:
          "챗봇 화면, 추천 질문, 하단 빠른 버튼을 연결했습니다. 호출이나 응답 해석에 실패하면 오류 안내를 보여 줍니다.",
        verification:
          "제가 작성한 PR #51·#101에서 서버 액션과 화면 연결을 확인할 수 있습니다. 자동 테스트는 없습니다.",
        limitation:
          "사용자 질문을 프롬프트에 그대로 넣어 프롬프트 주입에 대한 방어가 없습니다. 형식을 벗어난 응답은 다시 요청하지 않고 오류로 처리합니다.",
        links: [
          {
            label: "챗봇 구현 PR #51",
            url: "https://github.com/ButterWaffle-GotIT/GotIT/pull/51",
          },
          {
            label: "챗봇 하단 버튼 연결 PR #101",
            url: "https://github.com/ButterWaffle-GotIT/GotIT/pull/101",
          },
        ],
      },
      {
        title: "로딩 중에도, 로그인 전에도 비지 않는 추천",
        areas: ["frontend"],
        problem:
          "검색 화면의 추천 용어를 불러오는 동안 렌더링 오류가 났고, 로그인하지 않은 방문자는 관심 분야 정보가 없어 추천 기준이 없었습니다.",
        solution:
          "로딩 중에는 같은 크기의 스켈레톤 카드를 보여 주고, 카드를 누르면 용어 상세로 이동하게 했습니다. 비로그인 상태는 '전체' 분야로 처리해 무작위 분야에서 용어 6개를 추천했습니다.",
        result:
          "로그인 여부와 로딩 상태에 관계없이 검색 화면에 추천 카드가 채워지도록 했습니다.",
        verification:
          "제가 작성한 PR #89·#99의 변경입니다. 자동 테스트는 없습니다.",
        links: [
          {
            label: "스켈레톤·상세 연결 PR #89",
            url: "https://github.com/ButterWaffle-GotIT/GotIT/pull/89",
          },
          {
            label: "비로그인 추천 처리 PR #99",
            url: "https://github.com/ButterWaffle-GotIT/GotIT/pull/99",
          },
        ],
      },
    ],
  },
];

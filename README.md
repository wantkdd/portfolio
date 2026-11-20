# 유상완 · Portfolio

하늘색 랜딩과 프로젝트 10개의 문제 해결 기록을 담은 Next.js 포트폴리오입니다. PDF와 본인 작성 GitHub PR·코드·당시 CI, 산학공동연구 최종보고서를 대조해 담당 범위와 검증 근거를 정리했습니다.

## 실행

Node.js 22 이상을 권장합니다.

```sh
npm ci
npm run dev
```

개발 화면은 <http://localhost:3000>에서 열립니다. 프로덕션 빌드 미리보기:

```sh
npm run build
npm run start -- --port 3100
```

## 구성

- Next.js 16.4.6 App Router · React 19.3.1 · TypeScript
- 정적 생성한 랜딩 및 MOA, MOAMOA, WhyLog, PLOG, 2D Image To CAD, AX-frontier, HSU Reserve, Leafly, EKEC, gotIT 상세 페이지
- 카드의 개인 역할·핵심 개선, 상세 상단의 담당 범위·사례 바로가기, 공개 PR·고정 소스 링크
- 구현·테스트·측정의 확인 범위와 남은 과제. 비공개 MOA·산학공동연구 소스는 공개 링크 없이 구분
- 사례마다 붙인 분야(Frontend·Backend·AI)로 거르는 필터. `/?role=ai#work`처럼 직무별 주소로 바로 열 수 있음
- 키보드로도 조작하는 종이비행기, 이메일 복사, PDF 다운로드
- 마우스에 반응하는 하늘 패럴랙스와 프로젝트 이미지 틸트·빛 효과. 터치와 모션 감소 설정에서는 생략
- 반응형 WebP/AVIF 이미지와 자체 호스팅한 Pretendard 한글 서브셋 폰트
- 서버 컴포넌트 중심 구성. 필터·클립보드·종이비행기·포인터 장식만 클라이언트에서 실행
- 모션 감소 설정, 건너뛰기 링크, 포커스 표시, 스크린리더 결과 안내

## 수정할 곳

| 파일 | 내용 |
| --- | --- |
| `src/data/portfolio.ts` | 프로젝트, 개인 범위, 근거 링크, 검증 경계, 성능 비교표 |
| `src/app/page.tsx` | 랜딩의 소개·경력·연락 문구 |
| `src/app/projects/[slug]/page.tsx` | 공통 프로젝트 상세 레이아웃 |
| `src/app/globals.css` | 색, 여백, 타이포그래피, 반응형 스타일 |
| `src/app/layout.tsx` | 기본 제목, 설명, 공유 메타데이터 |
| `public/portfolio.pdf` | 내려받을 포트폴리오 (`npm run pdf`로 생성) |
| `scripts/diagrams/*.svg` | 화면 캡처가 없는 프로젝트(AX-frontier, HSU Reserve, EKEC)의 로고형 대표 이미지. `node scripts/optimize-assets.mjs tmp/source/images`로 WebP와 크기 파일을 다시 만든다 |

프로젝트 이미지의 원본 크기는 `src/data/image-dimensions.ts`에 저장합니다. 새 원본 PNG를 준비한 후 아래 명령으로 WebP와 크기 정보를 함께 갱신할 수 있습니다.

```sh
node scripts/optimize-assets.mjs /path/to/original-pngs
```

### 포트폴리오 PDF

`public/portfolio.pdf`는 `/print` 페이지(사이트와 같은 `src/data/portfolio.ts`, `src/data/profile.ts`를 씀)를 A4로 저장한 것입니다. 내용을 바꾼 뒤:

```sh
npm run build && npm run start -- --port 3100   # 다른 터미널
npm run pdf
```

PLOG 성능 수치의 출처인 이전 포트폴리오(2026-09)의 해당 쪽은 `public/evidence/plog-benchmark-2026-09.pdf`에 따로 남겨 두었습니다.

### 프로필 사진 바꾸기

사진은 한 곳에서만 바꿉니다. `tmp/source/images/portrait.png`를 새 사진(정면, 단색 배경 권장)으로 교체한 뒤:

```sh
npm run portrait
```

소개 섹션 사진(`public/images/portrait.webp`)과, 배경을 지우고 얼굴만 자른 비행기 탑승자(`public/images/rider.webp`)가 함께 다시 만들어집니다. "click to fly"를 누르면 이 얼굴을 기수에 붙인 비행기가 히어로 글자 뒤로 왼쪽 끝에서 오른쪽 끝까지 지나갑니다(`src/components/paper-plane.tsx`). 배경 제거는 rembg(`birefnet-portrait` 모델)를 쓰며 처음 한 번 약 1GB 모델을 내려받습니다. 얼굴이 너무 넓게 잘리면 `scripts/make-rider.py`의 어깨 판정 비율(1.6)을 조정하세요.

### 비행기 이미지

`public/images/airplane.webp`는 NASA의 SOFIA 747SP 비행 사진(퍼블릭 도메인, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:SOFIA_over_clouds.jpg))의 배경을 지우고, 기관 로고·글자를 덮은 뒤 꼬리날개를 하늘색과 `w.` 표시로 다시 칠한 것입니다. 다시 만들 때는 `scripts/make-airplane.py` 상단의 안내를 따르세요.

### 로고

상단·하단 로고는 `src/components/wordmark.tsx`(Pretendard 글리프를 외곽선으로 바꾼 `wantkdd.`)이고, 파비콘은 `src/app/icon.svg`입니다.

현재 폰트는 페이지에 쓰이는 한글과 기본 라틴·기호를 포함합니다. 내용을 크게 바꾸면 [Pretendard 원본](https://github.com/orioncactus/pretendard)으로 서브셋을 다시 생성하세요. 포함되지 않은 문자는 시스템 폰트로 표시됩니다. 폰트 라이선스는 `public/fonts/OFL.txt`에 있습니다.

fontTools와 Brotli가 설치된 Python 환경에서 다음 명령으로 현재 소스의 한글을 다시 수집하고 누락 글자를 검사할 수 있습니다. 원본 폰트는 저장소에 포함하지 않습니다.

```sh
python3 scripts/subset-font.py /path/to/PretendardVariable.woff2
```

## 검증

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:responsive
```

E2E는 로컬 Google Chrome이 필요하며 프로덕션 빌드를 3100 포트에서 실행합니다. 데스크톱과 모바일 크기에서 필터·이동·클립보드·키보드·모션 감소·이미지·PDF·404·자동 접근성 검사를 수행합니다. 모바일은 Chrome의 기기 에뮬레이션입니다.

반응형 검사는 `npm exec playwright install webkit` 후 실행하세요. iPhone Duo, Galaxy Fold, iPad, Galaxy Tab 등 [34개 화면 조건](docs/responsive.md)을 Chrome과 WebKit에서 검사합니다.

현재 결과와 측정 조건은 [검증 기록](docs/verification.md), 개인 기여·프로젝트별 검증 범위는 [콘텐츠 근거](docs/content-evidence.md), 기술 선택과 이미지 출처는 [조사 기록](docs/research.md), 시각 설계 원칙은 [DESIGN.md](DESIGN.md)에 있습니다.

## 구직관리 (로컬 전용)

`/admin`은 개인 구직 자료(`career/`, git 제외)를 읽고 쓰는 관리 페이지입니다. `.env.local`에 `CAREER_ADMIN=local`이 있을 때만 열리고, 없으면 모든 `/admin` 경로가 404입니다. 배포 환경에는 이 값을 넣지 않습니다. `.vercelignore`가 `career/`와 `.env*`를 업로드에서 뺍니다.

```sh
printf 'CAREER_ADMIN=local\n' > .env.local
npm run dev   # http://localhost:3000/admin
```

| 경로 | 내용 |
| --- | --- |
| `/admin` | 지원할 공고. 마감 D-day, 직무 필터, 상태 변경. 데이터는 `career/data/postings.json` |
| `/admin/postings/[id]` | 공고 상세·수정, 연결한 자소서(md) 미리보기, 포트폴리오 링크 |
| `/admin/documents` | `career/` 폴더와 `~/Documents/New project 2/output/pdf/`의 문서 목록·보기 |
| `/admin/saramin` | 사람인 채용공고 API 검색 후 목록에 추가. `.env.local`에 `SARAMIN_ACCESS_KEY` 필요 ([이용신청](https://oapi.saramin.co.kr/join), 하루 500회) |

파일 경로는 `career/…`, `pdf/…` 두 폴더 안만 열고, 그 밖(`../` 등)은 404로 막습니다. 원본 docx는 내려받기만 됩니다.

## 배포

Vercel 또는 Node.js 기반 Next.js 호스팅에 배포할 수 있습니다. 실제 도메인이 정해지면 `metadataBase`, canonical, 사이트맵 및 공유 이미지 URL을 설정하세요. 현재 외부 서비스에 배포하거나 공개 URL을 생성하지 않았습니다.

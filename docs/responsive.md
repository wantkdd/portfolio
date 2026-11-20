# 반응형 검증 범위

2026-10-30. 실제 하드웨어 전체를 확인했다는 의미가 아니라, Chrome과 Playwright WebKit에서 지정한 화면 크기와 입력 방식으로 검사한 기록입니다.

최종 결과: **34개 환경 모두 통과, 58.9초**. 실패·건너뛰기·재시도 없음. 별도 기본 기능 테스트도 **18개 통과**했습니다.

## 화면 행렬

| 기기·조건 | 범위 | 환경 수 |
| --- | --- | ---: |
| iPhone | 13 Mini, 13, 16 Pro Max, 16 가로 | 4 |
| Galaxy S24 | 세로·가로 | 2 |
| Galaxy Z Fold 6 | 커버·내부 | 2 |
| Galaxy Z Fold 7 | 커버·내부 각각 세로·가로 | 4 |
| iPad Mini / Pro 11 | 각각 세로·가로 | 4 |
| Galaxy Tab S9 | 세로·가로 | 2 |
| 작은 화면 / 태블릿 분할 창 | 320×658 / 507×768 | 2 |
| 추가 WebKit | iPhone 13, iPhone 16 가로, iPad Mini, iPad Pro 11 가로 | 4 |
| iPhone Duo · WebKit | 아래 5개 모드 각각 작은 높이·큰 높이 | 10 |
| **합계** | **랜딩 + 상세 5개 경로를 각 환경에서 검사** | **34** |

첫 20개 환경은 설치된 Playwright 기기 프리셋 또는 명시한 합성 뷰포트를 Chrome에서 실행합니다. 이어지는 14개는 Playwright WebKit 엔진입니다. 기기별 UA로 레이아웃을 분기하지 않습니다.

## iPhone Duo

Safari 27.1의 [WebKit 공식 화면 크기](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/)를 사용했습니다. 수치는 CSS 픽셀입니다.

| 모드 | 너비 | 작은 높이 SVH | 큰 높이 LVH |
| --- | ---: | ---: | ---: |
| 외부 세로 | 382 | 580 | 618 |
| 외부 가로 | 594 | 368 | 406 |
| 내부 세로 | 669 | 867 | 902 |
| 내부 가로 | 951 | 585 | 620 |
| 내부의 분할 창 하나 | 385 | 571 | 609 |

각 높이 경계를 별도로 검사합니다. 실제 Safari 도구 막대가 접히는 과정, 하드웨어 접힘 센서, Xcode Device Hub는 실행하지 않았습니다. 공식 자료에 따르면 posture/segments API는 아직 기능 플래그 뒤의 프리뷰이므로, 사이트는 일반 반응형 레이아웃으로 동작합니다.

## 검증 내용

- 랜딩과 프로젝트 상세 5개 페이지의 가로 넘침 및 텍스트 잘림
- 메뉴와 로고, 실제 CTA 버튼과 종이비행기 클릭 영역의 겹침
- 짧은 가로 화면에서 스크롤 전 CTA 노출
- 필터 선택·프로젝트 개수, 연락처 링크·이메일 복사 결과 안내
- 모든 상세 이미지 로딩과 MOAMOA 비율 유지
- Galaxy Fold 7 및 iPhone Duo 크기를 실행 중 바꿔도 필터 상태 유지
- 화면별 랜딩·프로젝트·연락처·상세 캡처

수정한 부분: 가로 화면의 CTA와 장식 배치, 320px 메뉴 간격, 좁은 화면 제목 크기의 급변, 상세 이미지의 불필요한 세로 여백. 원래 데스크톱 디자인과 마우스 효과를 유지합니다.

## 재실행

```sh
npm exec playwright install webkit
npm run build
npm run test:responsive
```

Google Chrome이 설치되어 있어야 합니다. 설정은 `playwright.responsive.config.ts`, 검사는 `tests/responsive/layout.spec.ts`입니다. 최신 JSON 결과와 화면 캡처는 Git에서 제외한 `.omx/artifacts/responsive/`에 저장됩니다. 기본 기능·접근성·마우스 검사 18개는 `npm run test:e2e`로 별도 실행합니다.

실제 iOS Safari, Samsung Internet, 모든 Android 기기의 폰트·브라우저 UI까지 동일하다고 보장하는 검사는 아닙니다. 기기 이름보다 화면의 크기와 브라우저 엔진을 기준으로 확인한 범위를 사용하세요.


2026-10-30 콘텐츠 근거 보완 후 최종 빌드 재검사: 34/34 통과, 183.6초. 담당 범위·근거 링크·긴 사례 설명·성능 비교표·WhyLog 기술 태그를 포함한 6개 경로를 검사했습니다. 실제 하드웨어가 아닌 Chrome/WebKit 화면 에뮬레이션입니다.

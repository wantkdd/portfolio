# Content evidence — 2026-10-30, extended 2026-11-20

The supplied PDF remains a primary source for career dates and original measurement records. This revision additionally checks wantkdd-authored GitHub changes, implementation and historical CI. External projects were not installed or executed during this review. A test's presence is not a fresh passing result; author-reported test runs are distinguished from observed CI status.

The connected GitHub plugin exposed a different user and one selected repository. The existing local GitHub CLI was authenticated as wantkdd and returned 19 organizations and all five relevant project repositories. Only read operations were performed. No repository settings, visibility, issues, PRs or comments were changed.

## MOA — private

MOA-Crew/FE is private. The public UI contains no private source link or raw code. Three wantkdd-authored, merged changes support dashboard browser revalidation, access-token/session separation and profile DTO/form mapping. Corresponding tests and historical CI validate success were inspected. Browser revalidation is not implemented as a distinct SSR auth-failure flag: the corrected text says the browser re-fetches and replaces dashboard/application state after mounting.

The dashboard regression uses mocked client results, not a deployed cookie-domain integration test. API live/auth-blocked checks were report-only. Original browser smoke and profile-save/reload reports were not rerun. Private references remain in ignored local notes under tmp/source/github.

## MOAMOA — public

- [Own merged PR #256: app initialization and logout reset](https://github.com/UMC-9th-MOAMOA/Front-end/pull/256)
- [Own merged PR #276: selective cache removal](https://github.com/UMC-9th-MOAMOA/Front-end/pull/276)
- [Pinned popup implementation](https://github.com/UMC-9th-MOAMOA/Front-end/blob/138aec08014e7e5c3a36e37b9cbf2ceebc7607c4/src/hooks/goal/useGoalPopupCheck.ts#L13-L73)

PR #276 explains the SPA/social-login difference and why queryClient.clear() was rejected. This is removal of selected account-related keys, not user-ID-keyed cache isolation. Popup confirmation failure empties the queue. Previously started account requests have no observed abort/generation guard in the reviewed hooks. PR demonstrations are available, but the author left social-to-local verification as a follow-up. No automatic test run was established.

## WhyLog — public

- [Own merged full-stack PR #18](https://github.com/WhyLog-App/WhyLog/pull/18): login/email/account recovery/profile, web and server in one change.
- [Historical quality CI for #18](https://github.com/WhyLog-App/WhyLog/actions/runs/34174852861): web quality, server quality, tooling tests and gate succeeded. The local QA/27-screen report is author-reported, and some S3/account end-to-end checks were explicitly excluded.
- [Own merged common CI/rules PR #4](https://github.com/WhyLog-App/WhyLog/pull/4): shared records, branch/commit rules and area-based CI improvements. Initial AGENTS/monorepo work included other authors; no sole-creation or human-review-approval claim.
- [Own merged transcript PR #55](https://github.com/WhyLog-App/Whylog-AI/pull/55): normalize text, combine similarity/order/trustworthy time, avoid directly comparing incompatible absolute/relative time, lower time weighting when unreliable, and preserve fuller transcript text. Duplicate segments remain.
- [Own merged analysis-state PR #27](https://github.com/WhyLog-App/Whylog-AI/pull/27): summary and embedding readiness; memory-based execution state, no durable-queue claim.
- [Own merged generation-reuse PR #67](https://github.com/WhyLog-App/Whylog-AI/pull/67): two normal-path generation calls become one; embedding API calls and retries remain. Tests assert no second generation and failed embedding status. 115 pytest passes are PR-author reported; historical CI ran Ruff/Docker, not pytest, and archived logs expired.
- [Own merged offline matching evaluation PR #68](https://github.com/WhyLog-App/Whylog-AI/pull/68): saved response evaluation, not a measured production accuracy improvement.

## MOA backend — private (added 2026-11-20)

- PR #28 (wantkdd, merged 2026-06-02): daily popular-project ranking in a date-keyed Redis ZSET, per-member daily dedupe via `setIfAbsent` with a 2-day key TTL, public/recruiting/in-progress filter, latest-public-project fallback when Redis fails or candidates are short. Author checked `./gradlew test`; no dedicated tests in the 15 changed files. Anonymous views are not deduplicated; member ID came from a temporary header.
- PR #83 (wantkdd, merged 2026-06-22): S3 upload 500 traced to IMDS access from a bridge-network container; app moved to host network with Spring bound to 127.0.0.1, Redis on host loopback, legacy Redis container cleanup in CD. PR records tests/build/compose rendering and network-mode comparison; no recorded post-fix upload call.
- No private URL or code is published; described in interview only.

## WhyLog recovery challenge — public

- [Own commit fa77c984](https://github.com/WhyLog-App/WhyLog/commit/fa77c9844758a773d84d4be83ae138cf0285756d): 32-byte SecureRandom challenge, SHA-256-keyed Redis entry with 10-minute TTL, `getAndDelete` consumption, locked member lookup and withdrawal-grace check before recovery. Only the two service files; no dedicated tests. Redis deletion and DB recovery are not atomic. Refresh-token Redis storage is a teammate's work.

## WhyLog local Kubernetes practice — local only

`~/orca/projects/whylog-k8s/deploy/k8s/README.md` (local branch `chore/local-k8s`, never pushed). 2026-11-07 kind cluster: pod kill 359/359 OK; rolling update 4/896 connection failures, 0 in two runs after a 5s preStop; Redis restart drops refresh tokens; MySQL restart keeps data. SERVER_PORT service-link injection fixed with `enableServiceLinks: false`. Shown on the WhyLog page as a backend case labelled as local practice, not operations.

## 2D Image To CAD — industry research, private

Source: research final report (`~/orca/projects/산학공동연구프로젝트/.omx/private/final-report-20261111`) and AGENTS.md facts. Partner (주)픽셀부스트 allowed non-profit portfolio use (user, 2026-11-20); source, GitLab URLs and partner drawings are not published. Partner drawings may be shown (user, 2026-11-20). Card/detail images pair official evaluation cells 03, 11 and 06 (`.omx/private/mr45-rebase-20261117/ci-work/cells/*.png`) with the matching pipeline DXF outputs (`cells_dxf/*.dxf`, latest team pipeline, not only own changes), rendered with ezdxf and composed by a throwaway script; the cell06 caption states that 1.9 stayed as plain text. Rule design (endpoint rules, resolution-proportional constants, short radius leaders, rejected fixed-R fitting) is the main story. Metrics: official 31 cells, endpoints 263→275/338, >1mm vertices 72→50 (after !41), 10px/mm dimensions 0→126/190 (!19), IoU unchanged 88.7%, 17 merged MRs. Factory interview: 5–7 days per drawing, ~50 per week (annual volume unsourced, not used). Research was operated with coding agents; no "built an AI agent" claim.

## AX-frontier — public

38 wantkdd-authored merged PRs (AI 14, FE 14, BE 10). Own: document-review agent and rules ([AI #17](https://github.com/AX-frontier/AI/pull/17)), conservative amount correction ([AI #33](https://github.com/AX-frontier/AI/pull/33), Claude cross-check stated in PR), review workspace FE/BE, crawling and incremental ingestion, SSE across three tiers and routing parallelization ([AI #22](https://github.com/AX-frontier/AI/pull/22)). Main/Orchestrator (minmin02) and Library (infiniment) are teammates' work. The PR's 40–50% routing claim has no measurement record and is not used. Current MAIN path sends the finished answer as one chunk. No service screenshots exist; the site uses a logo-style cover drawn for the site (`scripts/diagrams/ax-frontier.svg`). The award is user-provided.

## HSU Reserve — public

[wantkdd/hsu-reserve](https://github.com/wantkdd/hsu-reserve) published 2026-11-20 at commit 7e0b19a after a secret audit of tracked files and history. Five MCP tools, pre-submit rule checks, post-submit re-query that returns `reserved` only when history and timetable both match, OS keyring credentials, detection-based registration for seven AI apps. No test suite exists. Personal use and sharing with three friends are user-confirmed; no success-rate metric. Cover: logo-style image drawn for the site (`scripts/diagrams/hsu-reserve.svg`).

## PLOG — public code, separately attributed local benchmark

- [Own atomic insertion change and unit tests](https://github.com/UMC-Plog/Plog-BE/commit/ce9d27aa0cab356e428a0a24addc068f7f99160e)
- [Own final submission change and regression cases](https://github.com/UMC-Plog/Plog-BE/commit/25c90640d2edeb0479f44496bb5f0da912653fe4)
- [Own frontend submission-state change](https://github.com/UMC-Plog/Plog-FE/commit/b52eec2918067764859619d14f69a7ed4d73c078)
- [Historical backend build CI](https://github.com/UMC-Plog/Plog-BE/actions/runs/31603522842)

Conditional payload updates and actor enrichment are present. Testcontainers tests may skip without Docker; source presence does not establish execution. Final submission tests cover incomplete evaluations, waiting, everyone submitted, idempotency and timeout. FE notes exclude a real backend-connected E2E run.

The index experiment, p95 1,811.90 → 8.58ms and 65 tests are sourced to physical PDF page 11 (printed page 8); the browser PDF link targets physical page 11, verified by extracting that page. The public dev tree, relevant authored PRs and branch names did not reveal the index SQL, benchmark script/raw results or corresponding execution report. Current public entity indexes do not include the claimed compound index. Local/manual work is possible; this is an evidence gap, not proof the experiment did not occur. A question for the artifact location was sent to the user. Until supplied, the website labels these as original PDF local measurements, separate from public CI.

## Leafly — public

- [Own merged review/draft PR #8](https://github.com/Leafly-app/client/pull/8)
- [Own merged camera/OCR PR #15](https://github.com/Leafly-app/client/pull/15)
- [Own merged successful-registration cleanup PR #84](https://github.com/Leafly-app/client/pull/84)
- [Pinned draft hook](https://github.com/Leafly-app/client/blob/d4ac1f079169ee668a04a3d922ec24114ab5d271/hooks/useDraftReview.ts#L16-L78)

Manual draft save, single DRAFT_REVIEW key, URI strings only, no account isolation or persistent-file validation. New-book navigation bypasses prior draft restore. OCR processing limits additional capture; finally attempts cleanup, with logged cleanup failure. No automatic test execution or physical-device validation was established. Multiple authored feature PRs support broad frontend responsibility, not a claimed sole authorship percentage.

## EKEC — public (added 2026-11-20)

[EKEC-crew/FE](https://github.com/EKEC-crew/FE): 52 of 108 merged PRs authored by wantkdd, 4 contributors. Frontend lead role is from the user's earlier portfolio. Duplicate-login handling ([#178](https://github.com/EKEC-crew/FE/pull/178)): one refresh retry on 401, REFRESH_REVOKED/SESSION_CONFLICT vs REFRESH_EXPIRED messages, modal only when a prior login exists; server decides conflicts. No tests or CI. The README thumbnail is 480px, so the card uses a cover built from the repo's own LOGO.svg (`scripts/diagrams/ekec.svg`).

## gotIT — public (added 2026-11-20)

[ButterWaffle-GotIT/GotIT](https://github.com/ButterWaffle-GotIT/GotIT): 14 merged PRs by wantkdd, 4-person class project (웹프레임워크1). Gemini 2.5 Flash chatbot as a server action with JSON output and 3 follow-up questions ([#51](https://github.com/ButterWaffle-GotIT/GotIT/pull/51)); dialog examples for 100 terms ([#49](https://github.com/ButterWaffle-GotIT/GotIT/pull/49)); skeleton and logged-out recommendations ([#89](https://github.com/ButterWaffle-GotIT/GotIT/pull/89), [#99](https://github.com/ButterWaffle-GotIT/GotIT/pull/99)). User input is interpolated into the prompt; no injection defence, no tests. Image from the user's earlier portfolio site.

## Sightline — on-device AI class project, private (added 2026-11-22)

Sources: team documents in ~/Downloads ([7]7팀(멋쟁이토마토) 모델 설계 및 최적화 문서, 테스트계획서, 발표자료, 중간점검 발표대본) and the team demo video. Team: PM 진성원, FE 허현·진성원, BE 홍주영·조윤지·유상완. Repos `hs-sightline/{ai,api,mobile}` are private and show no wantkdd commits; the user states he built the datasets and ran LoRA training/evaluation with AI tools as local files (user statement, 2026-11-22). Numbers: help-request model eval 442 exact 6.1→78.7%, function 26.0→98.4%, args 12.2→86.0%, boundary 30 10.0→86.7%; midterm admin-query model 0.6→96.6% (464). W8A16 quantization and QCS6490 conversion by 마음AI (79.41% is their measurement). Board resident execution ~10s→0.5–1.6s/sentence and board end-to-end 83.3% (10/12), 0 false alarms are team results. Demo video re-encoded to `public/videos/sightline-demo.mp4` with the user's permission.

DecodEat was left out by choice; BUG study group not added.

## Collaboration

[wantkdd's UMC workbook guide commit](https://github.com/HSU-Makeus-Challenge-10th/Web/commit/cf7fee1f5ceef921d36932f9aa3c608e60a92c00) directly supports documenting personal branches, weekly PRs, feedback before merge and folder conventions. Participation/efficiency improvement is not measured. User feedback and further leadership outcomes were requested; no invented operational result is added.

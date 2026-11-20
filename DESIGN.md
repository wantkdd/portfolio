# Design

## Source of truth
- Status: Active. Refreshed 2026-10-30.
- Surfaces: portfolio landing and five project case-study routes.
- Evidence: supplied portfolio PDF extracted to tmp/source/portfolio.md; Figma file iVj00AuuIuOq68lAe3u3nA, page 305:2. Empty starting repository.
- User authorizes original sky-blue website, Figma used as image/content source rather than page-layout target.

## Brand
Quiet confidence, curiosity, persistence. Real engineering decisions establish trust. Avoid fabricated impact, busy particles, excessive cards, dark cyberpunk, skill percentage charts.

## Product goals
Help hiring teams understand Sangwan's frontend work, inspect case studies, and contact him. Success: all five projects accessible, accurate content, usable on mobile and keyboard, production build and browser checks pass. The public site needs no CMS or backend. A separate local-only job-search admin (`/admin`, enabled by `CAREER_ADMIN=local`) reads and writes the git-ignored `career/` folder; it is 404 everywhere else and uses plain tables and forms with the same tokens.

## Personas and jobs
Hiring managers and engineers scan the first screen, browse projects, and read implementation decisions. Mobile and desktop, slow connections included.

## Information architecture
Navigation: Work / About / Contact; PDF download. Routes: / and /projects/[slug]. Hero → selected works → approach/about → experience → contact. Representative order: MOA → MOAMOA → WhyLog → PLOG → Leafly. Cards surface personal responsibility and a concrete engineering contribution. Detail pages put scope, repository access, and case navigation before the large image, then link each case to the relevant public PR or pinned source.

## Design principles
Sky as generous negative space. Oversized expressive serif title paired with precise Korean sans. Project imagery leads; concise captions and real cases follow. Visual emphasis belongs to the hero and project media. No automatic infinite motion.

## Visual language
- Colors: sky #c9e7f7, cloud #f7fbfd, ink #193f61, muted #516b80, azure #276da3, rule #d6e4ec.
- Type: Georgia editorial display; self-hosted Pretendard variable for Korean/UI.
- Layout: centered hero; left aligned content in 1200px max wrapper, 32px gutters, 96–140px section rhythm. Large lead project then asymmetric two-column projects.
- Shape: 20px media corners; small pill navigation/buttons. Shadows only for floating nav and media framing.
- Motion: one brief hero entrance; user-triggered hover tilt/raise, filter transition; transform/opacity only. Respect reduced motion, no WebGL, no scroll hijacking.
- Pointer response: sky drifts up to 12px horizontally / 8px vertically; project media tilts at most 3 degrees with a soft moving highlight. Keep text, hit areas and the native cursor stable. Fine mouse/hover only; reset on leave, scroll, blur, touch and motion-preference changes. Coalesce pointer events into one requested frame, with no idle animation loop.
- Imagery: downloaded Figma sources preserve aspect ratio; generated airy sky is decorative.

## Components
Header, ProjectGallery with filter controls and server-rendered project children, contact copy, project case-study layout. Tokens owned in globals.css. No component library necessary.

## Accessibility
WCAG AA target, semantic landmarks, skip link, visible focus, native anchors. Buttons >=44px. Filter pressed state and live count. No color-only meaning. Reduced motion removes animation and smooth scroll. Long email wraps.

## Responsive behavior
320px through 1600px; desktop asymmetry becomes single column below 760px. Header keeps native anchors, no hidden essential links. Coarse pointer disables tilt. Images have responsive sizes and preserve natural aspect ratios. Short landscape screens use a compact hero with CTAs above the decoration. Headline size changes continuously across narrow-phone widths.

iPhone Duo uses standard responsive layout, with official outer/inner/split-window SVH and LVH bounds tested in WebKit. Do not infer device identity from user-agent strings or depend on experimental posture APIs. Galaxy Fold cover/open views, tablet portrait/landscape, and resize-with-filter-state are part of the responsive test matrix.

## Interaction states
Server-rendered content available before JS. All projects are default. Filter empty state impossible with supplied categories. Clipboard button announces success, provides email-link fallback on error. 404 gives clear home path. Slow network retains reserved image geometry.

## Content voice
Korean natural precise body; brief English display/nav. Positioning: a frontend developer who understands API/data flows and keeps authentication, cache, and asynchronous UI state consistent. State personal scope, problem, constraint, decision, result, and verification boundary. Preserve useful original PDF details. Distinguish observed implementation, author-reported checks, successful CI, and checks performed in this workspace. Keep all PLOG benchmark caveats. Do not claim production performance from synthetic results, team size, user counts, review approval, or test coverage without evidence.

Evidence reviewed for the content revision: authenticated wantkdd GitHub CLI, project-specific code/PRs and authorship; local connector has a different account and restricted installation. MOA source is private: no raw private code or inaccessible source links in the public UI. The other four project repositories are public. Missing deployment/user-feedback facts remain open questions rather than invented content. Preserve the airy design, pointer interactions, reduced-motion behavior and existing responsive coverage.

## Implementation constraints
Next.js App Router, TypeScript, CSS custom properties, local assets/fonts. Minimal client islands; no heavyweight animation dependencies. Browser checks at desktop/mobile, keyboard, filter, route navigation, clipboard, reduced motion. Visual verdict recorded in .omx/state/portfolio/ralph-progress.json (standalone visual-verdict skill is not installed; use documented verdict shape).

## Open questions
- Public production domain not supplied; local preview only. No invented canonical URL.
- User input pending: original PLOG index/benchmark execution artifacts. Until supplied, attribute the comparison to the original PDF, separate from the public repository's CI.
- User input pending: actual service deployment/user feedback and leadership outcomes beyond the authored UMC guide. Do not infer usage or impact metrics from source code.

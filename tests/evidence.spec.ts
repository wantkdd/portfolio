import { test, expect } from "@playwright/test";

test("representative work exposes responsibility before opening a case", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".project-card h3")).toHaveText([
    "MOA",
    "MOAMOA",
    "WhyLog",
    "PLOG",
    "2D Image To CAD",
    "AX-frontier",
    "HSU Reserve",
    "Leafly",
    "EKEC",
    "gotIT",
  ]);
  await expect(page.locator(".project-moa .project-role")).toContainText(
    "백엔드",
  );
  await expect(
    page.locator(".project-moamoa .project-contribution"),
  ).toContainText("계정 캐시");
  await expect(
    page.getByRole("link", { name: "직접 작성한 스터디 운영 가이드" }),
  ).toHaveAttribute("href", /\/commit\/cf7fee/);
});

test("public evidence is connected to cases while private code stays unlinked", async ({
  page,
}) => {
  for (const [slug, repository] of [
    ["moamoa", "UMC-9th-MOAMOA/Front-end"],
    ["whylog", "WhyLog-App/WhyLog"],
    ["plog", "UMC-Plog/Plog-BE"],
    ["leafly", "Leafly-app/client"],
    ["ax-frontier", "AX-frontier/AI"],
    ["hsu-reserve", "wantkdd/hsu-reserve"],
    ["ekec", "EKEC-crew/FE"],
    ["gotit", "ButterWaffle-GotIT/GotIT"],
  ]) {
    await page.goto(`/projects/${slug}`);
    await expect(
      page.getByRole("link", { name: "공개 저장소", exact: true }),
    ).toHaveAttribute("href", `https://github.com/${repository}`);
    const cases = page.locator(".case-study");
    await expect(page.locator(".case-nav a")).toHaveCount(await cases.count());
    for (const article of await cases.all()) {
      await expect(article.locator(".case-verification")).toBeVisible();
    }
    const evidence = page.locator(".case-study .evidence-links a");
    expect(await evidence.count()).toBeGreaterThan(0);
    for (const link of await evidence.all()) {
      expect(await link.getAttribute("href")).toMatch(
        /^https:\/\/github\.com\//,
      );
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
    await page.locator(".case-nav a").first().click();
    await expect(page).toHaveURL(/#case-1$/);
    await expect(page.locator("#case-1 h2")).toBeInViewport();
  }
  await page.goto("/projects/moa");
  await expect(page.locator(".private-source")).toContainText("비공개 저장소");
  await expect(
    page.getByRole("link", { name: "공개 저장소", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('a[href*="MOA-Crew/FE"]')).toHaveCount(0);
  // 기업 비공개 저장소: 공개 저장소 버튼과 GitLab 링크가 없어야 한다.
  await page.goto("/projects/image-to-cad");
  await expect(page.locator(".private-source")).toContainText("비공개 저장소");
  await expect(
    page.getByRole("link", { name: "공개 저장소", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('a[href*="gitlab"]')).toHaveCount(0);
});

test("measurement attribution and known implementation boundaries stay visible", async ({
  page,
}) => {
  await page.goto("/projects/plog");
  await expect(page.getByRole("table")).toContainText("264.02 RPS");
  await expect(page.getByRole("table")).toContainText("499.99 RPS");
  await expect(page.locator("#case-3 .case-verification")).toContainText(
    "원본 포트폴리오",
  );
  await expect(page.locator(".case-note")).toContainText("로컬 합성 데이터");
  await page.goto("/projects/moamoa");
  await expect(page.locator("#case-1 .case-limitation")).toContainText(
    "실패하면 현재 팝업과 큐를 비웁니다",
  );
  await page.goto("/projects/leafly");
  await expect(page.locator("#case-1 .case-limitation")).toContainText(
    "이미지 URI만",
  );
  await page.goto("/projects/image-to-cad");
  await expect(page.getByRole("table")).toContainText("기업 멘토 재현");
  await expect(page.locator("#case-1 .case-limitation")).toContainText("88.7%");
  await expect(page.locator(".case-note")).toContainText(
    "소스 코드는 싣지 않았습니다",
  );
});

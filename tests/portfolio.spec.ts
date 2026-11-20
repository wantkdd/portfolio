import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("project filters and navigation remain usable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(10);
  for (const [area, role, count] of [
    ["Frontend", "frontend", 8],
    ["Backend", "backend", 5],
    ["AI", "ai", 5],
  ] as const) {
    await page.getByRole("button", { name: area, exact: true }).click();
    await expect(page.locator(".project-card")).toHaveCount(count);
    await expect(page.locator(".result-count")).toHaveText(`${count} projects`);
    await expect(
      page.getByRole("button", { name: area, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(new RegExp(`[?&]role=${role}`));
  }
  // 직무별 링크로 들어오면 그 분야가 선택된 상태로 시작한다.
  await page.goto("/?role=ai#work");
  await expect(
    page.getByRole("button", { name: "AI", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".project-card")).toHaveCount(5);
  await page.getByRole("button", { name: /All/ }).click();
  await page.locator("a.project-moa").click();
  await expect(page).toHaveURL(/\/projects\/moa$/);
  await expect(
    page.getByRole("heading", { name: "MOA", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "모든 프로젝트" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  expect(errors).toEqual([]);
});

test("clipboard has success and failure feedback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "이메일 주소 복사" }).click();
  await expect(page.getByText("이메일을 복사했어요.")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "ryusangwan12@gmail.com",
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = () => Promise.reject(new Error("Denied"));
  });
  await page.getByRole("button", { name: "이메일 주소 복사" }).click();
  await expect(
    page.getByText("주소를 선택해 복사하거나 이메일 링크를 눌러주세요."),
  ).toBeVisible();
});

test("keyboard skip link and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "본문으로 건너뛰기" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "프로젝트 둘러보기" }),
  ).toBeFocused();
  expect(
    await page
      .locator(".hero-content")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.getByRole("button", { name: /종이비행기 날려보기/ }).click();
  await expect(page.getByText("작은 호기심을 하늘에 띄웠어요.")).toBeAttached();
  expect(
    await page
      .locator(".paper-plane")
      .evaluate((el) => el.getAnimations().length),
  ).toBe(0);
});

test("paper plane returns after a keyboard-triggered flight", async ({
  page,
}) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /종이비행기 날려보기/ });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator(".hero-flight")).toBeAttached();
  await expect(button).toHaveAttribute("aria-disabled", "false", {
    timeout: 10_000,
  });
  await expect(page.locator(".hero-flight")).toHaveCount(0);
  await expect(button).toBeFocused();
  await expect(
    page.getByText("다시 돌아왔어요. 한 번 더 날려볼까요?"),
  ).toBeAttached();
  expect(
    await page
      .locator(".paper-plane")
      .evaluate((el) => el.getAnimations().length),
  ).toBe(0);
});

test("all detail pages, images, and narrow layouts render", async ({
  page,
}) => {
  for (const [slug, name] of [
    ["moa", "MOA"],
    ["moamoa", "MOAMOA"],
    ["whylog", "WhyLog"],
    ["plog", "PLOG"],
    ["image-to-cad", "2D Image To CAD"],
    ["ax-frontier", "AX-frontier"],
    ["hsu-reserve", "HSU Reserve"],
    ["leafly", "Leafly"],
    ["ekec", "EKEC"],
    ["gotit", "gotIT"],
  ]) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(name);
    await expect(page.locator(".case-study")).not.toHaveCount(0);
    await page.locator(".detail-visual").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator(".detail-visual img")
          .evaluateAll((images) =>
            images.every(
              (image) => (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (slug === "plog")
      await expect(page.locator(".case-note")).toContainText(
        "운영 성능이나 최대 처리량을 보장하지 않습니다",
      );
  }
});

test("WCAG automated scan, full landing images and screenshots", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const image of await page.locator("img").all())
    await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({
    path: `.omx/artifacts/portfolio/${testInfo.project.name}-landing.png`,
    fullPage: true,
  });
  await page.goto("/projects/moa");
  const detail = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(detail.violations).toEqual([]);
  await page.screenshot({
    path: `.omx/artifacts/portfolio/${testInfo.project.name}-detail.png`,
    fullPage: true,
  });
});

test("PDF is downloadable and unknown routes return 404", async ({
  page,
  request,
}) => {
  const pdf = await request.get("/portfolio.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  const response = await page.goto("/projects/missing");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("link", { name: "홈으로 돌아가기" }),
  ).toBeVisible();
});

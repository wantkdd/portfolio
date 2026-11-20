import { test, expect, type Page } from "@playwright/test";

async function layoutProblems(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      problems.push("document horizontal overflow");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.parentElement;
      const text = node.textContent?.trim();
      if (
        !element ||
        !text ||
        element.closest(
          "script,style,.visually-hidden,.skip-link,[aria-hidden=true],.browser-top,.result-count",
        )
      )
        continue;
      if (!element.checkVisibility()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width > 0 && (rect.left < -2 || rect.right > innerWidth + 2)) {
          problems.push(`text outside viewport: ${text.slice(0, 55)}`);
          break;
        }
      }
    }
    for (const [a, b] of [
      [".nav .wordmark", ".nav-links"],
      [".hero-actions a:first-child", ".hero-signature"],
      [".hero-actions a:last-child", ".hero-signature"],
    ]) {
      const first = document.querySelector(a)?.getBoundingClientRect();
      const second = document.querySelector(b)?.getBoundingClientRect();
      if (
        first &&
        second &&
        Math.min(first.right, second.right) -
          Math.max(first.left, second.left) >
          2 &&
        Math.min(first.bottom, second.bottom) -
          Math.max(first.top, second.top) >
          2
      )
        problems.push(`overlap: ${a} / ${b}`);
    }
    return [...new Set(problems)];
  });
}

test("landing and all cases fit, with usable touch controls", async ({
  page,
}, testInfo) => {
  const directory = `.omx/artifacts/responsive/${testInfo.project.name}`;
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect.soft(await layoutProblems(page), "landing layout").toEqual([]);
  const viewport = page.viewportSize()!;
  if (viewport.width >= 550 && viewport.height <= 650) {
    const actionBounds = await page.locator(".hero-actions").boundingBox();
    expect
      .soft(
        actionBounds!.y + actionBounds!.height,
        "landscape CTAs visible before scrolling",
      )
      .toBeLessThanOrEqual(viewport.height);
  }
  await page.screenshot({ path: `${directory}/hero.png`, scale: "css" });
  await page.getByRole("button", { name: "AI", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(5);
  await page.getByRole("button", { name: /All/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(10);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${directory}/work.png`, scale: "css" });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("link", { name: "ryusangwan12@gmail.com" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "이메일 주소 복사" }).click();
  await expect(page.locator(".copy-status")).not.toBeEmpty();
  expect.soft(await layoutProblems(page), "contact with feedback").toEqual([]);
  await page.screenshot({ path: `${directory}/contact.png`, scale: "css" });

  for (const slug of ["moa", "whylog", "leafly", "plog", "moamoa"]) {
    await page.goto(`/projects/${slug}`);
    await page.evaluate(() => document.fonts.ready);
    expect.soft(await layoutProblems(page), `${slug} layout`).toEqual([]);
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
    if (slug === "moamoa")
      await page.screenshot({ path: `${directory}/detail.png`, scale: "css" });
  }

  const transitions =
    testInfo.project.name === "galaxy-z-fold-7-cover"
      ? [
          { width: 984, height: 1016 },
          { width: 1040, height: 932 },
          { width: 360, height: 764 },
        ]
      : testInfo.project.name === "webkit-iphone-duo-outer-portrait-svh"
        ? [
            { width: 669, height: 867 },
            { width: 951, height: 585 },
            { width: 385, height: 571 },
            { width: 382, height: 580 },
          ]
        : [];
  if (transitions.length) {
    await page.goto("/");
    await page.getByRole("button", { name: "AI", exact: true }).click();
    for (const viewport of transitions) {
      await page.setViewportSize(viewport);
      await expect(page.locator(".project-card")).toHaveCount(5);
      await expect(
        page.getByRole("button", { name: "AI", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      expect
        .soft(
          await layoutProblems(page),
          `resized to ${viewport.width}×${viewport.height}`,
        )
        .toEqual([]);
    }
  }
});

import { test, expect } from "@playwright/test";

test("pointer decoration follows input capabilities and keeps links usable", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const hero = page.locator(".hero");
  const sky = page.locator(".sky-image");
  if (isMobile) {
    await page.touchscreen.tap(100, 180);
    await expect(hero).not.toHaveAttribute("data-pointer-active");
    expect(await sky.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
  } else {
    const box = (await hero.boundingBox())!;
    await page.mouse.move(box.width * 0.8, box.height * 0.4, { steps: 6 });
    await expect(hero).toHaveAttribute("data-pointer-active", "true");
    const first = await sky.evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.move(box.width * 0.2, box.height * 0.6, { steps: 6 });
    await expect
      .poll(() => sky.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(first);
    // The stationary title stays put while only the background responds.
    const title = (await page.locator("h1").boundingBox())!;
    await page.mouse.move(box.width * 0.9, box.height * 0.5, { steps: 6 });
    expect((await page.locator("h1").boundingBox())!.x).toBe(title.x);
    await page.mouse.wheel(0, 600);
    await expect(hero).not.toHaveAttribute("data-pointer-active");
  }

  const card = page.locator(".item-whylog");
  await card.scrollIntoViewIfNeeded();
  const visual = card.locator(".project-visual");
  const box = (await visual.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.35, {
    steps: 6,
  });
  if (isMobile) {
    await expect(card).not.toHaveAttribute("data-pointer-active");
    expect(await visual.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
  } else {
    await expect(card).toHaveAttribute("data-pointer-active", "true");
    await expect
      .poll(() =>
        card
          .locator(".pointer-light")
          .evaluate((el) => getComputedStyle(el).opacity),
      )
      .toBe("1");
    await page.screenshot({
      path: ".omx/artifacts/portfolio/pointer-card.png",
    });
  }
  await card.locator("a").click();
  await expect(page).toHaveURL(/\/projects\/whylog$/);
});

test("pointer work stops when idle and resets with motion preference changes", async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { pointerFrameRequests: number };
    state.pointerFrameRequests = 0;
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      state.pointerFrameRequests += 1;
      return original(callback);
    };
  });
  await page.goto("/");
  const hero = page.locator(".hero");
  await page.mouse.move(200, 200, { steps: 5 });
  if (!isMobile)
    await expect(hero).toHaveAttribute("data-pointer-active", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(hero).not.toHaveAttribute("data-pointer-active");
  await page.mouse.move(300, 220, { steps: 5 });
  expect(
    await page
      .locator(".sky-image")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(220, 240, { steps: 5 });
  if (!isMobile)
    await expect(hero).toHaveAttribute("data-pointer-active", "true");
  await expect
    .poll(() =>
      page.locator(".sky-image").evaluate((el) => el.getAnimations().length),
    )
    .toBe(0);
  const readFrames = () =>
    page.evaluate(
      () =>
        (window as typeof window & { pointerFrameRequests: number })
          .pointerFrameRequests,
    );
  const before = await readFrames();
  await page.waitForTimeout(200); // Observe an idle interval, not an animation delay.
  expect(await readFrames()).toBe(before);
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await expect(hero).not.toHaveAttribute("data-pointer-active");
});

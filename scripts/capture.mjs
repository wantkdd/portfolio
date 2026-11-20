import { chromium, devices } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, options] of [
  ["desktop", { viewport: { width: 1440, height: 1000 } }],
  ["mobile", { ...devices["iPhone 13"] }],
  ["narrow", { viewport: { width: 360, height: 800 } }],
]) {
  const page = await browser.newPage({ ...options, reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3100");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `.omx/artifacts/portfolio/${name}-hero.png` });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `.omx/artifacts/portfolio/${name}-contact.png`,
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  console.log(name, JSON.stringify({ overflow, title: await page.title() }));
  await page.close();
}
await browser.close();

// /print 페이지를 A4 PDF로 저장해 public/portfolio.pdf를 갱신한다.
// 사용: 다른 터미널에서 `npm run build && npm run start -- --port 3100` 후 `npm run pdf`
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3100";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.goto(`${base}/print`, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((img) =>
      img.complete
        ? null
        : new Promise((done) => (img.onload = img.onerror = done)),
    ),
  );
});
await page.pdf({
  path: "public/portfolio.pdf",
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log("public/portfolio.pdf");

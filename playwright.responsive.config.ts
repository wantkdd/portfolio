import { defineConfig, devices } from "@playwright/test";

const chromeDevices = [
  "iPhone 13 Mini",
  "iPhone 13",
  "iPhone 16 Pro Max",
  "iPhone 16 landscape",
  "Galaxy S24",
  "Galaxy S24 landscape",
  "Galaxy Z Fold 6 Cover",
  "Galaxy Z Fold 6",
  "Galaxy Z Fold 7 Cover",
  "Galaxy Z Fold 7 Cover landscape",
  "Galaxy Z Fold 7",
  "Galaxy Z Fold 7 landscape",
  "iPad Mini",
  "iPad Mini landscape",
  "iPad Pro 11",
  "iPad Pro 11 landscape",
  "Galaxy Tab S9",
  "Galaxy Tab S9 landscape",
];

// Safari 27.1 viewport bounds, not a hardware/Safari-UI simulation.
// https://webkit.org/blog/18486/webkit-features-for-safari-27-1/
const duoViews = [
  { name: "outer-portrait", width: 382, svh: 580, lvh: 618 },
  { name: "outer-landscape", width: 594, svh: 368, lvh: 406 },
  { name: "inner-portrait", width: 669, svh: 867, lvh: 902 },
  { name: "inner-landscape", width: 951, svh: 585, lvh: 620 },
  { name: "split-window", width: 385, svh: 571, lvh: 609 },
];

export default defineConfig({
  testDir: "./tests/responsive",
  timeout: 60_000,
  fullyParallel: true,
  workers: 2,
  reporter: [
    ["list"],
    ["json", { outputFile: ".omx/artifacts/responsive/results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3100",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [
    ...chromeDevices.map((name) => ({
      name: name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
      use: {
        ...devices[name],
        browserName: "chromium" as const,
        channel: "chrome",
      },
    })),
    ...[
      { name: "compact-320", width: 320, height: 658 },
      { name: "tablet-split-view", width: 507, height: 768 },
    ].map(({ name, width, height }) => ({
      name,
      use: {
        browserName: "chromium" as const,
        channel: "chrome",
        viewport: { width, height },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      },
    })),
    ...[
      "iPhone 13",
      "iPhone 16 landscape",
      "iPad Mini",
      "iPad Pro 11 landscape",
    ].map((name) => ({
      name: `webkit-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
      use: { ...devices[name], browserName: "webkit" as const },
    })),
    ...duoViews.flatMap(({ name, width, svh, lvh }) =>
      ["svh", "lvh"].map((size) => ({
        name: `webkit-iphone-duo-${name}-${size}`,
        use: {
          ...devices["iPhone 13"],
          browserName: "webkit" as const,
          viewport: { width, height: size === "svh" ? svh : lvh },
          screen: { width, height: lvh },
        },
      })),
    ),
  ],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

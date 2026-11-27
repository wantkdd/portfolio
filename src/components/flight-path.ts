import type { CSSProperties } from "react";

// Normalized geometry shared by the drawn trail and the flying comet.
export const beacon = 0.824;

export function trackHeight(x: number, compact: boolean) {
  const bend = Math.sin((x * 1.8 - 0.36) * Math.PI);
  return compact
    ? 0.723 - x * 0.096 + bend * 0.044
    : 0.723 - x * 0.476 + bend * 0.135;
}

/** Reserve the comet head's resting spot on the first paint, before hydration. */
export const beaconVars = {
  "--beacon-x": `${beacon * 100}%`,
  "--desktop-beacon-y": `${trackHeight(beacon, false) * 100}%`,
  "--mobile-beacon-y": `${trackHeight(beacon, true) * 100}%`,
} as CSSProperties;

/**
 * Deep U from off the left edge, through the comet's resting head, out the
 * top right: a parabola with its low point under the headline, so the flight
 * keeps the trail's left-to-right climb.
 */
export function cometPath(progress: number, compact: boolean) {
  const lowX = 0.36;
  const lowY = compact ? 0.74 : 0.64;
  const curve = (lowY - trackHeight(beacon, compact)) / (beacon - lowX) ** 2;
  const x = -0.12 + 1.26 * progress;
  return { x, y: lowY - curve * (x - lowX) ** 2 };
}

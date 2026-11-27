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

/** Gentle U from the comet's resting head, right to left, off the left edge. */
export function cometPath(progress: number, compact: boolean) {
  const startX = beacon;
  const endX = -0.12;
  const startY = trackHeight(beacon, compact);
  const endY = startY - (compact ? 0.05 : 0.08);
  const sag = compact ? 0.09 : 0.24;
  return {
    x: startX + (endX - startX) * progress,
    y: startY + (endY - startY) * progress + sag * Math.sin(Math.PI * progress),
  };
}

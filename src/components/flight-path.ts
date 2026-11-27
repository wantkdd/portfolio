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

/** The comet flies the drawn trail itself: in from the left edge, to rest at its head. */
export function cometPath(progress: number, compact: boolean) {
  const x = -0.06 + (beacon + 0.06) * progress;
  return { x, y: trackHeight(x, compact) };
}

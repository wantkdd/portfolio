// Normalized height of the track, shared by the drawn contrail and the flying 747.
export function trackHeight(x: number, compact: boolean) {
  const bend = Math.sin((x * 1.8 - 0.36) * Math.PI);
  return compact
    ? 0.723 - x * 0.096 + bend * 0.044
    : 0.723 - x * 0.476 + bend * 0.135;
}

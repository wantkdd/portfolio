"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { trackHeight } from "./flight-path";

const beacon = 0.824;
// Reserve the endpoint on the first paint, including before canvas hydration.
const beaconStyle = {
  "--beacon-x": `${beacon * 100}%`,
  "--desktop-beacon-y": `${trackHeight(beacon, false) * 100}%`,
  "--mobile-beacon-y": `${trackHeight(beacon, true) * 100}%`,
} as CSSProperties;

function seededRandom(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function glow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  strength: number,
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${color},${strength})`);
  gradient.addColorStop(0.28, `rgba(${color},${strength * 0.4})`);
  gradient.addColorStop(1, `rgba(${color},0)`);
  context.fillStyle = gradient;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function paintStars(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const random = seededRandom(737);
  const count = Math.round((width * height) / 1750);
  for (let i = 0; i < count; i++) {
    const x = random() * width;
    const y = random() * height * 0.91;
    const brightness = Math.pow(random(), 3);
    const alpha = (0.12 + brightness * 0.76) * (1 - (0.72 * y) / height);
    const radius = 0.36 + brightness * 0.72;
    context.beginPath();
    context.fillStyle = `rgba(226,226,253,${alpha})`;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    if (brightness > 0.925) glow(context, x, y, 3.8, "166,181,245", 0.23);
  }
}

// Rasterize fine vapor threads and ice crystals once. A CSS mask follows the
// plane during flight, so individual particles never need animation frames.
function paintTrail(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  compact: boolean,
) {
  const random = seededRandom(747);
  const thickness = compact ? 0.64 : 1;
  const trail = context.createLinearGradient(0, 0, width, 0);
  trail.addColorStop(0, "#8d80cf00");
  trail.addColorStop(compact ? 0.12 : 0.28, "#a99ce238");
  trail.addColorStop(0.56, "#c6b0ff");
  trail.addColorStop(0.72, "#efbddf");
  trail.addColorStop(beacon, "#fff0d3");
  trail.addColorStop(1, "#ffd8bc");
  context.strokeStyle = trail;
  context.lineCap = "round";

  // Overlapping puffs feather the ice crystals into the evening sky.
  for (let i = 0; i < width * 1.3; i++) {
    const x = random();
    const fade = Math.max(0, (x - 0.18) / 0.7);
    const fan = Math.min(1, Math.abs(x - beacon) * 5);
    const curl = Math.sin(x * 64) * Math.cos(x * 25) * 5;
    const fluff =
      (random() + random() + random() - 1.5) * (3 + 26 * fan) + curl * fan;
    const y = trackHeight(x, compact) * height + fluff * thickness;
    const radius = (3 + random() * 9 + fan * 6) * thickness;
    const tint = x > 0.68 ? "253,187,164" : "176,154,239";
    glow(context, x * width, y, radius, tint, fade * (0.045 + random() * 0.1));
  }

  for (let strand = 0; strand < 25; strand++) {
    const phase = random() * Math.PI * 2;
    const frequency = 6 + random() * 16;
    const offset = random() - 0.5;
    const broad = strand < 4;
    context.lineWidth = broad
      ? (19 - strand * 4) * thickness
      : (0.34 + random() * 1.25) * thickness;
    context.globalAlpha = broad ? 0.039 : 0.035 + random() * 0.11;
    context.beginPath();
    for (let px = 0; px <= width + 5; px += 4) {
      const x = px / width;
      const spread = Math.min(1, Math.abs(x - beacon) * 7.8);
      const drift =
        offset * 19 +
        Math.sin(x * frequency + phase) * 9 +
        Math.sin(x * 45 + phase) * 4;
      const y = trackHeight(x, compact) * height + drift * spread * thickness;
      if (px === 0) context.moveTo(px, y);
      else context.lineTo(px, y);
    }
    context.stroke();
  }
  context.globalAlpha = 1;
  const particles = Math.floor(width * 2.3);
  for (let i = 0; i < particles; i++) {
    const x = random();
    const spread = Math.min(1, Math.abs(x - beacon) * 7.8);
    const scatter = (random() - 0.5) * (random() - 0.5) * 2;
    const y =
      trackHeight(x, compact) * height +
      scatter * (16 + 148 * spread) * thickness;
    const bright = random();
    const alpha = Math.min(1, x * 1.4) * (0.12 + bright * 0.67);
    const color = x > 0.68 ? "255,221,199" : "216,203,255";
    context.fillStyle = `rgba(${color},${alpha})`;
    const radius = (0.3 + bright * bright * 1.15) * thickness;
    context.fillRect(x * width, y, radius, radius);
    if (bright > 0.988 && x > 0.37) {
      glow(context, x * width, y, 7 * thickness, color, 0.42);
      context.strokeStyle = `rgba(${color},${alpha})`;
      context.lineWidth = 0.65;
      const ray = (1.3 + random() * 1.5) * thickness;
      context.beginPath();
      context.moveTo(x * width - ray, y);
      context.lineTo(x * width + ray, y);
      context.moveTo(x * width, y - ray * 1.3);
      context.lineTo(x * width, y + ray * 1.3);
      context.stroke();
    }
  }
}

export function NightSky() {
  const sky = useRef<HTMLDivElement>(null);
  const stars = useRef<HTMLCanvasElement>(null);
  const contrail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = sky.current;
    const starCanvas = stars.current;
    const trailCanvas = contrail.current;
    if (!host || !starCanvas || !trailCanvas) return;
    const paint = () => {
      const { clientWidth: width, clientHeight: height } = host;
      const compact = width <= 700;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      for (const canvas of [starCanvas, trailCanvas]) {
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.scale(scale, scale);
        if (canvas === starCanvas) paintStars(ctx, width, height);
        else paintTrail(ctx, width, height, compact);
      }
    };
    const observer = new ResizeObserver(paint);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="night-sky" ref={sky} style={beaconStyle} aria-hidden="true">
      <canvas ref={stars} className="sky-image" />
      <canvas ref={contrail} className="flight-trail" />
      <div className="trail-beacon" />
    </div>
  );
}

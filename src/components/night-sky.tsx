"use client";

import { useEffect, useRef } from "react";
import { beacon, beaconVars, trackHeight } from "./flight-path";

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

// Rasterize the soft vapor puffs and threads once; they only follow parallax.
function paintHaze(
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
}

type Grain = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  fill: string;
  color: string;
  alpha: number;
  ray: number;
};

// The glittering dust is kept as live particles so the pointer can scatter it.
function makeDust(width: number, height: number, compact: boolean) {
  const random = seededRandom(1747);
  const thickness = compact ? 0.64 : 1;
  const grains: Grain[] = [];
  const count = Math.floor(width * 2.3);
  for (let i = 0; i < count; i++) {
    const x = random();
    const spread = Math.min(1, Math.abs(x - beacon) * 7.8);
    const scatter = (random() - 0.5) * (random() - 0.5) * 2;
    const y =
      trackHeight(x, compact) * height +
      scatter * (16 + 148 * spread) * thickness;
    const bright = random();
    const alpha = Math.min(1, x * 1.4) * (0.12 + bright * 0.67);
    const color = x > 0.68 ? "255,221,199" : "216,203,255";
    const sparkle = bright > 0.988 && x > 0.37;
    grains.push({
      homeX: x * width,
      homeY: y,
      x: x * width,
      y,
      vx: 0,
      vy: 0,
      size: (0.3 + bright * bright * 1.15) * thickness,
      fill: `rgba(${color},${alpha})`,
      color,
      alpha,
      ray: sparkle ? (1.3 + random() * 1.5) * thickness : 0,
    });
  }
  return grains;
}

function paintDust(
  context: CanvasRenderingContext2D,
  grains: Grain[],
  width: number,
  height: number,
  compact: boolean,
) {
  context.clearRect(0, 0, width, height);
  for (const grain of grains) {
    context.fillStyle = grain.fill;
    context.fillRect(grain.x, grain.y, grain.size, grain.size);
  }
  const glowSize = 7 * (compact ? 0.64 : 1);
  context.lineWidth = 0.65;
  for (const grain of grains) {
    if (!grain.ray) continue;
    glow(context, grain.x, grain.y, glowSize, grain.color, 0.42);
    context.strokeStyle = grain.fill;
    context.beginPath();
    context.moveTo(grain.x - grain.ray, grain.y);
    context.lineTo(grain.x + grain.ray, grain.y);
    context.moveTo(grain.x, grain.y - grain.ray * 1.3);
    context.lineTo(grain.x, grain.y + grain.ray * 1.3);
    context.stroke();
  }
}

const reach = 150;
// Must match the trail's parallax factor in globals.css (.hero[data-pointer-active] .flight-trail).
const trailDepth = 0.6;

export function NightSky() {
  const sky = useRef<HTMLDivElement>(null);
  const stars = useRef<HTMLCanvasElement>(null);
  const haze = useRef<HTMLCanvasElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = sky.current;
    const starCanvas = stars.current;
    const hazeCanvas = haze.current;
    const dustCanvas = dust.current;
    const hero = host?.closest<HTMLElement>(".hero");
    if (!host || !hero || !starCanvas || !hazeCanvas || !dustCanvas) return;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let grains: Grain[] = [];
    let dustContext: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let compact = false;
    let frame = 0;
    let last: { x: number; y: number; time: number } | null = null;

    const prepare = (canvas: HTMLCanvasElement, scale: number) => {
      canvas.width = Math.round(canvas.clientWidth * scale);
      canvas.height = Math.round(canvas.clientHeight * scale);
      const context = canvas.getContext("2d");
      context?.scale(scale, scale);
      return context;
    };

    const paint = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      width = host.clientWidth;
      height = host.clientHeight;
      compact = width <= 700;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      // The star field overhangs the hero so large parallax never shows an edge.
      const starContext = prepare(starCanvas, scale);
      if (starContext) {
        paintStars(starContext, starCanvas.clientWidth, starCanvas.clientHeight);
      }
      const hazeContext = prepare(hazeCanvas, scale);
      if (hazeContext) paintHaze(hazeContext, width, height, compact);
      dustContext = prepare(dustCanvas, scale);
      grains = makeDust(width, height, compact);
      if (dustContext) paintDust(dustContext, grains, width, height, compact);
    };

    // Springs pull every scattered grain home; the loop ends once all settle.
    const settle = () => {
      let moving = false;
      for (const grain of grains) {
        const home = grain.x === grain.homeX && grain.y === grain.homeY;
        if (home && !grain.vx && !grain.vy) continue;
        grain.vx = (grain.vx + (grain.homeX - grain.x) * 0.035) * 0.87;
        grain.vy = (grain.vy + (grain.homeY - grain.y) * 0.035) * 0.87;
        grain.x += grain.vx;
        grain.y += grain.vy;
        const resting =
          Math.abs(grain.homeX - grain.x) < 0.08 &&
          Math.abs(grain.homeY - grain.y) < 0.08 &&
          Math.abs(grain.vx) + Math.abs(grain.vy) < 0.05;
        if (resting) {
          grain.x = grain.homeX;
          grain.y = grain.homeY;
          grain.vx = grain.vy = 0;
        } else moving = true;
      }
      if (dustContext) paintDust(dustContext, grains, width, height, compact);
      frame = moving ? requestAnimationFrame(settle) : 0;
    };

    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") return;
      // The trail layer drifts with the sky parallax; hit-test in its frame.
      const shiftX = parseFloat(hero.style.getPropertyValue("--sky-x")) || 0;
      const shiftY = parseFloat(hero.style.getPropertyValue("--sky-y")) || 0;
      const box = host.getBoundingClientRect();
      const x = event.clientX - box.left - shiftX * trailDepth;
      const y = event.clientY - box.top - shiftY * trailDepth;
      const previous = last;
      last = { x, y, time: event.timeStamp };
      if (!previous || event.timeStamp - previous.time > 120) return;
      const dx = x - previous.x;
      const dy = y - previous.y;
      const speed = Math.min(60, Math.hypot(dx, dy));
      if (speed < 0.5) return;
      let touched = false;
      for (const grain of grains) {
        const ox = grain.x - x;
        const oy = grain.y - y;
        if (Math.abs(ox) > reach || Math.abs(oy) > reach) continue;
        const distance = Math.hypot(ox, oy);
        if (distance > reach) continue;
        const falloff = 1 - distance / reach;
        // Push outward, carry a little of the stroke, and add a random swirl.
        const angle =
          Math.atan2(oy, ox) + (Math.random() - 0.5) * 1.4;
        const push = falloff * falloff * (1 + speed * 0.1);
        grain.vx += Math.cos(angle) * push + dx * 0.04 * falloff;
        grain.vy += Math.sin(angle) * push + dy * 0.04 * falloff;
        touched = true;
      }
      if (touched && !frame) frame = requestAnimationFrame(settle);
    };
    const forget = () => {
      last = null;
    };

    const observer = new ResizeObserver(paint);
    observer.observe(host);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", forget);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", forget);
    };
  }, []);

  return (
    <div
      className="night-sky"
      ref={sky}
      style={beaconVars}
      aria-hidden="true"
    >
      <canvas ref={stars} className="sky-image" />
      <div className="flight-trail">
        <canvas ref={haze} className="trail-haze" />
        <canvas ref={dust} className="trail-dust" />
      </div>
    </div>
  );
}

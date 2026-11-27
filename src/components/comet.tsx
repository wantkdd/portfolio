"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { beaconVars, cometPath } from "./flight-path";

const DURATION = 5600;
const FACE_SRC = "/images/comet-face.webp";
const reducedMessage = "혜성이 제자리에서 반짝였어요.";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  color: string;
};

const warm = ["255,244,226", "255,222,196", "255,206,186"];
const cool = ["218,206,255", "196,180,255", "236,214,240"];

function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

// The nucleus is the owner's face inside a glowing coma; no starburst rays.
function drawHead(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  face: HTMLImageElement,
) {
  const reach = 96 * scale;
  const halo = context.createRadialGradient(x, y, 0, x, y, reach);
  halo.addColorStop(0, "rgba(255,246,228,0.95)");
  halo.addColorStop(0.16, "rgba(255,226,200,0.55)");
  halo.addColorStop(0.4, "rgba(222,196,255,0.18)");
  halo.addColorStop(1, "rgba(214,190,255,0)");
  context.fillStyle = halo;
  context.fillRect(x - reach, y - reach, reach * 2, reach * 2);

  const radius = 15 * scale;
  context.globalCompositeOperation = "source-over";
  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = "#fff3e4";
  context.fill();
  if (face.complete && face.naturalWidth) {
    context.clip();
    const side = radius * 2.3;
    context.drawImage(face, x - side / 2, y - side * 0.44, side, side);
  }
  context.restore();
  context.strokeStyle = "rgba(255,238,214,0.9)";
  context.lineWidth = 1.6 * scale;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
  context.globalCompositeOperation = "lighter";
}

export function Comet() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const [message, setMessage] = useState("");
  const flying = hero !== null;

  useEffect(() => {
    const layer = canvas.current;
    const context = layer?.getContext("2d");
    if (!hero || !layer || !context) return;
    let frame = 0;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = (text: string) => {
      cancelAnimationFrame(frame);
      setHero(null);
      setMessage(text);
    };
    const onPreferenceChange = () => {
      if (preference.matches) finish(reducedMessage);
    };
    preference.addEventListener("change", onPreferenceChange);

    const width = hero.clientWidth;
    const height = hero.clientHeight;
    const compact = width <= 700;
    const scale = compact ? 1 : 1.45;
    const face = new Image();
    face.src = FACE_SRC;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    layer.width = Math.round(width * ratio);
    layer.height = Math.round(height * ratio);
    context.scale(ratio, ratio);
    hero.setAttribute("data-comet", "flying");

    const trail: { x: number; y: number }[] = [];
    const sparks: Spark[] = [];
    const start = performance.now();
    let previous = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const step = Math.min(48, now - previous);
      previous = now;
      const t = Math.min(1, elapsed / DURATION);
      // Gentle ease so the dive and the climb through the resting spot read clearly.
      const progress = 0.7 * t + 0.3 * (0.5 - 0.5 * Math.cos(Math.PI * t));
      const point = cometPath(progress, compact);
      const head = { x: point.x * width, y: point.y * height };

      if (t < 1) {
        const last = trail[trail.length - 1];
        trail.push(head);
        if (trail.length > 150) trail.shift();
        const dx = last ? head.x - last.x : -1;
        const dy = last ? head.y - last.y : 0;
        const length = Math.hypot(dx, dy) || 1;
        const emit = compact ? 8 : 16;
        for (let i = 0; i < emit; i++) {
          const back = 0.2 + Math.random() * 1.3;
          const side = (Math.random() - 0.5) * 1.8;
          sparks.push({
            x: head.x + (Math.random() - 0.5) * 14 * scale,
            y: head.y + (Math.random() - 0.5) * 14 * scale,
            vx: (-dx / length) * back + (-dy / length) * side,
            vy: (-dy / length) * back + (dx / length) * side + 0.05,
            age: 0,
            life: 1300 + Math.random() * 1700,
            size: (0.6 + Math.random() * 1.7) * scale,
            color: Math.random() < 0.45 ? pick(warm) : pick(cool),
          });
        }
      } else if (trail.length) {
        trail.shift();
      }

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";
      // A real comet tail is narrow and hot at the head and fans out, cooler, behind it.
      for (let i = 1; i < trail.length; i++) {
        const near = i / trail.length;
        const far = 1 - near;
        const from = trail[i - 1];
        const to = trail[i];
        const layers: [string, number, number][] = [
          ["190,170,255", (10 + far * 46) * scale, 0.035 * Math.pow(near, 0.8)],
          [
            near > 0.55 ? "255,214,190" : "205,186,255",
            (4 + far * 14) * scale,
            0.16 * Math.pow(near, 1.6),
          ],
          ["255,248,236", (0.8 + near * 2.8) * scale, 0.75 * Math.pow(near, 2.5)],
        ];
        for (const [color, lineWidth, alpha] of layers) {
          context.strokeStyle = `rgba(${color},${alpha})`;
          context.lineWidth = lineWidth;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          context.stroke();
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.age += step;
        if (spark.age >= spark.life) {
          sparks.splice(i, 1);
          continue;
        }
        spark.x += spark.vx * (step / 16);
        spark.y += spark.vy * (step / 16);
        spark.vx *= 0.985;
        spark.vy *= 0.985;
        const fade = 1 - spark.age / spark.life;
        const twinkle = 0.55 + 0.45 * Math.sin(spark.age / 70 + spark.life);
        context.fillStyle = `rgba(${spark.color},${fade * twinkle})`;
        context.fillRect(spark.x, spark.y, spark.size, spark.size);
      }

      if (t < 1) drawHead(context, head.x, head.y, scale, face);
      context.globalCompositeOperation = "source-over";

      if (t < 1 || sparks.length || trail.length) {
        frame = requestAnimationFrame(tick);
      } else {
        finish("혜성이 지나갔어요.");
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", onPreferenceChange);
      hero.removeAttribute("data-comet");
    };
  }, [hero]);

  return (
    <div className="hero-signature" style={beaconVars}>
      <button
        className="comet-head"
        type="button"
        aria-label="혜성 날려보기"
        aria-disabled={flying}
        onClick={(event) => {
          if (flying) return;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setMessage(reducedMessage);
            return;
          }
          setHero(event.currentTarget.closest<HTMLElement>(".hero"));
          setMessage("혜성이 하늘을 가로질러 날아갑니다.");
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Tiny decorative cutout; the flight canvas reuses the cached file. */}
        <img className="comet-face" src={FACE_SRC} alt="" aria-hidden="true" />
      </button>
      <span className="visually-hidden" role="status">
        {message}
      </span>
      {hero &&
        createPortal(
          <canvas ref={canvas} className="comet-layer" aria-hidden="true" />,
          hero,
        )}
    </div>
  );
}

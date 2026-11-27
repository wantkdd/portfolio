"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { beaconVars, cometPath } from "./flight-path";

const DURATION = 5200;
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
  ray: boolean;
};

const warm = ["255,244,226", "255,222,196", "255,206,186"];
const cool = ["218,206,255", "196,180,255", "236,214,240"];

function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function drawHead(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  flicker: number,
) {
  const reach = 72 * scale;
  const halo = context.createRadialGradient(x, y, 0, x, y, reach);
  halo.addColorStop(0, "rgba(255,248,232,1)");
  halo.addColorStop(0.08, "rgba(255,230,204,0.7)");
  halo.addColorStop(0.3, "rgba(226,196,255,0.2)");
  halo.addColorStop(1, "rgba(214,190,255,0)");
  context.fillStyle = halo;
  context.fillRect(x - reach, y - reach, reach * 2, reach * 2);
  context.strokeStyle = "rgba(255,246,230,0.9)";
  context.lineWidth = 1.3 * scale;
  const long = (46 + flicker * 8) * scale;
  const short = (28 + flicker * 5) * scale;
  context.beginPath();
  context.moveTo(x - long, y);
  context.lineTo(x + long, y);
  context.moveTo(x, y - short);
  context.lineTo(x, y + short);
  context.stroke();
  context.fillStyle = "#fffdf6";
  context.beginPath();
  context.arc(x, y, 4.2 * scale, 0, Math.PI * 2);
  context.fill();
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
    const scale = compact ? 0.72 : 1;
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
      // Ease out of the resting spot, then glide at a steady pace.
      const progress = 0.4 * t + 0.6 * (0.5 - 0.5 * Math.cos(Math.PI * t));
      const point = cometPath(progress, compact);
      const head = { x: point.x * width, y: point.y * height };

      if (t < 1) {
        const last = trail[trail.length - 1];
        trail.push(head);
        if (trail.length > 130) trail.shift();
        const dx = last ? head.x - last.x : -1;
        const dy = last ? head.y - last.y : 0;
        const length = Math.hypot(dx, dy) || 1;
        const emit = compact ? 6 : 12;
        for (let i = 0; i < emit; i++) {
          const back = 0.2 + Math.random() * 1.2;
          const side = (Math.random() - 0.5) * 1.6;
          sparks.push({
            x: head.x + (Math.random() - 0.5) * 8 * scale,
            y: head.y + (Math.random() - 0.5) * 8 * scale,
            vx: (-dx / length) * back + (-dy / length) * side,
            vy: (-dy / length) * back + (dx / length) * side + 0.05,
            age: 0,
            life: 1200 + Math.random() * 1600,
            size: (0.5 + Math.random() * 1.6) * scale,
            color: Math.random() < 0.45 ? pick(warm) : pick(cool),
            ray: Math.random() < 0.045,
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
        if (spark.ray) {
          const ray = (2 + fade * 4) * scale;
          context.strokeStyle = `rgba(${spark.color},${fade * 0.7})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(spark.x - ray, spark.y);
          context.lineTo(spark.x + ray, spark.y);
          context.moveTo(spark.x, spark.y - ray);
          context.lineTo(spark.x, spark.y + ray);
          context.stroke();
        }
      }

      if (t < 1) drawHead(context, head.x, head.y, scale, Math.sin(now / 90));
      context.globalCompositeOperation = "source-over";

      if (t < 1 || sparks.length || trail.length) {
        frame = requestAnimationFrame(tick);
      } else {
        finish("혜성이 지나갔어요. 다시 눌러 보세요.");
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
        <span className="comet-star" aria-hidden="true" />
      </button>
      {!flying && !message && (
        <span className="comet-hint" aria-hidden="true">
          혜성을 눌러 보세요
        </span>
      )}
      <span
        className={flying ? "visually-hidden" : "flight-status"}
        role="status"
      >
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

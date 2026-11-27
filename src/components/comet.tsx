"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { beaconVars, cometPath } from "./flight-path";

const DURATION = 4200;
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

/** Bake the cutout once with its neckline faded out, so it has no hard edge. */
function fadeFace(face: HTMLImageElement) {
  const sprite = document.createElement("canvas");
  sprite.width = face.naturalWidth;
  sprite.height = face.naturalHeight;
  const context = sprite.getContext("2d");
  if (!context) return null;
  context.drawImage(face, 0, 0);
  const fade = context.createLinearGradient(0, 0, 0, sprite.height);
  fade.addColorStop(0.6, "#000");
  fade.addColorStop(0.92, "transparent");
  context.globalCompositeOperation = "destination-in";
  context.fillStyle = fade;
  context.fillRect(0, 0, sprite.width, sprite.height);
  return sprite;
}

// The nucleus is the owner's cutout face riding inside a glowing coma.
function drawHead(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  face: HTMLCanvasElement | null,
) {
  const reach = 96 * scale;
  const halo = context.createRadialGradient(x, y, 0, x, y, reach);
  halo.addColorStop(0, "rgba(255,246,228,0.9)");
  halo.addColorStop(0.16, "rgba(255,226,200,0.5)");
  halo.addColorStop(0.4, "rgba(222,196,255,0.18)");
  halo.addColorStop(1, "rgba(214,190,255,0)");
  context.fillStyle = halo;
  context.fillRect(x - reach, y - reach, reach * 2, reach * 2);
  if (!face) return;
  // Same size as the idle face, so the hand-off at the resting spot is seamless.
  const height = 46;
  const width = (height * face.width) / face.height;
  context.globalCompositeOperation = "source-over";
  context.drawImage(face, x - width / 2, y - height * 0.55, width, height);
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
    const scale = compact ? 1 : 1.2;
    let faceSprite: HTMLCanvasElement | null = null;
    const face = new Image();
    face.onload = () => {
      faceSprite = fadeFace(face);
    };
    face.src = FACE_SRC;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    layer.width = Math.round(width * ratio);
    layer.height = Math.round(height * ratio);
    context.scale(ratio, ratio);
    hero.setAttribute("data-comet", "flying");

    const sparks: Spark[] = [];
    const start = performance.now();
    let previous = start;
    let last: { x: number; y: number } | null = null;

    const tick = (now: number) => {
      const elapsed = now - start;
      const step = Math.min(48, now - previous);
      previous = now;
      const t = Math.min(1, elapsed / DURATION);
      // Ease out so the comet settles onto its resting spot instead of overshooting.
      const progress = 1 - Math.pow(1 - t, 2.2);
      const point = cometPath(progress, compact);
      const head = { x: point.x * width, y: point.y * height };
      // Reveal the existing trail (and its live, scatterable dust) up to the head.
      hero.style.setProperty("--wake-x", `${head.x}px`);

      if (t < 1) {
        const dx = last ? head.x - last.x : 1;
        const dy = last ? head.y - last.y : 0;
        const length = Math.hypot(dx, dy) || 1;
        last = head;
        const emit = compact ? 3 : 5;
        for (let i = 0; i < emit; i++) {
          const back = 0.2 + Math.random() * 1.1;
          const side = (Math.random() - 0.5) * 1.4;
          sparks.push({
            x: head.x + (Math.random() - 0.5) * 10 * scale,
            y: head.y + (Math.random() - 0.5) * 10 * scale,
            vx: (-dx / length) * back + (-dy / length) * side,
            vy: (-dy / length) * back + (dx / length) * side,
            age: 0,
            life: 500 + Math.random() * 700,
            size: (0.6 + Math.random() * 1.5) * scale,
            color: Math.random() < 0.5 ? pick(warm) : pick(cool),
          });
        }
      }

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.age += step;
        if (spark.age >= spark.life) {
          sparks.splice(i, 1);
          continue;
        }
        spark.x += spark.vx * (step / 16);
        spark.y += spark.vy * (step / 16);
        spark.vx *= 0.97;
        spark.vy *= 0.97;
        const fade = 1 - spark.age / spark.life;
        const twinkle = 0.55 + 0.45 * Math.sin(spark.age / 70 + spark.life);
        context.fillStyle = `rgba(${spark.color},${fade * twinkle})`;
        context.fillRect(spark.x, spark.y, spark.size, spark.size);
      }
      drawHead(context, head.x, head.y, scale, faceSprite);
      context.globalCompositeOperation = "source-over";

      // Hold on the resting spot until the last sparks fade, then hand back to the idle head.
      if (t < 1 || sparks.length) {
        frame = requestAnimationFrame(tick);
      } else {
        finish("혜성이 제자리로 돌아왔어요.");
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", onPreferenceChange);
      hero.removeAttribute("data-comet");
      hero.style.removeProperty("--wake-x");
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

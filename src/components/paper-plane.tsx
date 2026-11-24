"use client";

import { Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { trackHeight } from "./flight-path";

const DURATION = 6500;
const PLANE_RATIO = 479 / 1400;
const reducedMessage = "작은 호기심을 하늘에 띄웠어요.";

export function PaperPlane() {
  const flyer = useRef<HTMLDivElement>(null);
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const [message, setMessage] = useState("");
  const flying = hero !== null;

  useEffect(() => {
    const plane = flyer.current;
    if (!hero || !plane) return;
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
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const t = 0.55 * progress + 0.45 * Math.sin((Math.PI * progress) / 2);
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      const compact = width <= 700;
      const planeWidth = Math.max(160, Math.min(width * 0.38, 530));
      const left = -planeWidth + (width + planeWidth * 1.12) * t;
      const center = (left + planeWidth / 2) / width;
      const y = trackHeight(center, compact) * height;
      const slope =
        ((trackHeight(center + 0.001, compact) -
          trackHeight(center - 0.001, compact)) *
          height) /
        (width * 0.002);
      const angle = Math.max(
        -14,
        Math.min(14, (Math.atan(slope) * 180) / Math.PI),
      );
      plane.style.width = `${planeWidth}px`;
      plane.style.transform = `translate3d(${left}px, ${y - (planeWidth * PLANE_RATIO) / 2}px, 0) rotate(${angle}deg)`;
      hero.style.setProperty("--wake-x", `${left + planeWidth * 0.35}px`);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish("다시 돌아왔어요. 한 번 더 날려볼까요?");
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", onPreferenceChange);
      hero.style.removeProperty("--wake-x");
    };
  }, [hero]);

  return (
    <div className="hero-signature">
      <button
        className="plane-button"
        type="button"
        aria-label="비행기 띄우기 · 종이비행기 날려보기"
        aria-disabled={flying}
        onClick={(event) => {
          if (flying) return;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setMessage(reducedMessage);
            return;
          }
          setHero(event.currentTarget.closest<HTMLElement>(".hero"));
          setMessage("비행기가 하늘을 가로질러 날아갑니다.");
        }}
      >
        <Plane size={17} className="paper-plane" aria-hidden="true" />
        <span>{flying ? "비행 중" : "비행기 띄우기"}</span>
        <small aria-hidden="true">6.5s</small>
      </button>
      <span
        className={flying ? "visually-hidden" : "flight-status"}
        role="status"
      >
        {message}
      </span>
      {hero &&
        createPortal(
          <div className="flight-layer" aria-hidden="true">
            <div ref={flyer} className="hero-flight">
              <span className="hero-flight-glow" />
              {/* eslint-disable-next-line @next/next/no-img-element -- Small original sprites mounted only while flying. */}
              <img
                className="hero-flight-plane"
                src="/images/airplane.webp"
                width="1400"
                height="479"
                alt=""
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- The rider is positioned on the moving cutout. */}
              <img
                className="hero-flight-rider"
                src="/images/rider.webp"
                alt=""
              />
            </div>
          </div>,
          hero,
        )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal, preload } from "react-dom";

// 누르면 히어로 뒤 하늘을 비행기가 왼쪽 끝에서 오른쪽 끝까지 가로지른다.
// 비행기는 글자 뒤(하늘 배경 위) 층에 그려 문구를 가리지 않는다.
const DURATION = 6500;
// public/images/airplane.webp 의 가로세로 비율
const PLANE_RATIO = 479 / 1400;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export function PaperPlane() {
  preload("/images/airplane.webp", { as: "image" });
  preload("/images/rider.webp", { as: "image" });
  const flyer = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const [flying, setFlying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  // 비행기 층이 화면에 붙은 뒤에 애니메이션을 시작한다.
  useEffect(() => {
    if (!flying || !hero || !flyer.current) return;
    const el = flyer.current;
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    const planeWidth = Math.min(Math.max(width * 0.62, 360), 980);
    const planeHeight = planeWidth * PLANE_RATIO;
    el.style.width = `${planeWidth}px`;
    const start = performance.now();
    // 왼쪽 밖에서 출발해 완만한 물결을 그리며 오른쪽 밖으로 빠진다.
    const x = (t: number) => -planeWidth + (width + planeWidth * 2) * t;
    const y = (t: number) =>
      height * (0.5 - 0.22 * t) +
      height * 0.06 * Math.sin(t * Math.PI * 2) -
      planeHeight / 2;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const t = 0.15 * progress + 0.85 * easeInOutSine(progress);
      const dt = 0.001;
      const angle =
        (Math.atan2(y(t + dt) - y(t - dt), x(t + dt) - x(t - dt)) * 180) /
        Math.PI;
      el.style.transform = `translate3d(${x(t)}px, ${y(t)}px, 0) rotate(${angle}deg)`;
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      frame.current = null;
      setFlying(false);
      setMessage("다시 돌아왔어요. 한 번 더 날려볼까요?");
    };
    frame.current = requestAnimationFrame(tick);
  }, [flying, hero]);

  function fly() {
    if (flying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMessage("작은 호기심을 하늘에 띄웠어요.");
      return;
    }
    setHero(document.querySelector<HTMLElement>(".hero"));
    setFlying(true);
    setMessage("비행기가 하늘을 가로질러 날아갑니다.");
  }

  return (
    <div className="hero-signature">
      <button
        type="button"
        className="plane-button"
        onClick={fly}
        aria-disabled={flying}
      >
        <svg
          width="156"
          height="93"
          viewBox="0 0 156 93"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 83C52 80 43 25 74 35C116 50 69 76 73 45C76 23 103 14 124 13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 5"
          />
          <g className="paper-plane">
            <path
              d="m122 13 28-10-12 27-5-12-11-5Z"
              fill="#edf8fe"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="m133 18 17-15" stroke="currentColor" />
          </g>
        </svg>
        <span>A little curiosity goes a long way.</span>
        <small>click to fly ↗</small>
        <span className="visually-hidden">종이비행기 날려보기</span>
      </button>
      <span className="visually-hidden" role="status">
        {message}
      </span>
      {flying &&
        hero &&
        createPortal(
          <div ref={flyer} className="hero-flight" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- 애니메이션 중에만 붙는 장식 이미지 */}
            <img
              className="hero-flight-plane"
              src="/images/airplane.webp"
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- 탑승자(누끼 사진), npm run portrait로 갱신 */}
            <img
              className="hero-flight-rider"
              src="/images/rider.webp"
              alt=""
            />
          </div>,
          hero,
        )}
    </div>
  );
}

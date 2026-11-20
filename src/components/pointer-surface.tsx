"use client";

import { useEffect, useRef, type ReactNode } from "react";

const properties = ["--tilt-x", "--tilt-y", "--sky-x", "--sky-y"];

/** Progressive decoration: content and link hit areas never move. */
export function PointerSurface({
  children,
  className,
  effect,
  labelledBy,
}: {
  children: ReactNode;
  className: string;
  effect: "sky" | "card";
  labelledBy?: string;
}) {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const surface = root.current;
    if (!surface) return;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let active = false;
    let clientX = 0;
    let clientY = 0;

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!active || !surface) return;
      active = false;
      delete surface.dataset.pointerActive;
      // Keep the last light position while opacity fades; reset only motion.
      properties.forEach((name) => surface.style.removeProperty(name));
    }

    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== "mouse") {
        reset();
        return;
      }
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!surface || !media.matches) return;
        // Measure the stationary wrapper, never its transformed image.
        const box = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - box.left, box.width));
        const y = Math.max(0, Math.min(clientY - box.top, box.height));
        const horizontal = (x / box.width) * 2 - 1;
        const vertical = (y / box.height) * 2 - 1;
        if (effect === "sky") {
          surface.style.setProperty(
            "--sky-x",
            `${-horizontal * Math.min(12, box.width * 0.018)}px`,
          );
          surface.style.setProperty("--sky-y", `${-vertical * 8}px`);
        } else {
          surface.style.setProperty("--pointer-x", `${x}px`);
          surface.style.setProperty("--pointer-y", `${y}px`);
          surface.style.setProperty("--tilt-x", `${-vertical * 3}deg`);
          surface.style.setProperty("--tilt-y", `${horizontal * 3}deg`);
        }
        surface.dataset.pointerActive = "true";
        active = true;
      });
    }

    function pointerDown(event: PointerEvent) {
      if (event.pointerType !== "mouse") reset();
    }

    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerleave", reset);
    surface.addEventListener("pointercancel", reset);
    surface.addEventListener("pointerdown", pointerDown, { passive: true });
    window.addEventListener("keydown", reset);
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    media.addEventListener("change", reset);
    return () => {
      reset();
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", reset);
      surface.removeEventListener("pointercancel", reset);
      surface.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      media.removeEventListener("change", reset);
    };
  }, [effect]);

  const Tag = effect === "sky" ? "section" : "div";
  return (
    <Tag
      ref={(node) => {
        root.current = node;
      }}
      className={className}
      data-pointer-effect={effect}
      aria-labelledby={labelledBy}
    >
      {children}
    </Tag>
  );
}

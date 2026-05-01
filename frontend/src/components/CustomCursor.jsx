import { useEffect, useRef, useState } from "react";

/**
 * Premium custom cursor — peacock-gradient dot that morphs into a larger
 * glass ring over interactive elements. Desktop only + respects pointer:fine.
 */
export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    document.body.style.cursor = "none";

    let rafId;
    const dotPos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const target  = { x: -100, y: -100 };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const loop = () => {
      // ring eases toward target, dot snaps
      dotPos.x = target.x;
      dotPos.y = target.y;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      if (dotRef.current)  dotRef.current.style.transform  = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
      rafId = requestAnimationFrame(loop);
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const interactive = t.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      setHovering(Boolean(interactive));
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering]);

  if (!enabled) return null;

  return (
    <>
      {/* outer ring — morphs on hover */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: "9999px",
          pointerEvents: "none",
          zIndex: 9999,
          border: hovering ? "1.5px solid rgba(236,72,153,0.75)" : "1.5px solid rgba(24,24,27,0.35)",
          backgroundColor: hovering ? "rgba(236,72,153,0.05)" : "transparent",
          backdropFilter: hovering ? "blur(4px)" : "none",
          transition: "border 180ms ease, background-color 180ms ease, width 180ms ease, height 180ms ease",
          mixBlendMode: "normal",
          willChange: "transform",
        }}
      />
      {/* inner dot — peacock gradient */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          borderRadius: "9999px",
          pointerEvents: "none",
          zIndex: 10000,
          background: "linear-gradient(135deg, #9D4CDD, #3B82F6, #F97316, #EC4899)",
          boxShadow: "0 0 12px rgba(236,72,153,0.55)",
          transition: "width 120ms ease, height 120ms ease",
          willChange: "transform",
        }}
      />
    </>
  );
};

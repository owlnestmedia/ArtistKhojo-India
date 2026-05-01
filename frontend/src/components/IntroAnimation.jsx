import { useEffect, useState } from "react";
import { REAL_LOGO_URL } from "./Logo";

/**
 * Cinematic intro: real ArtistKhojo logo + brand sweep + tagline.
 * Plays once per session.
 */
export const IntroAnimation = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("ak_intro_seen");
  });
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setExit(true), 2900);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("ak_intro_seen", "1");
      setVisible(false);
    }, 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      data-testid="intro-animation"
      className={`fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center overflow-hidden transition-transform duration-[900ms] ${exit ? "-translate-y-full" : ""}`}
      style={{ willChange: "transform", transitionTimingFunction: "cubic-bezier(.8,.05,.2,1)" }}
    >
      {/* Drifting colour blobs */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[46rem] h-[46rem] rounded-full bg-gradient-to-br from-[#9D4CDD] via-[#3B82F6] to-transparent blur-3xl ak-intro-blob-1" />
        <div className="absolute -bottom-40 -right-40 w-[46rem] h-[46rem] rounded-full bg-gradient-to-br from-[#F97316] via-[#EC4899] to-transparent blur-3xl ak-intro-blob-2" />
      </div>

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* REAL logo */}
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-[#9D4CDD]/50 via-[#3B82F6]/40 to-[#EC4899]/50 ak-intro-glow" />
          <img
            src={REAL_LOGO_URL}
            alt="ArtistKhojo"
            className="relative ak-intro-logo"
            style={{ width: "clamp(240px, 34vw, 440px)", height: "auto" }}
            draggable="false"
          />
        </div>

        {/* Sweeping gradient bar */}
        <div className="relative h-[2px] w-64 bg-white/10 overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] via-[#F97316] to-[#EC4899] ak-intro-sweep" />
        </div>

        {/* Tagline */}
        <div className="ak-intro-tag text-white/60 text-xs uppercase tracking-[0.38em] font-medium text-center">
          Skilled Indians ka Single Platform
        </div>
      </div>

      <style>{`
        @keyframes akIntroLogoIn {
          0%   { transform: scale(0.72); opacity: 0; filter: blur(14px); }
          60%  { transform: scale(1.04); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes akIntroGlow {
          0%   { opacity: 0; transform: scale(0.8); }
          60%  { opacity: 0.9; transform: scale(1.15); }
          100% { opacity: 0.55; transform: scale(1); }
        }
        @keyframes akIntroTag {
          0%,55%  { opacity: 0; letter-spacing: 0.12em; }
          100%    { opacity: 1; letter-spacing: 0.38em; }
        }
        @keyframes akIntroSweep {
          0%   { left: -50%; }
          100% { left: 100%; }
        }
        @keyframes akIntroBlob1 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(60px,40px,0) scale(1.1); }
        }
        @keyframes akIntroBlob2 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(-60px,-40px,0) scale(1.15); }
        }

        .ak-intro-logo      { animation: akIntroLogoIn 1.4s cubic-bezier(.2,.7,.2,1) forwards; transform-origin: center; opacity: 0; }
        .ak-intro-glow      { animation: akIntroGlow 1.6s cubic-bezier(.2,.7,.2,1) forwards .15s; opacity: 0; }
        .ak-intro-tag       { animation: akIntroTag 1.1s ease forwards 1.6s; opacity: 0; }
        .ak-intro-sweep     { animation: akIntroSweep 1.8s ease-in-out 1.1s forwards; }
        .ak-intro-blob-1    { animation: akIntroBlob1 6s ease-in-out infinite; }
        .ak-intro-blob-2    { animation: akIntroBlob2 7s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ak-intro-logo, .ak-intro-glow, .ak-intro-tag, .ak-intro-sweep {
            animation-duration: .01ms !important;
            animation-delay: 0s !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

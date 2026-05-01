import { useEffect, useRef, useState } from "react";
import { REAL_LOGO_URL } from "./Logo";

/**
 * 5-act cinematic intro (~6s total). Plays once per session.
 *
 * Act 1 (0.0-0.8s)  — Dark scene + light rays sweep, blobs drift
 * Act 2 (0.8-2.0s)  — Conic ring rotates, real logo scales in with glow burst
 * Act 3 (2.0-3.0s)  — Brand gradient bar sweeps, wordmark subtle shine
 * Act 4 (3.0-4.6s)  — Category showreel flickers ("Musician → Painter → …You.")
 * Act 5 (4.6-5.8s)  — Tagline settles, scene slides up to reveal site
 */
export const IntroAnimation = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("ak_intro_seen");
  });
  const [exit, setExit] = useState(false);
  const [showreelIdx, setShowreelIdx] = useState(0);

  const showreel = ["Musician.", "Painter.", "Photographer.", "Influencer.", "Dancer.", "Writer.", "You."];

  useEffect(() => {
    if (!visible) return;
    // Cycle showreel during Act 4 (3.0s–4.6s → ~220ms per word)
    const reel = setInterval(() => {
      setShowreelIdx((i) => (i + 1) % showreel.length);
    }, 220);
    const reelStop = setTimeout(() => clearInterval(reel), 4600);

    const t1 = setTimeout(() => setExit(true), 5200);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("ak_intro_seen", "1");
      setVisible(false);
    }, 6200);
    return () => {
      clearInterval(reel);
      clearTimeout(reelStop);
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Particles (generated once)
  const particles = useRef(
    Array.from({ length: 32 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      size: 1 + Math.random() * 3,
      dur: 6 + Math.random() * 6,
      hue: ["#9D4CDD", "#3B82F6", "#F97316", "#EC4899"][i % 4],
    }))
  ).current;

  if (!visible) return null;

  return (
    <div
      data-testid="intro-animation"
      className={`fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center overflow-hidden transition-transform duration-[1100ms] ${exit ? "-translate-y-full" : ""}`}
      style={{ willChange: "transform", transitionTimingFunction: "cubic-bezier(.76,0,.24,1)" }}
    >
      {/* Act 1 – drifting colour blobs */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[52rem] h-[52rem] rounded-full bg-gradient-to-br from-[#9D4CDD] via-[#3B82F6] to-transparent blur-3xl ak-intro-blob-1" />
        <div className="absolute -bottom-48 -right-48 w-[52rem] h-[52rem] rounded-full bg-gradient-to-br from-[#F97316] via-[#EC4899] to-transparent blur-3xl ak-intro-blob-2" />
      </div>

      {/* Act 1 – light rays from top */}
      <div className="absolute inset-0 pointer-events-none ak-rays">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "conic-gradient(from 200deg at 50% -10%, transparent 0deg, rgba(255,255,255,0.12) 10deg, transparent 20deg, transparent 80deg, rgba(255,255,255,0.08) 90deg, transparent 100deg)",
          }}
        />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-[-10%] rounded-full ak-particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.hue,
              boxShadow: `0 0 6px ${p.hue}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* CENTRE STAGE */}
      <div className="relative flex flex-col items-center gap-10">
        {/* Logo + rotating conic ring */}
        <div className="relative" style={{ width: "clamp(280px, 30vw, 380px)", height: "clamp(280px, 30vw, 380px)" }}>
          {/* Rotating conic ring */}
          <div
            className="absolute inset-0 rounded-full ak-intro-ring"
            style={{
              background:
                "conic-gradient(from 0deg, #9D4CDD, #3B82F6, #F97316, #EC4899, #9D4CDD)",
              mask: "radial-gradient(circle, transparent 60%, #000 61%, #000 66%, transparent 67%)",
              WebkitMask: "radial-gradient(circle, transparent 60%, #000 61%, #000 66%, transparent 67%)",
            }}
          />
          {/* Halo glow */}
          <div className="absolute inset-8 rounded-full blur-3xl bg-gradient-to-br from-[#9D4CDD]/60 via-[#3B82F6]/40 to-[#EC4899]/60 ak-intro-glow" />
          {/* Real logo */}
          <img
            src={REAL_LOGO_URL}
            alt="ArtistKhojo"
            className="absolute inset-10 m-auto ak-intro-logo"
            style={{ width: "80%", height: "80%", objectFit: "contain" }}
            draggable="false"
          />
        </div>

        {/* Brand sweep bar */}
        <div className="relative h-[2px] w-80 bg-white/10 overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] via-[#F97316] to-[#EC4899] ak-intro-sweep" />
        </div>

        {/* Showreel — Act 4 */}
        <div className="h-10 flex items-baseline gap-3 font-display text-white text-2xl sm:text-4xl">
          <span className="text-white/60 ak-intro-prefix">Find your</span>
          <span className="relative inline-block min-w-[8ch]">
            <span key={showreelIdx} className="ak-intro-reel font-display-italic ak-brand-gradient-text">
              {showreel[showreelIdx]}
            </span>
          </span>
        </div>

        {/* Tagline — Act 5 */}
        <div className="ak-intro-tag text-white/60 text-xs uppercase tracking-[0.38em] font-medium text-center">
          Skilled Indians ka Single Platform
        </div>
      </div>

      <style>{`
        @keyframes akIntroLogoIn {
          0%   { transform: scale(0.55); opacity: 0; filter: blur(16px); }
          60%  { transform: scale(1.06); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes akIntroGlow {
          0%   { opacity: 0; transform: scale(0.7); }
          55%  { opacity: 0.95; transform: scale(1.25); }
          100% { opacity: 0.55; transform: scale(1); }
        }
        @keyframes akIntroRing {
          0%   { opacity: 0; transform: rotate(-180deg) scale(0.7); }
          50%  { opacity: 1; transform: rotate(0deg) scale(1); }
          100% { opacity: 1; transform: rotate(360deg) scale(1); }
        }
        @keyframes akIntroSweep {
          0%   { left: -50%; }
          100% { left: 100%; }
        }
        @keyframes akIntroReel {
          0%   { opacity: 0; transform: translateY(10px); filter: blur(6px); }
          40%  { opacity: 1; transform: translateY(0); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes akIntroTag {
          0%,75%  { opacity: 0; letter-spacing: 0.12em; }
          100%    { opacity: 1; letter-spacing: 0.38em; }
        }
        @keyframes akIntroPrefix {
          0%,60% { opacity: 0; transform: translateY(8px); }
          100%   { opacity: 1; transform: translateY(0); }
        }
        @keyframes akIntroBlob1 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(60px,40px,0) scale(1.12); }
        }
        @keyframes akIntroBlob2 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(-60px,-40px,0) scale(1.15); }
        }
        @keyframes akRays {
          0%   { opacity: 0; transform: rotate(-6deg); }
          40%  { opacity: 1; transform: rotate(4deg); }
          100% { opacity: 0.6; transform: rotate(0deg); }
        }
        @keyframes akParticle {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
        }

        .ak-intro-logo      { animation: akIntroLogoIn 1.2s cubic-bezier(.2,.7,.2,1) forwards .6s; opacity: 0; }
        .ak-intro-glow      { animation: akIntroGlow 1.8s cubic-bezier(.2,.7,.2,1) forwards .4s; opacity: 0; }
        .ak-intro-ring      { animation: akIntroRing 6s cubic-bezier(.5,.1,.5,.9) forwards .3s; opacity: 0; }
        .ak-intro-sweep     { animation: akIntroSweep 2s ease-in-out 2s forwards; }
        .ak-intro-reel      { display: inline-block; animation: akIntroReel .22s ease forwards; }
        .ak-intro-tag       { animation: akIntroTag 1.1s ease forwards 4.6s; opacity: 0; }
        .ak-intro-prefix    { animation: akIntroPrefix .8s ease forwards 3s; opacity: 0; display: inline-block; }
        .ak-intro-blob-1    { animation: akIntroBlob1 6s ease-in-out infinite; }
        .ak-intro-blob-2    { animation: akIntroBlob2 7s ease-in-out infinite; }
        .ak-rays            { animation: akRays 3.5s ease forwards; opacity: 0; }
        .ak-particle        { animation: akParticle linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ak-intro-logo, .ak-intro-glow, .ak-intro-ring, .ak-intro-sweep,
          .ak-intro-reel, .ak-intro-tag, .ak-intro-prefix, .ak-rays, .ak-particle {
            animation-duration: .01ms !important;
            animation-delay: 0s !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

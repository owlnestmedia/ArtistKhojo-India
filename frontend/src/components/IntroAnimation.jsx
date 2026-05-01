import { useEffect, useRef, useState } from "react";
import { REAL_LOGO_URL } from "./Logo";
import api from "../lib/api";

const FALLBACK_REEL = ["Musician.", "Painter.", "Photographer.", "Influencer.", "Dancer.", "Writer.", "You."];

/**
 * 5-act cinematic intro (~5.8s total). Plays once per session.
 * Circular "ARTISTKHOJO · SKILLED INDIANS" text rotates around the logo.
 * Showreel roles are fetched from /api/categories (falls back to static list).
 */
export const IntroAnimation = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("ak_intro_seen");
  });
  const [exit, setExit] = useState(false);
  const [showreelIdx, setShowreelIdx] = useState(0);
  const [roles, setRoles] = useState(FALLBACK_REEL);

  // Fetch dynamic role list from backend
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    api.get("/categories")
      .then((r) => {
        if (cancelled || !Array.isArray(r.data)) return;
        const dynamic = r.data.map((c) => `${c.label}.`);
        // Always end with "You." for the punchline
        const filtered = dynamic.filter((x) => x.toLowerCase() !== "you.");
        // Shuffle & take 6, then append You.
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
        setRoles([...filtered.slice(0, 6), "You."]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const reel = setInterval(() => {
      setShowreelIdx((i) => (i + 1) % roles.length);
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
  }, [visible, roles.length]);

  // Particles (generated once)
  const particles = useRef(
    Array.from({ length: 40 }, (_, i) => ({
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
      {/* Drifting colour blobs */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[52rem] h-[52rem] rounded-full bg-gradient-to-br from-[#9D4CDD] via-[#3B82F6] to-transparent blur-3xl ak-intro-blob-1" />
        <div className="absolute -bottom-48 -right-48 w-[52rem] h-[52rem] rounded-full bg-gradient-to-br from-[#F97316] via-[#EC4899] to-transparent blur-3xl ak-intro-blob-2" />
      </div>

      {/* Light rays */}
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
        <div
          className="relative"
          style={{ width: "clamp(320px, 36vw, 460px)", height: "clamp(320px, 36vw, 460px)" }}
        >
          {/* Halo glow */}
          <div className="absolute inset-12 rounded-full blur-3xl bg-gradient-to-br from-[#9D4CDD]/60 via-[#3B82F6]/40 to-[#EC4899]/60 ak-intro-glow" />

          {/* Rotating conic peacock ring */}
          <div
            className="absolute inset-0 rounded-full ak-intro-ring"
            style={{
              background:
                "conic-gradient(from 0deg, #9D4CDD, #3B82F6, #F97316, #EC4899, #9D4CDD)",
              mask: "radial-gradient(circle, transparent 58%, #000 59%, #000 63%, transparent 64%)",
              WebkitMask: "radial-gradient(circle, transparent 58%, #000 59%, #000 63%, transparent 64%)",
            }}
          />

          {/* Counter-rotating circular text — ARTISTKHOJO · SKILLED INDIANS KA SINGLE PLATFORM · */}
          <svg
            viewBox="0 0 500 500"
            className="absolute inset-0 w-full h-full ak-intro-circletext"
            aria-hidden="true"
          >
            <defs>
              {/* outer path — letters sit just outside the conic ring */}
              <path
                id="ak-ring-text-path"
                d="M 250,250 m -218,0 a 218,218 0 1,1 436,0 a 218,218 0 1,1 -436,0"
                fill="none"
              />
            </defs>
            <text
              fill="rgba(255,255,255,0.45)"
              fontSize="18"
              letterSpacing="7"
              style={{ fontFamily: "'Supreme','Satoshi',sans-serif", fontWeight: 500, textTransform: "uppercase" }}
            >
              <textPath href="#ak-ring-text-path" startOffset="0">
                ArtistKhojo ✦ Skilled Indians Ka Single Platform ✦ ArtistKhojo ✦ Find Artists · Hire Talents · Get Work Done ✦
              </textPath>
            </text>
          </svg>

          {/* Real logo in centre */}
          <img
            src={REAL_LOGO_URL}
            alt="ArtistKhojo"
            className="absolute inset-16 m-auto ak-intro-logo"
            style={{ width: "calc(100% - 8rem)", height: "calc(100% - 8rem)", objectFit: "contain" }}
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
          <span className="relative inline-block min-w-[9ch]">
            <span key={showreelIdx} className="ak-intro-reel font-display-italic ak-brand-gradient-text">
              {roles[showreelIdx]}
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
        @keyframes akIntroCircleText {
          0%   { opacity: 0; transform: rotate(30deg); }
          40%  { opacity: 1; transform: rotate(0deg); }
          100% { opacity: 1; transform: rotate(-360deg); }
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

        .ak-intro-logo       { animation: akIntroLogoIn 1.2s cubic-bezier(.2,.7,.2,1) forwards .6s; opacity: 0; }
        .ak-intro-glow       { animation: akIntroGlow 1.8s cubic-bezier(.2,.7,.2,1) forwards .4s; opacity: 0; }
        .ak-intro-ring       { animation: akIntroRing 6s cubic-bezier(.5,.1,.5,.9) forwards .3s; opacity: 0; transform-origin: 50% 50%; }
        .ak-intro-circletext { animation: akIntroCircleText 18s linear forwards .6s; opacity: 0; transform-origin: 50% 50%; }
        .ak-intro-sweep      { animation: akIntroSweep 2s ease-in-out 2s forwards; }
        .ak-intro-reel       { display: inline-block; animation: akIntroReel .22s ease forwards; }
        .ak-intro-tag        { animation: akIntroTag 1.1s ease forwards 4.6s; opacity: 0; }
        .ak-intro-prefix     { animation: akIntroPrefix .8s ease forwards 3s; opacity: 0; display: inline-block; }
        .ak-intro-blob-1     { animation: akIntroBlob1 6s ease-in-out infinite; }
        .ak-intro-blob-2     { animation: akIntroBlob2 7s ease-in-out infinite; }
        .ak-rays             { animation: akRays 3.5s ease forwards; opacity: 0; }
        .ak-particle         { animation: akParticle linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ak-intro-logo, .ak-intro-glow, .ak-intro-ring, .ak-intro-circletext,
          .ak-intro-sweep, .ak-intro-reel, .ak-intro-tag, .ak-intro-prefix,
          .ak-rays, .ak-particle {
            animation-duration: .01ms !important;
            animation-delay: 0s !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

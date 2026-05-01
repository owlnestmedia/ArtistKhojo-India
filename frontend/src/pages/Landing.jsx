import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, TrendingUp, Star } from "lucide-react";
import { Header } from "../components/Header";
import { CATEGORIES } from "../constants/categories";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { ArtistCard } from "../components/ArtistCard";

const ensembleImg = "https://customer-assets.emergentagent.com/job_ca65f773-3c93-4072-8d20-dcc5be5b8c4c/artifacts/orc5tf8n_WhatsApp%20Image%202026-05-01%20at%2011.24.50%20%281%29.jpeg";

const Landing = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/artists/featured").then((r) => setFeatured(r.data)).catch(() => {});
  }, []);

  // Duplicate once for seamless marquee
  const marqueeCats = [...CATEGORIES, ...CATEGORIES];

  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-x-hidden" data-testid="landing-page">
      <Header />

      {/* HERO */}
      <section className="relative">
        {/* Floating gradient blobs */}
        <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#9D4CDD]/35 via-[#3B82F6]/25 to-transparent blur-3xl ak-drift" />
          <div className="absolute top-20 right-[-10%] w-[460px] h-[460px] rounded-full bg-gradient-to-br from-[#F97316]/25 via-[#EC4899]/30 to-transparent blur-3xl ak-float-slow" />
          <div className="absolute bottom-[-15%] left-[25%] w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#3B82F6]/20 via-[#9D4CDD]/25 to-transparent blur-3xl ak-float" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 pb-20 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-300 bg-white/70 backdrop-blur text-xs uppercase tracking-widest text-zinc-600 ak-fade-up">
                <Sparkles size={12} className="text-[#EC4899]" /> Skilled People Ka Single Platform
              </span>

              <h1 className="font-display text-[2.75rem] sm:text-[3.75rem] lg:text-[5.25rem] leading-[0.96] tracking-tight mt-6 text-zinc-900">
                <span className="block ak-fade-up ak-delay-1">Every</span>
                <span className="block ak-fade-up ak-delay-2">
                  <em className="font-display-italic ak-brand-gradient-text">Skilled&nbsp;People</em>
                </span>
                <span className="block ak-fade-up ak-delay-3">Ka Single Platform.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base sm:text-lg text-zinc-600 leading-relaxed ak-fade-up ak-delay-4">
                Find, hire and showcase artists from every craft across India — painters, photographers,
                dancers, voice artists, content creators, sketch artists and more. <em className="font-display-italic">Beginners welcome.</em>
              </p>

              <div className="mt-9 flex flex-wrap gap-3 ak-fade-up ak-delay-5">
                <Link
                  to="/login"
                  data-testid="hero-get-started-btn"
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all hover:gap-3"
                >
                  Get Started <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/artists"
                  data-testid="hero-browse-btn"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-zinc-300 bg-white/80 font-medium hover:bg-white hover:border-zinc-900 transition-colors"
                >
                  Browse Artists
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-zinc-500 ak-fade-up ak-delay-5">
                <span className="inline-flex items-center gap-2"><Shield size={14} /> Blue-Tick Verified</span>
                <span className="inline-flex items-center gap-2"><TrendingUp size={14} /> Ratings & Reviews</span>
                <span>Pan-India · 15+ Categories</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative ak-scale-in ak-delay-3">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-zinc-200 ak-float-slow">
                <img src={ensembleImg} alt="Artists on ArtistKhojo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:left-6 bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 w-64 ak-fade-up ak-delay-5">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Live on the platform</div>
                <div className="mt-2 flex -space-x-3">
                  {[0,1,2,3].map((i)=> (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9D4CDD] via-[#3B82F6] to-[#EC4899] p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-semibold">{"AKSR"[i]}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 font-display text-lg">2.4k+ verified artists</div>
              </div>
              <div className="absolute -top-5 -right-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-zinc-100 px-4 py-2 flex items-center gap-2 ak-fade-up ak-delay-4">
                <Star size={14} className="fill-amber-400 stroke-amber-400" />
                <span className="text-sm font-medium">4.9 average rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE strip of categories */}
      <section className="border-y border-zinc-200 bg-white/60 backdrop-blur overflow-hidden">
        <div className="relative flex py-5">
          <div className="flex gap-12 whitespace-nowrap ak-marquee">
            {marqueeCats.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-600">
                <span className="text-lg">{c.emoji}</span>
                <span className="font-display text-xl">{c.key}</span>
                <span className="text-zinc-300">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY BENTO */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28" data-testid="landing-categories">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="ak-fade-up">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Find talent by</div>
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight mt-2">
              Every <em className="font-display-italic ak-brand-gradient-text">category</em>, one roof.
            </h2>
          </div>
          <Link to="/artists" className="text-sm text-zinc-900 underline underline-offset-4 hover:no-underline hidden sm:inline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.key}
              to={`/artists?category=${encodeURIComponent(c.key)}`}
              data-testid={`cat-${c.key.split(" ")[0].toLowerCase()}`}
              className="group relative p-5 rounded-2xl bg-white border border-zinc-200 ak-card-lift ak-fade-up"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <div className="text-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">{c.emoji}</div>
              <div className="mt-3 font-display text-lg text-zinc-900 leading-tight">{c.key}</div>
              <div className="text-xs text-zinc-500 mt-1">{c.hint}</div>
              <div className="absolute inset-x-5 bottom-3 h-[2px] bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] to-[#EC4899] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16" data-testid="landing-featured">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div className="ak-fade-up">
              <div className="text-xs uppercase tracking-widest text-zinc-500">Featured</div>
              <h2 className="font-display text-3xl sm:text-5xl tracking-tight mt-2">
                <em className="font-display-italic ak-brand-gradient-text">Verified</em> talent this week.
              </h2>
            </div>
            <Link to="/artists" className="text-sm text-zinc-900 underline underline-offset-4 hover:no-underline">View all →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.slice(0, 4).map((a, i) => (
              <div key={a.id} className="ak-fade-up" style={{ animationDelay: `${0.08 * i}s` }}>
                <ArtistCard artist={a} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ARTIST CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] p-10 sm:p-16 bg-zinc-900 text-white">
          <div className="absolute -right-20 -top-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-[#9D4CDD] via-[#3B82F6] to-[#EC4899] opacity-30 blur-3xl ak-drift" />
          <div className="absolute -left-10 -bottom-20 w-[22rem] h-[22rem] rounded-full bg-gradient-to-tr from-[#F97316] to-[#EC4899] opacity-20 blur-3xl ak-float" />
          <div className="relative max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-white/60">For Artists</div>
            <h3 className="font-display text-3xl sm:text-6xl tracking-tight mt-4 leading-[1.02]">
              Showcase your <em className="font-display-italic bg-gradient-to-r from-[#F97316] to-[#EC4899] bg-clip-text text-transparent">craft</em>.<br />Get booked.
            </h3>
            <p className="mt-6 text-white/70 max-w-lg text-lg">
              Upload 4 best works, earn the blue-tick, and start receiving booking requests from customers near you.
            </p>
            <Link
              to="/login?role=artist"
              data-testid="landing-become-artist-btn"
              className="group inline-flex items-center gap-2 mt-10 px-7 py-4 rounded-full bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-all hover:gap-3"
            >
              Become an Artist <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 mt-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div>© {new Date().getFullYear()} ArtistKhojo.in — <em className="font-display-italic">Skilled People Ka Single Platform</em></div>
          <div className="flex gap-6">
            <Link to="/admin/login" data-testid="footer-admin-link">Admin</Link>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Header } from "../components/Header";
import { CATEGORIES } from "../constants/categories";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { ArtistCard } from "../components/ArtistCard";

const heroBg = "https://static.prod-images.emergentagent.com/jobs/ca65f773-3c93-4072-8d20-dcc5be5b8c4c/images/cb7c5a3f2ad9e311d4307437bcb68c926e291e9ea4a457092caafa0e59989f1c.png";
const ensembleImg = "https://customer-assets.emergentagent.com/job_ca65f773-3c93-4072-8d20-dcc5be5b8c4c/artifacts/orc5tf8n_WhatsApp%20Image%202026-05-01%20at%2011.24.50%20%281%29.jpeg";

const Landing = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/artists/featured").then((r) => setFeatured(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="landing-page">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0 opacity-60 pointer-events-none">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-[#FDFBF7]/70 to-[#FDFBF7]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 pb-20 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-300 bg-white/70 backdrop-blur text-xs uppercase tracking-widest text-zinc-600">
                <Sparkles size={12} className="text-[#EC4899]" /> Skilled People Ka Single Platform
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.02] tracking-tight mt-6 text-zinc-900">
                Every <em className="not-italic bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] via-[#F97316] to-[#EC4899] bg-clip-text text-transparent">Skilled People</em>
                <br />
                <span>Ka Single Platform.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg text-zinc-600 leading-relaxed">
                Find, hire and showcase artists from every craft across India — painters, photographers,
                dancers, voice artists, content creators, sketch artists and more. Beginners welcome.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  data-testid="hero-get-started-btn"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link
                  to="/artists"
                  data-testid="hero-browse-btn"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-zinc-300 bg-white/80 font-medium hover:bg-white transition-colors"
                >
                  Browse Artists
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-zinc-500">
                <span className="inline-flex items-center gap-2"><Shield size={14} /> Blue-Tick Verified</span>
                <span className="inline-flex items-center gap-2"><TrendingUp size={14} /> Ratings & Reviews</span>
                <span>Pan-India · 15+ Categories</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-zinc-200">
                <img src={ensembleImg} alt="Artists on ArtistKhojo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:left-6 bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 w-60">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Live on the platform</div>
                <div className="mt-2 flex -space-x-3">
                  {[0,1,2,3].map((i)=> (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9D4CDD] via-[#3B82F6] to-[#EC4899] p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-semibold">{"AKSR"[i]}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm font-display font-semibold">2.4k+ verified artists</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY BENTO */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20" data-testid="landing-categories">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Find talent by</div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight mt-1">Every category, one roof.</h2>
          </div>
          <Link to="/artists" className="text-sm text-zinc-900 underline underline-offset-4 hover:no-underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/artists?category=${encodeURIComponent(c.key)}`}
              data-testid={`cat-${c.key.split(" ")[0].toLowerCase()}`}
              className="group p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all"
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="mt-3 font-display font-semibold text-zinc-900 text-sm leading-tight">{c.key}</div>
              <div className="text-xs text-zinc-500 mt-1">{c.hint}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16" data-testid="landing-featured">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">Featured</div>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tight mt-1">Verified talent this week.</h2>
            </div>
            <Link to="/artists" className="text-sm text-zinc-900 underline underline-offset-4 hover:no-underline">View all →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.slice(0, 4).map((a) => (<ArtistCard key={a.id} artist={a} />))}
          </div>
        </section>
      )}

      {/* ARTIST CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] p-10 sm:p-16 bg-zinc-900 text-white">
          <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-gradient-to-tr from-[#9D4CDD] via-[#3B82F6] to-[#EC4899] opacity-30 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-white/60">For Artists</div>
            <h3 className="font-display text-3xl sm:text-5xl tracking-tight mt-3">Showcase your craft. Get booked.</h3>
            <p className="mt-5 text-white/70 max-w-lg">
              Upload 4 best works, get blue-tick verified and start receiving booking requests from customers near you.
            </p>
            <Link
              to="/login?role=artist"
              data-testid="landing-become-artist-btn"
              className="inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
            >
              Become an Artist <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div>© {new Date().getFullYear()} ArtistKhojo.in — Skilled People Ka Single Platform</div>
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

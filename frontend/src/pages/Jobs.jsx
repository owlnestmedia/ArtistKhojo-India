import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { CATEGORIES, CITIES } from "../constants/categories";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Briefcase, MapPin, Plus, X, IndianRupee } from "lucide-react";

const JOB_TYPES = ["Freelance", "Part-time", "Full-time", "Internship", "Project"];

const Jobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", category: "", job_type: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", category:"", city:"", job_type:"", budget:"" });
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.category) params.category = filters.category;
    if (filters.job_type) params.job_type = filters.job_type;
    const { data } = await api.get("/jobs", { params });
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters]);

  const submit = async () => {
    if (!user) { toast.error("Login to post"); navigate("/login"); return; }
    if (!form.title || !form.category || !form.city || !form.job_type || !form.budget) {
      toast.error("All fields required"); return;
    }
    setPosting(true);
    try {
      await api.post("/jobs", { ...form, budget: Number(form.budget) });
      toast.success("Job posted");
      setShowForm(false);
      setForm({ title:"", description:"", category:"", city:"", job_type:"", budget:"" });
      await load();
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
    setPosting(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="jobs-page">
      <Header />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Job openings</div>
            <h1 className="font-display text-4xl sm:text-6xl tracking-tight mt-2">
              Find <em className="font-display-italic ak-brand-gradient-text">gigs</em> near you.
            </h1>
          </div>
          <Button
            data-testid="job-post-toggle"
            onClick={() => { if (!user) navigate("/login"); else setShowForm(s => !s); }}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 gap-2"
          >
            {showForm ? <><X size={14}/> Close</> : <><Plus size={14}/> Post a Job</>}
          </Button>
        </div>

        <div className="mt-8 flex gap-3 flex-wrap">
          <select data-testid="jobs-filter-city" value={filters.city} onChange={e=>setFilters(f=>({...f,city:e.target.value}))} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm">
            <option value="">All cities</option>
            {CITIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <select data-testid="jobs-filter-category" value={filters.category} onChange={e=>setFilters(f=>({...f,category:e.target.value}))} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm">
            <option value="">All categories</option>
            {CATEGORIES.map(c=><option key={c.key}>{c.key}</option>)}
          </select>
          <select data-testid="jobs-filter-type" value={filters.job_type} onChange={e=>setFilters(f=>({...f,job_type:e.target.value}))} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm">
            <option value="">All types</option>
            {JOB_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
          {(filters.city || filters.category || filters.job_type) && (
            <button onClick={()=>setFilters({city:"",category:"",job_type:""})} className="text-xs text-zinc-500 underline self-center">Clear</button>
          )}
        </div>

        {showForm && (
          <div className="mt-6 p-6 rounded-3xl bg-white border border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="job-form">
            <Input data-testid="job-title" placeholder="Job title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="rounded-xl" />
            <select data-testid="job-category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm">
              <option value="">Category *</option>
              {CATEGORIES.map(c=><option key={c.key}>{c.key}</option>)}
            </select>
            <select data-testid="job-city" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm">
              <option value="">City *</option>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
            <select data-testid="job-type" value={form.job_type} onChange={e=>setForm(f=>({...f,job_type:e.target.value}))} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm">
              <option value="">Type *</option>
              {JOB_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
            <Input data-testid="job-budget" type="number" placeholder="Budget (₹) *" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} className="rounded-xl" />
            <div className="md:col-span-2"><Textarea data-testid="job-desc" rows={4} placeholder="Describe the work" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="rounded-xl" /></div>
            <div className="md:col-span-2">
              <Button data-testid="job-submit" onClick={submit} disabled={posting} className="rounded-full bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] to-[#EC4899]">{posting ? "Posting..." : "Publish job"}</Button>
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading && <div className="text-sm text-zinc-500">Loading…</div>}
          {!loading && jobs.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-3xl border border-dashed border-zinc-300 bg-white/60">
              <div className="text-5xl">💼</div>
              <div className="mt-4 font-display text-2xl">No open jobs yet</div>
              <p className="text-sm text-zinc-500 mt-2">Be the first to post.</p>
            </div>
          )}
          {jobs.map((j, i) => (
            <Link key={j.id} to={`/jobs/${j.id}`} data-testid={`job-card-${j.id}`} className="group p-6 rounded-3xl bg-white border border-zinc-200 ak-card-lift ak-fade-up" style={{animationDelay: `${0.04 * (i % 6)}s`}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9D4CDD]/15 to-[#EC4899]/15 flex items-center justify-center">
                  <Briefcase size={18} className="text-zinc-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl leading-tight line-clamp-2">{j.title}</h3>
                  <div className="text-xs text-zinc-500 mt-1">{j.category} · by {j.posted_by_name}</div>
                </div>
                <div className="font-display text-xl inline-flex items-center"><IndianRupee size={14}/>{j.budget.toLocaleString()}</div>
              </div>
              <div className="mt-4 flex items-center gap-3 flex-wrap text-xs">
                <span className="px-2 py-0.5 rounded-full bg-zinc-100">{j.job_type}</span>
                <span className="inline-flex items-center gap-1 text-zinc-600"><MapPin size={10}/> {j.city}</span>
                <span className="text-zinc-500">{j.applications_count || 0} applications</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;

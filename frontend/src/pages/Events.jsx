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
import { CalendarDays, MapPin, Plus, X, Ticket } from "lucide-react";

const fileToBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
});

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", city: "", venue: "",
    date_start: "", date_end: "", cover_image: "", ticket_price: 0,
  });
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = { upcoming_only: true };
    if (filters.city) params.city = filters.city;
    if (filters.category) params.category = filters.category;
    const { data } = await api.get("/events", { params });
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters]);

  const onCover = async (file) => {
    if (!file) return;
    const data = await fileToBase64(file);
    setForm((f) => ({ ...f, cover_image: data }));
  };

  const submit = async () => {
    if (!user) { toast.error("Login to post events"); navigate("/login"); return; }
    if (!form.title || !form.category || !form.city || !form.date_start) {
      toast.error("Title, category, city & start date required");
      return;
    }
    setPosting(true);
    try {
      await api.post("/events", { ...form, ticket_price: Number(form.ticket_price) || 0 });
      toast.success("Event posted");
      setShowForm(false);
      setForm({ title:"", description:"", category:"", city:"", venue:"", date_start:"", date_end:"", cover_image:"", ticket_price:0 });
      await load();
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
    setPosting(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="events-page">
      <Header />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">What's happening?</div>
            <h1 className="font-display text-4xl sm:text-6xl tracking-tight mt-2">
              <em className="font-display-italic ak-brand-gradient-text">Events</em> across India.
            </h1>
          </div>
          <Button
            data-testid="event-post-toggle"
            onClick={() => { if (!user) navigate("/login"); else setShowForm(s => !s); }}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 gap-2"
          >
            {showForm ? <><X size={14}/> Close</> : <><Plus size={14}/> Host an Event</>}
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-3 flex-wrap">
          <select
            data-testid="events-filter-city"
            value={filters.city}
            onChange={(e) => setFilters(f => ({...f, city: e.target.value}))}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm"
          >
            <option value="">All cities</option>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            data-testid="events-filter-category"
            value={filters.category}
            onChange={(e) => setFilters(f => ({...f, category: e.target.value}))}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c.key}>{c.key}</option>)}
          </select>
          {(filters.city || filters.category) && (
            <button onClick={() => setFilters({city:"",category:""})} className="text-xs text-zinc-500 underline self-center">Clear</button>
          )}
        </div>

        {/* Create form */}
        {showForm && (
          <div className="mt-6 p-6 rounded-3xl bg-white border border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="event-form">
            <Input data-testid="event-title" placeholder="Event title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="rounded-xl" />
            <select data-testid="event-category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm">
              <option value="">Category *</option>
              {CATEGORIES.map(c => <option key={c.key}>{c.key}</option>)}
            </select>
            <select data-testid="event-city" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm">
              <option value="">City *</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <Input data-testid="event-venue" placeholder="Venue" value={form.venue} onChange={e=>setForm(f=>({...f,venue:e.target.value}))} className="rounded-xl" />
            <Input data-testid="event-date-start" type="date" value={form.date_start} onChange={e=>setForm(f=>({...f,date_start:e.target.value}))} className="rounded-xl" />
            <Input data-testid="event-date-end" type="date" value={form.date_end} onChange={e=>setForm(f=>({...f,date_end:e.target.value}))} className="rounded-xl" />
            <Input data-testid="event-price" type="number" placeholder="Ticket price (₹, 0 = free)" value={form.ticket_price} onChange={e=>setForm(f=>({...f,ticket_price:e.target.value}))} className="rounded-xl" />
            <input data-testid="event-cover" type="file" accept="image/*" onChange={e=>onCover(e.target.files[0])} className="text-sm" />
            <div className="md:col-span-2"><Textarea data-testid="event-desc" rows={4} placeholder="Describe the event" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="rounded-xl" /></div>
            <div className="md:col-span-2">
              <Button data-testid="event-submit" onClick={submit} disabled={posting} className="rounded-full bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] to-[#EC4899]">{posting ? "Posting..." : "Publish event"}</Button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading && <div className="text-sm text-zinc-500">Loading…</div>}
          {!loading && events.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-3xl border border-dashed border-zinc-300 bg-white/60">
              <div className="text-5xl">🎭</div>
              <div className="mt-4 font-display text-2xl">No upcoming events yet</div>
              <p className="text-sm text-zinc-500 mt-2">Be the first to host one.</p>
            </div>
          )}
          {events.map((e, i) => (
            <Link key={e.id} to={`/events/${e.id}`} data-testid={`event-card-${e.id}`} className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden ak-card-lift ak-fade-up" style={{animationDelay: `${0.05 * (i % 6)}s`}}>
              <div className="aspect-[16/10] bg-gradient-to-br from-[#9D4CDD]/15 via-[#3B82F6]/15 to-[#EC4899]/15 relative overflow-hidden">
                {e.cover_image ? (
                  <img src={e.cover_image} alt="" className="w-full h-full object-cover ak-img-zoom" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl opacity-70">🎤</div>
                )}
                {e.ticket_price > 0 ? (
                  <span className="absolute top-3 right-3 text-xs bg-white/90 backdrop-blur px-2 py-1 rounded-full inline-flex items-center gap-1"><Ticket size={10}/> ₹{e.ticket_price}</span>
                ) : (
                  <span className="absolute top-3 right-3 text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">Free</span>
                )}
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-zinc-500">{e.category}</div>
                <h3 className="mt-1 font-display text-xl leading-tight line-clamp-2">{e.title}</h3>
                <div className="mt-3 text-xs text-zinc-600 flex items-center gap-4 flex-wrap">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={12}/> {e.date_start}{e.date_end && ` – ${e.date_end}`}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12}/> {e.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;

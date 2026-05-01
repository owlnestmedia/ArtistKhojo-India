import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Header } from "../components/Header";
import { CalendarDays, MapPin, Ticket, Share2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams();
  const [e, setE] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`).then(r => setE(r.data)).catch(() => setE(null)).finally(() => setLoading(false));
  }, [id]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: e.title, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    } catch {}
  };

  if (loading) return <div className="min-h-screen bg-[#FDFBF7]"><Header/><div className="p-10 text-zinc-500">Loading…</div></div>;
  if (!e) return <div className="min-h-screen bg-[#FDFBF7]"><Header/><div className="p-10">Event not found.</div></div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="event-detail-page">
      <Header />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10">
        <Link to="/events" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"><ArrowLeft size={14}/> Back to events</Link>

        <div className="mt-6 rounded-3xl overflow-hidden bg-white border border-zinc-200">
          <div className="aspect-[21/9] bg-gradient-to-br from-[#9D4CDD]/20 via-[#3B82F6]/20 to-[#EC4899]/20">
            {e.cover_image
              ? <img src={e.cover_image} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-6xl">🎭</div>}
          </div>
          <div className="p-8 sm:p-10">
            <div className="text-xs uppercase tracking-widest text-zinc-500">{e.category}</div>
            <h1 className="font-display text-3xl sm:text-5xl tracking-tight mt-2">{e.title}</h1>
            <div className="mt-4 flex items-center gap-6 flex-wrap text-sm text-zinc-600">
              <span className="inline-flex items-center gap-2"><CalendarDays size={14}/> {e.date_start}{e.date_end && ` – ${e.date_end}`}</span>
              <span className="inline-flex items-center gap-2"><MapPin size={14}/> {e.venue ? `${e.venue}, ` : ""}{e.city}</span>
              {e.ticket_price > 0 ? (
                <span className="inline-flex items-center gap-2"><Ticket size={14}/> ₹{e.ticket_price}</span>
              ) : (
                <span className="inline-flex items-center gap-2 text-emerald-600">Free entry</span>
              )}
            </div>
            <p className="mt-6 text-zinc-700 leading-relaxed whitespace-pre-line">{e.description}</p>
            <div className="mt-8 flex gap-3 flex-wrap items-center">
              <Button data-testid="event-share" onClick={share} variant="outline" className="rounded-full"><Share2 size={14} className="mr-2"/> Share event</Button>
              <div className="text-xs text-zinc-500">Hosted by <span className="text-zinc-900">{e.posted_by_name}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Briefcase, MapPin, IndianRupee, ArrowLeft, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data)).catch(() => setJob(null)).finally(()=>setLoading(false));
  }, [id]);

  useEffect(() => {
    if (job && user && job.posted_by === user.id) {
      api.get(`/jobs/${id}/applications`).then(r => setApplications(r.data)).catch(() => {});
    }
  }, [job, user, id]);

  const apply = async () => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "artist") { toast.error("Only artists can apply"); return; }
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { message });
      toast.success("Application sent!");
      setMessage("");
      const r = await api.get(`/jobs/${id}`); setJob(r.data);
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
    setApplying(false);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: job.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }
    } catch {}
  };

  if (loading) return <div className="min-h-screen bg-[#FDFBF7]"><Header/><div className="p-10 text-zinc-500">Loading…</div></div>;
  if (!job) return <div className="min-h-screen bg-[#FDFBF7]"><Header/><div className="p-10">Job not found.</div></div>;

  const isMine = user && job.posted_by === user.id;

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="job-detail-page">
      <Header />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"><ArrowLeft size={14}/> Back to jobs</Link>

        <div className="mt-6 p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9D4CDD]/15 to-[#EC4899]/15 flex items-center justify-center">
              <Briefcase size={22} />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-zinc-500">{job.category}</div>
              <h1 className="font-display text-3xl sm:text-5xl tracking-tight mt-2">{job.title}</h1>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl inline-flex items-center"><IndianRupee size={20}/>{job.budget.toLocaleString()}</div>
              <div className="text-xs text-zinc-500">Budget</div>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap text-sm text-zinc-600">
            <span className="px-3 py-1 rounded-full bg-zinc-100">{job.job_type}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12}/> {job.city}</span>
            <span>Posted by <span className="text-zinc-900">{job.posted_by_name}</span></span>
            <span className="inline-flex items-center gap-1 text-zinc-500"><Users size={12}/> {job.applications_count || 0} applications</span>
          </div>

          <p className="mt-6 text-zinc-700 leading-relaxed whitespace-pre-line">{job.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button data-testid="job-share" onClick={share} variant="outline" className="rounded-full"><Share2 size={14} className="mr-2"/> Share</Button>
          </div>
        </div>

        {/* Apply section — only for artists, not own job */}
        {!isMine && user?.role === "artist" && (
          <div className="mt-6 p-6 rounded-3xl bg-white border border-zinc-200" data-testid="job-apply-section">
            <h3 className="font-display text-xl">Apply for this job</h3>
            <Textarea data-testid="job-apply-message" rows={3} placeholder="Briefly tell the client why you're a fit" value={message} onChange={e=>setMessage(e.target.value)} className="mt-3 rounded-xl" />
            <Button data-testid="job-apply-btn" onClick={apply} disabled={applying} className="mt-3 rounded-full bg-gradient-to-r from-[#9D4CDD] via-[#3B82F6] to-[#EC4899]">{applying ? "Applying..." : "Send application"}</Button>
          </div>
        )}

        {/* Owner applications view */}
        {isMine && (
          <div className="mt-6 p-6 rounded-3xl bg-white border border-zinc-200" data-testid="job-applications-section">
            <h3 className="font-display text-xl">Applications ({applications?.length || 0})</h3>
            {!applications?.length && <p className="mt-3 text-sm text-zinc-500">No applications yet.</p>}
            <div className="mt-4 space-y-3">
              {applications?.map(a => (
                <div key={a.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50" data-testid={`application-${a.id}`}>
                  <div className="font-medium">{a.artist_name}</div>
                  {a.message && <p className="text-sm text-zinc-700 mt-1">{a.message}</p>}
                  {a.artist_profile_id && (
                    <Link to={`/artist/${a.artist_profile_id}`} className="text-xs underline mt-2 inline-block">View profile →</Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;

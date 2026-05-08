import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "motion/react";
import { computeDaysLeft } from '../../utils/dates';
import { Calendar, LogOut, ArrowLeft, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   Plan tier → card theme
───────────────────────────────────────────── */
function getPlanTheme(planName = "") {
  const p = planName.toLowerCase();
  if (p.includes("1 year") || p.includes("12") || p.includes("annual") || p.includes("yearly")) {
    return {
      gradient: "from-[#1a1400] via-[#2a1f00] to-[#0d0d0d]",
      border: "border-yellow-500/30",
      accent: "text-yellow-400",
      barColor: "bg-yellow-400",
      barTrack: "bg-yellow-900/30",
      badge: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/25",
      glow: "shadow-yellow-900/40",
      daysColor: "text-yellow-300",
    };
  }
  if (p.includes("6") || p.includes("half")) {
    return {
      gradient: "from-[#000d1a] via-[#001428] to-[#0d0d0d]",
      border: "border-blue-500/30",
      accent: "text-blue-400",
      barColor: "bg-blue-400",
      barTrack: "bg-blue-900/30",
      badge: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
      glow: "shadow-blue-900/40",
      daysColor: "text-blue-300",
    };
  }
  if (p.includes("3")) {
    return {
      gradient: "from-[#001a0d] via-[#001f10] to-[#0d0d0d]",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
      barColor: "bg-emerald-400",
      barTrack: "bg-emerald-900/30",
      badge: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
      glow: "shadow-emerald-900/40",
      daysColor: "text-emerald-300",
    };
  }
  return {
    gradient: "from-zinc-900 via-zinc-800/80 to-zinc-900",
    border: "border-white/10",
    accent: "text-zinc-300",
    barColor: "bg-zinc-400",
    barTrack: "bg-zinc-700/50",
    badge: "bg-white/5 text-zinc-400 border border-white/10",
    glow: "shadow-black/60",
    daysColor: "text-white",
  };
}

function urgencyLabel(days) {
  if (days <= 0)  return { text: "Expired",       color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" };
  if (days <= 5)  return { text: "Expiring Soon", color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" };
  if (days <= 15) return { text: "Active",        color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20" };
  return           { text: "Active",              color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UserSubscriptions() {
  const { user, logoutUser } = useUser();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubs = async () => {
      // Use phone number instead of email
      const userPhone = user?.phone_number || user?.phone;
      console.log("Fetching subscriptions for phone:", userPhone);
      if (!userPhone) return;
      
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/subscriptions`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: userPhone })
        });
        
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        
        const data = await res.json();
        let subs = Array.isArray(data.subscriptions) ? data.subscriptions : [];
        // sort by start_date descending (recent first)
        subs.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setSubscriptions(subs);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] font-black text-zinc-600">Aarambh Fitness</p>
            <h1 className="text-base md:text-lg font-black uppercase italic tracking-tight text-white leading-tight">
              Subscription History
            </h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-white/5 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* ── Body ── */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white mb-2">
            Hey, {user?.name?.split(" ")[0] || "Champ"} 👋
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.3em] font-bold">
            Your complete subscription timeline
          </p>
        </motion.div>

        {/* Subscriptions Grid */}
        {loading ? (
          <div className="rounded-[2rem] border border-white/10 bg-zinc-900 p-12 flex items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400 font-bold text-sm">
            {error}
          </div>
        ) : subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[2rem] border border-white/10 bg-zinc-900/60 p-12 text-center"
          >
            <Flame className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-base mb-2">No Subscriptions Found</p>
            <p className="text-zinc-700 text-xs uppercase tracking-wider">Visit the gym to get started on your fitness journey</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {subscriptions.map((s, idx) => {
              const start = s.start_date ? new Date(s.start_date) : null;
              const end = s.end_date ? new Date(s.end_date) : null;
              const now = new Date();
              const totalDays = start && end ? Math.max(0, Math.ceil((end - start) / 86400000)) : 0;
              const elapsed = start ? Math.max(0, Math.min(Math.ceil((now - start) / 86400000), totalDays)) : 0;
              const percent = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 100;
              const daysLeft = computeDaysLeft(s.start_date, s.end_date) ?? 0;

              const planName = s.plan || "Membership";
              const theme = getPlanTheme(planName);
              const urgency = urgencyLabel(daysLeft);

              return (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className={`relative rounded-[2rem] border bg-gradient-to-br ${theme.gradient} ${theme.border} px-6 py-5 overflow-hidden shadow-2xl ${theme.glow}`}
                >
                  {/* background glow blob */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-15 bg-white pointer-events-none" />

                  {/* Row 1: plan badge + status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full ${theme.badge}`}>
                      {planName}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${urgency.bg} ${urgency.color}`}>
                      {urgency.text}
                    </span>
                  </div>

                  {/* Amount + Days */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className={`text-xs font-black uppercase tracking-[0.3em] ${theme.accent} opacity-70 mb-1`}>
                        Amount Paid
                      </p>
                      <span className={`text-3xl md:text-4xl font-black leading-none tracking-tighter ${theme.daysColor}`}>
                        ₹{s.amount || 0}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black uppercase tracking-[0.3em] ${theme.accent} opacity-70 mb-1`}>
                        Days Left
                      </p>
                      <span className={`text-3xl md:text-4xl font-black leading-none tracking-tighter ${theme.daysColor}`}>
                        {daysLeft}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className={`w-full h-1.5 rounded-full mb-3 ${theme.barTrack}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${theme.barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Dates row */}
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">
                    <span>Started {fmtDate(s.start_date)}</span>
                    <span>Expires {fmtDate(s.end_date)}</span>
                  </div>

                  {/* Bottom divider + icon */}
                  <div className="border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-3.5 h-3.5 ${theme.accent}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>
                        Subscription #{idx + 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

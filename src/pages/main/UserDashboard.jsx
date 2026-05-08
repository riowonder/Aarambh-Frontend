import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "motion/react";
import {
  Calendar,
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Flame,
  LogOut,
  Hash,
  AtSign,
  Fingerprint,
  Ruler,
  Weight,
  Users,
  Droplets,
  MapPin,
  Cake,
  ChevronRight,
  MessageCircle,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { computeDaysLeft, isYetToStart } from '../../utils/dates';

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

function fmtVal(v) {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
export default function UserDashboard() {
  const { user, logoutUser } = useUser();
  const [profile, setProfile]           = useState(null);
  const [loadingProfile, setLoading]    = useState(false);
  const [profileError, setError]        = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = user?.userId;
    if (!userId) return;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
          method: "POST",
          credentials: "include",
          signal: controller.signal,
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error(`${res.status}`);
        setProfile(await res.json());
      } catch (err) {
        if (err.name !== "AbortError") setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [user?.email]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  /* ── subscription ── */
  const sub   = profile?.subscription ?? null;
  const noSub = !sub || (Array.isArray(sub) && sub.length === 0);

  const start     = sub?.start_date ? new Date(sub.start_date) : null;
  const end       = sub?.end_date   ? new Date(sub.end_date)   : null;
  const now       = new Date();
  const totalDays = start && end ? Math.max(0, Math.ceil((end - start) / 86400000)) : 0;
  const elapsed   = start ? Math.max(0, Math.min(Math.ceil((now - start) / 86400000), totalDays)) : 0;
  const percent   = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 100;
  const daysLeft  = computeDaysLeft(sub?.start_date, sub?.end_date) ?? 0;
  const yetToStart = isYetToStart(sub?.start_date);

  const planName = sub?.plan || "";
  const theme    = getPlanTheme(planName);
  const urgency  = yetToStart ? { text: "Not started", color: "text-zinc-300", bg: "bg-zinc-700/10 border-zinc-700/20" } : urgencyLabel(daysLeft);

  /* ── user object ── */
  const u = profile?.user || user || {};

  /* ── secondary fields: everything NOT in primary card ── */
  const PRIMARY_KEYS = new Set(["serial_no", "roll_no", "name", "email", "phone_number", "username"]);
  const SKIP_KEYS    = new Set([
    "_id", "__v", "gym_id", "subscriptions", "image", "role",
    "is_approved", "is_banned", "createdAt", "updatedAt", "password",
  ]);

  const secondaryFields = Object.entries(u).filter(
    ([k]) => !PRIMARY_KEYS.has(k) && !SKIP_KEYS.has(k)
  );

  const fieldMeta = {
    dob:           { label: "Date of Birth", icon: <Cake      className="w-3 h-3" />, fmt: fmtDate },
    age:           { label: "Age",           icon: <UserIcon  className="w-3 h-3" />, fmt: (v) => v ? `${v} yrs` : "—" },
    gender:        { label: "Gender",        icon: <Users     className="w-3 h-3" /> },
    height:        { label: "Height",        icon: <Ruler     className="w-3 h-3" />, fmt: (v) => v ? `${v} cm` : "—" },
    weight:        { label: "Weight",        icon: <Weight    className="w-3 h-3" />, fmt: (v) => v ? `${v} kg` : "—" },
    blood_group:   { label: "Blood Group",   icon: <Droplets  className="w-3 h-3" /> },
    address:       { label: "Address",       icon: <MapPin    className="w-3 h-3" /> },
    aadhar_number: { label: "Aadhar No.",    icon: <Fingerprint className="w-3 h-3" /> },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.35em] font-black text-zinc-600">Aarambh Fitness</p>
          <h1 className="text-base md:text-lg font-black uppercase italic tracking-tight text-white leading-tight">
            Hey, {u.name?.split(" ")[0] || "Champ"} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* TODO: Uncomment when subscriptions page is ready */}
          {/* <button
            onClick={() => navigate("/user/subscriptions")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-white/5 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Calendar className="w-3 h-3" />
            Subscriptions
          </button> */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-white/5 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-5">

        {/* ══════════════════════════════
            MEMBERSHIP CARD — ATM size
        ══════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {loadingProfile ? (
            <div className="rounded-[2rem] border border-white/10 bg-zinc-900 p-8 flex items-center justify-center min-h-[220px]">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : profileError ? (
            <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-7 text-center text-red-400 font-bold text-sm">
              {profileError}
            </div>
          ) : noSub ? (
            <div className="rounded-[2rem] border border-white/10 bg-zinc-900/60 p-8 text-center">
              <Flame className="w-9 h-9 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">No active membership</p>
              <p className="text-zinc-700 text-xs mt-1.5 uppercase tracking-wider">Visit the gym to get started</p>
            </div>
          ) : (
            <div className={`relative rounded-[2rem] border bg-gradient-to-br ${theme.gradient} ${theme.border} px-7 py-6 overflow-hidden shadow-2xl ${theme.glow}`}>
              {/* background glow blob */}
              <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full blur-[70px] opacity-20 bg-white pointer-events-none" />

              {/* Row 1: plan badge + status */}
              <div className="flex items-center justify-between mb-5">
                <span className={`text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full ${theme.badge}`}>
                  {planName || "Membership"}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${urgency.bg} ${urgency.color}`}>
                  {urgency.text}
                </span>
              </div>

              {/* Days left — hero number */}
              <div className="mb-1">
                <span className={`text-[72px] md:text-[88px] font-black leading-none tracking-tighter ${theme.daysColor}`}>
                  {yetToStart ? "Yet to start" : daysLeft}
                </span>
              </div>
              <p className={`text-xs font-black uppercase tracking-[0.4em] mb-6 ${theme.accent} opacity-70`}>
                Days Remaining
              </p>

              {/* Progress bar */}
              <div className={`w-full h-1.5 rounded-full mb-3 ${theme.barTrack}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${theme.barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Dates row */}
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">
                <span>Purchased {fmtDate(sub?.start_date)}</span>
                <span>Expires {fmtDate(sub?.end_date)}</span>
              </div>

              {/* Bottom divider + plan name */}
              <div className="border-t border-white/5 pt-5">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${theme.accent}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>
                    {planName}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ══════════════════════════════
            SOCIAL SHARE CARDS
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp Group */}
          <motion.a
            href="https://chat.whatsapp.com/FXLSrBUeHVrCh1ucnQkG9G"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="group rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-900/20 via-zinc-900/50 to-zinc-900/30 backdrop-blur-xl p-5 hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-all">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-0.5">
                  Join Community
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  WhatsApp Group
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.a>

          {/* Google Review */}
          <motion.a
            href="https://maps.app.goo.gl/mXko6tsbzYk3FUCK6?g_st=ac"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="group rounded-2xl border border-white/5 bg-gradient-to-br from-yellow-900/20 via-zinc-900/50 to-zinc-900/30 backdrop-blur-xl p-5 hover:border-yellow-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-all">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-0.5">
                  Rate Us
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  Google Review
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.a>
        </div>

        {/* ══════════════════════════════
            INFO CARDS GRID
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ── Card 1: Primary Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Member Info
              </h2>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" />
                Verified
              </span>
            </div>

            <div className="space-y-3">
              <PrimaryRow icon={<Hash      className="w-3.5 h-3.5" />} label="Serial No"   value={fmtVal(u.serial_no || u.roll_no)} />
              <PrimaryRow icon={<UserIcon  className="w-3.5 h-3.5" />} label="Name"        value={fmtVal(u.name)} />
              {/* <PrimaryRow icon={<AtSign    className="w-3.5 h-3.5" />} label="Username"    value={fmtVal(u.username || u.email?.split("@")[0])} /> */}
              <PrimaryRow icon={<Phone     className="w-3.5 h-3.5" />} label="Phone"       value={fmtVal(u.phone_number)} />
              <PrimaryRow icon={<Mail      className="w-3.5 h-3.5" />} label="Email"       value={fmtVal(u.email)} isEmail />
            </div>
          </motion.div>

          {/* ── Card 2: Secondary Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl p-4"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3">
              Additional Details
            </h2>

            {secondaryFields.length === 0 ? (
              <p className="text-zinc-700 text-xs uppercase tracking-wider font-bold py-4 text-center">
                No additional data
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {secondaryFields.map(([key, val]) => {
                  const meta  = fieldMeta[key];
                  const label = meta?.label || key.replace(/_/g, " ");
                  const icon  = meta?.icon  || <ChevronRight className="w-3 h-3" />;
                  const display = meta?.fmt ? meta.fmt(val) : fmtVal(val);
                  return (
                    <SecondaryRow key={key} icon={icon} label={label} value={display} />
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Primary row — standard padding, readable
───────────────────────────────────────────── */
function PrimaryRow({ icon, label, value, isEmail }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-500 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">{label}</p>
        <p className={`text-sm font-semibold text-zinc-200 ${isEmail ? "truncate" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Secondary row — compact, small text
───────────────────────────────────────────── */
function SecondaryRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-1.5 py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-zinc-600 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 leading-none mb-0.5">
          {label}
        </p>
        <p className="text-xs font-medium text-zinc-300 truncate">{value}</p>
      </div>
    </div>
  );
}

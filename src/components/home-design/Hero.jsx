import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import QuickNav from "./QuickNav";
import { useNavigate } from "react-router-dom";

const LOGO_URL =
  "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902665/logo_jkq9mr.webp";

// Stars — varied sizes and positions for a natural starfield feel
const STARS = [
  // tiny (1px)
  { top: "5%",  left: "10%",  size: 1,   delay: 0,   dur: 3 },
  { top: "9%",  left: "33%",  size: 1,   delay: 1.4, dur: 4 },
  { top: "14%", left: "62%",  size: 1,   delay: 0.7, dur: 3.5 },
  { top: "7%",  left: "80%",  size: 1,   delay: 2.1, dur: 5 },
  { top: "20%", left: "5%",   size: 1,   delay: 0.3, dur: 4 },
  { top: "28%", left: "91%",  size: 1,   delay: 1.8, dur: 3 },
  { top: "38%", left: "22%",  size: 1,   delay: 2.6, dur: 4.5 },
  { top: "50%", left: "3%",   size: 1,   delay: 0.9, dur: 3.8 },
  { top: "60%", left: "78%",  size: 1,   delay: 1.2, dur: 4.2 },
  { top: "72%", left: "45%",  size: 1,   delay: 0.5, dur: 3.2 },
  { top: "82%", left: "12%",  size: 1,   delay: 2.3, dur: 5 },
  { top: "88%", left: "68%",  size: 1,   delay: 1.6, dur: 3.6 },
  { top: "93%", left: "30%",  size: 1,   delay: 0.2, dur: 4.8 },
  { top: "96%", left: "85%",  size: 1,   delay: 1.1, dur: 3.4 },
  // small (1.5px)
  { top: "3%",  left: "50%",  size: 1.5, delay: 0.8, dur: 4 },
  { top: "17%", left: "75%",  size: 1.5, delay: 2.0, dur: 5.5 },
  { top: "33%", left: "55%",  size: 1.5, delay: 0.4, dur: 3.7 },
  { top: "47%", left: "88%",  size: 1.5, delay: 1.7, dur: 4.3 },
  { top: "63%", left: "18%",  size: 1.5, delay: 2.9, dur: 3.9 },
  { top: "78%", left: "92%",  size: 1.5, delay: 0.6, dur: 4.6 },
  { top: "85%", left: "40%",  size: 1.5, delay: 1.3, dur: 5.2 },
  // medium (2px) — fewer, brighter
  { top: "11%", left: "44%",  size: 2,   delay: 1.0, dur: 6 },
  { top: "25%", left: "15%",  size: 2,   delay: 2.5, dur: 5 },
  { top: "42%", left: "70%",  size: 2,   delay: 0.1, dur: 4.8 },
  { top: "68%", left: "58%",  size: 2,   delay: 1.9, dur: 6.2 },
  { top: "90%", left: "22%",  size: 2,   delay: 0.7, dur: 5.4 },
  // bright accent stars (2.5px) — very few
  { top: "6%",  left: "25%",  size: 2.5, delay: 3.0, dur: 7 },
  { top: "55%", left: "95%",  size: 2.5, delay: 1.5, dur: 6.5 },
  { top: "76%", left: "7%",   size: 2.5, delay: 2.2, dur: 7.5 },
];

// Shooting star config
const SHOOTING_STARS = [
  { top: "15%", left: "20%", delay: 4,  dur: 1.2 },
  { top: "35%", left: "60%", delay: 9,  dur: 1.0 },
  { top: "60%", left: "10%", delay: 15, dur: 1.4 },
];

export default function Hero({ onOpenRegister }) {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-fit flex flex-col items-center justify-center overflow-hidden px-2 pt-15 md:pt-8 pb-12 md:pb-10"
    >
      {/* ── Space background layers ───────────────────────────────── */}

      {/* 1. Deep space nebula — faint coloured clouds */}
      {/* Purple/indigo cloud — top left */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "-15%", left: "-10%",
          width: "55%", height: "60%",
          background: "radial-gradient(ellipse at center, rgba(99,60,180,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Blue cloud — top right */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "-5%", right: "-8%",
          width: "45%", height: "50%",
          background: "radial-gradient(ellipse at center, rgba(30,80,200,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Warm amber/orange — bottom center (like a distant star cluster) */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          bottom: "-10%", left: "30%",
          width: "40%", height: "45%",
          background: "radial-gradient(ellipse at center, rgba(180,100,30,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Teal accent — mid left */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "40%", left: "-5%",
          width: "30%", height: "35%",
          background: "radial-gradient(ellipse at center, rgba(20,140,140,0.04) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* 2. Milky way band — a faint diagonal smear across the section */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(200,210,255,0.6) 45%, rgba(180,190,255,0.3) 55%, transparent 75%)",
          filter: "blur(30px)",
        }}
      />

      {/* 3. Twinkling stars */}
      {STARS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute z-0 rounded-full pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            backgroundColor: "#ffffff",
          }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 4. Shooting stars */}
      {SHOOTING_STARS.map((ss, i) => (
        <motion.div
          key={`ss-${i}`}
          className="absolute z-0 pointer-events-none"
          style={{
            top: ss.top,
            left: ss.left,
            width: 80,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)",
            borderRadius: 1,
            rotate: "-20deg",
            opacity: 0,
          }}
          animate={{
            x: [0, 200],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: ss.dur,
            repeat: Infinity,
            repeatDelay: ss.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 5. Vignette — keeps edges dark so stars don't bleed into nav/footer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(9,9,11,0.9) 100%)",
        }}
      />

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full px-2 md:px-6 lg:flex-row lg:items-center lg:text-left lg:gap-13 lg:max-w-7xl lg:pl-4 lg:mr-37">

        {/* LEFT — Logo */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-5 lg:mb-0 lg:w-[55%] lg:flex-shrink-0"
        >
          <img
            src={LOGO_URL}
            alt="Aarambh Fitness"
            className="w-full max-w-[470px] sm:max-w-[450px] md:max-w-[600px] lg:max-w-full h-auto mr-auto ml-0 lg:mx-0 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </motion.div>

        {/* RIGHT — QuickNav + tagline + CTA */}
        <div className="flex flex-col items-center lg:items-start lg:flex-1 lg:gap-4 lg:mt-15">
          <QuickNav />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-zinc-500 text-[10px] text-center md:text-sm max-w-xl mx-auto lg:mx-0 lg:mb-0 mb-8 font-sans tracking-[0.3em] md:tracking-[0.35em] uppercase font-black leading-relaxed opacity-60"
          >
            Power comes in response to need,{" "}
            <br className="hidden lg:block" />
            not a desire.{" "}
            <br className="md:hidden" />
            So tell me, do you need strength...{" "}
            <br className="hidden lg:block" />
            or are you just wishing for it?
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onOpenRegister}
              className="bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 text-white border border-white/10 px-10 py-4 rounded-full font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-white/5 cursor-pointer lg:ml-30"
            >
              Register Now!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

      </div>

      {/* Bounce arrow */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 text-zinc-700"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

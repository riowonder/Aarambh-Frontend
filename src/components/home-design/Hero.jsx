import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import QuickNav from "./QuickNav";
import { useNavigate } from "react-router-dom";

const LOGO_URL = "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902665/logo_jkq9mr.webp";

export default function Hero({ onOpenRegister }) {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-fit flex flex-col items-center justify-center overflow-hidden px-2 pt-15 md:pt-8 pb-12 md:pb-10"
    >
      {/* Background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-100/5 blur-[200px] rounded-full" />
      </div>

      {/* Main layout */}
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
            className="w-full max-w-[470px] sm:max-w-[450px] md:max-w-[600px] lg:max-w-full h-auto mr-auto ml-0 lg:mx-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
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

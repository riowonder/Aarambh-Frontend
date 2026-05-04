import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import QuickNav from "./QuickNav";
import logo from "../../assets/logo/logo.webp";
import { useNavigate } from "react-router-dom";

// Tiny Tailwind spacing guide:
// p = padding inside an element, m = margin outside an element.
// t/b/l/r mean top/bottom/left/right. Example: mt-5 = margin-top.
// px = left + right padding, py = top + bottom padding.
// md: and lg: mean "use this value on medium/large screens and above".

export default function Hero({ onOpenRegister }) {
  const navigate = useNavigate();

  return (
    // Whole hero area.
    // px-2 controls left/right breathing room.
    // pt-15 / md:pt-16 controls top space of the hero.
    // pb-12 / md:pb-20 controls bottom space of the hero.
    <section id="home" className="relative min-h-fit flex flex-col items-center justify-center overflow-hidden px-2 pt-15 md:pt-8 pb-12 md:pb-10">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        {/* w/h change glow size. blur changes how soft it looks. */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-100/5 blur-[200px] rounded-full" />
      </div>

      {/* Main layout: mobile/tablet stacks vertically; lg:flex-row makes desktop two columns. */}
      {/* lg:gap-4 controls horizontal space between logo and right-side content on desktop. */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full px-2 md:px-6 lg:flex-row lg:items-center lg:text-left lg:gap-13 lg:max-w-7xl lg:pl-4 lg:mr-37">

        {/* Logo block. mt-5 moves the logo block down on mobile/tablet. */}
        {/* lg:w-[42%] controls how much desktop width the logo column gets. */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-5 lg:mb-0 lg:w-[55%] lg:flex-shrink-0"
        >
          <img
            src={logo}
            alt="Aarambh Fitness"
            // Logo size:
            // max-w-[470px] = max logo width on mobile.
            // sm/md/lg versions change max size at bigger screen widths.
            // mx-auto centers it; lg:mx-0 aligns it left on desktop.
            className="w-full max-w-[470px] sm:max-w-[450px] md:max-w-[600px] lg:max-w-full h-auto mr-auto ml-0 lg:mx-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </motion.div>

        {/* Right side: QuickNav, tagline text, and button. */}
        {/* lg:gap-4 controls vertical spacing between these children on desktop only. */}
        <div className="flex flex-col items-center lg:items-start lg:flex-1 lg:gap-4 lg:mt-15">
          <QuickNav />

          {/* Tagline text. mb-8 creates space between tagline and Register button on mobile/tablet. */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            // text-[10px] / md:text-sm controls text size.
            // max-w-xl controls how wide the paragraph can get.
            // tracking controls letter spacing.
            // leading-relaxed controls line height.
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

          {/* CTA button wrapper. gap-4 is used if more buttons are added side by side. */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate("/user-register")}
              // Button size:
              // px-10 makes it wider. py-4 makes it taller.
              // text-lg changes label size. gap-3 is space between text and arrow.
              className="bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 text-white border border-white/10 px-10 py-4 rounded-full font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-white/5 cursor-pointer lg:ml-30"
            >
              Register Now!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

      </div>

      {/* Floating down arrow. bottom-10 controls how far it sits from the bottom. */}
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

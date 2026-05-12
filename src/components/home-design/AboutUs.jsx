import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, Heart, Zap } from "lucide-react";

const highlights = [
  {
    icon: Dumbbell,
    title: "State-of-the-Art Equipment",
    desc: "Premium KFS setup with cardio machines, functional training zone, and heavy-duty strength area."
  },
  {
    icon: Heart,
    title: "Unisex Community",
    desc: "A welcoming space for everyone — built on respect, inclusion, and shared goals."
  },
  {
    icon: Zap,
    title: "Results-Driven Training",
    desc: "Weight loss, cardio fitness, or serious strength training — we're equipped for your progress."
  }
];

const SLIDE_DURATION = 3000; // ms per card

function MobileCardSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % highlights.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const item = highlights[active];

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex items-start gap-4"
        >
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center flex-shrink-0">
            <item.icon className="w-4 h-4 text-zinc-300" />
          </div>

          {/* Text */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wide mb-1">
              {item.title}
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              {item.desc}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {highlights.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to card ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "bg-zinc-300 w-4" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function AboutUs() {
  return (
    <section id="about" className="pt-1 pb-24 relative overflow-hidden bg-zinc-950">

      {/* Decorative glow — matches Testimonials section */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-zinc-500/5 blur-[120px] rounded-full translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-zinc-700/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section label + heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500 mb-4 inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-zinc-800" />
              Who We Are
            </h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
              About <br /> <span className="text-zinc-500">Aarambh</span>
            </h3>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] italic md:text-right max-w-xs"
          >
            Top-rated unisex fitness center <br /> Mango, Jamshedpur
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — story text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-zinc-300 text-lg leading-relaxed font-medium">
              Every strong journey starts with a single step — a new beginning.{" "}
              <span className="text-white font-bold">Welcome to Aarambh Fitness.</span>
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              We are more than just a place to work out. We are a dedicated community built to help you push your limits and achieve your health goals. Whether you are looking for effective weight loss programs, cardio fitness, or serious strength training in Jamshedpur, our facility is entirely equipped for your progress.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              We feature a brand new, state-of-the-art <span className="text-zinc-200 font-semibold">KFS setup</span> that includes premium cardio machines, a comprehensive functional training zone, and a heavy-duty strength area.
            </p>

            {/* Divider line */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-zinc-600 to-transparent mt-2" />

            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">
              Mango, Jamshedpur · Est. Aarambh Fitness
            </p>
          </motion.div>

          {/* Right — highlight cards */}

          {/* Desktop: stacked cards (lg and above) */}
          <div className="hidden lg:flex flex-col gap-5">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex items-start gap-5 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-white/10 transition-colors">
                  <item.icon className="w-5 h-5 text-zinc-300" />
                </div>

                {/* Text */}
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-1">
                    {item.title}
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: auto-sliding single card (below lg) */}
          <div className="lg:hidden">
            <MobileCardSlider />
          </div>

        </div>

      </div>
    </section>
  );
}

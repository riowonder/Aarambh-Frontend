import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "1 Month",
    price: "₹1,499",
    period: "/month",
    points: [
      "Perfect for beginners",
      "Build your first routine",
      "No long-term commitment"
    ],
    color: "zinc-900"
  },
  {
    name: "3 Month",
    price: "₹2,999",
    period: "/month",
    points: [
      "Best for real results",
      "Stay consistent, see change",
      "Most chosen plan"
    ],
    color: "zinc-800",
    popular: true
  },
  {
    name: "6 Month",
    price: "₹4,999",
    period: "/month",
    points: [
      "Serious transformation",
      "Train. Recover. Grow.",
      "All-inclusive experience"
    ],
    color: "zinc-900"
  },
  {
    name: "1 year",
    price: "₹8,499",
    period: "/month",
    points: [
      "Ultimate commitment",
      "Live the fitness lifestyle",
      "Maximum value plan"
    ],
    color: "zinc-900"
  }
];

interface PricingProps {
  onOpenRegister: () => void;
}

export default function Pricing({ onOpenRegister }: PricingProps) {
  return (
    <section id="pricing" className="py-8 md:py-10 lg:py-12 bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-100/5 blur-[150px] rounded-full z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-600">
            Our Best Plans
          </h2>
          <p className="text-zinc-500 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-black opacity-80">
            Transparent Pricing for Every Goal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-[2.5rem] border border-white/5 flex flex-col ${
                plan.popular ? 'bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl shadow-white/5' : 'bg-zinc-900/40 backdrop-blur-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-0">
                <h3 className="text-2xl font-black uppercase italic mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.period}</span>
                </div>
              </div>

              {/* Centered Plan Points Container */}
              <div className="flex-grow flex flex-col justify-center py-9">
                <div className={`flex flex-col gap-2.5 border-l-2 pl-4 transition-colors duration-500 ${
                  plan.popular ? 'border-white/30' : 'border-zinc-700'
                }`}>
                  <p className={`text-base uppercase tracking-tight font-bold leading-tight ${plan.popular ? 'text-white' : 'text-zinc-100'}`}>
                    {plan.points[0]}
                  </p>
                  <p className={`text-sm uppercase tracking-wide font-medium leading-tight ${plan.popular ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {plan.points[1]}
                  </p>
                  <p className={`text-[10px] uppercase tracking-widest font-medium leading-tight opacity-60 ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {plan.points[2]}
                  </p>
                </div>
              </div>

              <button 
                onClick={onOpenRegister}
                className={`w-full py-4 rounded-full font-black uppercase tracking-widest transition-all ${
                  plan.popular 
                    ? 'bg-white text-black hover:scale-105' 
                    : 'bg-zinc-100 text-black hover:bg-white'
                }`}
              >
                Join Now
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center px-4"
        >
          <p className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed">
            Weekly and custom-day plans available. <br className="md:hidden" />
            <span className="text-zinc-100">Contact the gym for details</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

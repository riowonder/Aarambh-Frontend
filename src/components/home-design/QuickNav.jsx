import { motion } from "motion/react";
import { MapPin, Image, Tag, Star } from "lucide-react";
import { useState } from "react";

const navItems = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "testimonials", label: "Reviews", icon: Star },
  { id: "pricing", label: "Pricing", icon: Tag },
];

export default function QuickNav() {
  const [activeTab, setActiveTab] = useState(navItems[1].id);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center my-2 md:my-3 w-full px-4 text-center">
      <div className="relative flex flex-wrap items-center justify-center bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-1.5 md:p-1.5 rounded-[2rem] md:rounded-full shadow-2xl max-w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative z-10 flex items-center gap-2 md:gap-3 px-5 md:px-8 py-2.5 md:py-3.5 rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.05em] transition-colors duration-300 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 ${isActive ? "text-white" : "text-zinc-600"}`} />
              {item.label}
              
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 rounded-full -z-10 border border-white/20 shadow-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

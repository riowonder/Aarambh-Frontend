import { motion } from "motion/react";
import { MapPin, Image, Tag, Star } from "lucide-react";
import { useState } from "react";

// These are the small navigation buttons shown inside the QuickNav pill.
// id must match the section id on the page, because scrollToSection uses it.
const navItems = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "testimonials", label: "Reviews", icon: Star },
  { id: "pricing", label: "Pricing", icon: Tag },
];

export default function QuickNav() {
  // activeTab decides which button gets the highlighted background pill.
  const [activeTab, setActiveTab] = useState(navItems[1].id);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // QuickNav outer wrapper.
    // mt-0 / md:mt-1 = space above QuickNav, toward the logo.
    // mb-7 / md:mb-8 = space below QuickNav, toward the tagline text.
    // px-4 adds side padding on small screens; lg:px-0 removes it on desktop.
    <div className="flex justify-center mt-0 mb-7 md:mt-1 md:mb-8 w-full px-4 text-center lg:justify-start lg:px-0">
      {/* The dark rounded pill around all buttons. p-1.5 controls inside padding. */}
      <div className="relative flex flex-wrap lg:flex-nowrap items-center justify-center bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-1.5 rounded-[2rem] md:rounded-full shadow-2xl max-w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              // Button size:
              // px-5 = left/right padding, py-2.5 / md:py-3 = top/bottom padding.
              // gap-2 = space between icon and label.
              // text-[10px] / md:text-xs = label size.
              className={`relative z-10 flex items-center gap-2 md:gap-2 px-5 md:px-5 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.05em] transition-colors duration-300 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {/* Icon size. Increase w/h to make icons bigger. */}
              <item.icon className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 ${isActive ? "text-white" : "text-zinc-600"}`} />
              {item.label}

              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  // The moving highlighted background behind the active button.
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

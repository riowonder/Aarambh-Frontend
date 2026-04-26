import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Clock, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import chiragImg from "../assets/chirag.webp";
import milanImg from "../assets/milan.webp";
import prisanshuImg from "../assets/prisanshu.webp";
import amirImg from "../assets/amir.webp";
import princyImg from "../assets/princy.webp";

const trainers = [
  {
    name: "Prisanshu",
    role: "POWERLIFTING SPECIALIST",
    bio: "Building humans into machines through absolute strength and mastery of the big three lifts.",
    image: prisanshuImg
  },
  {
    name: "Milan",
    role: "TRANSFORMATION COACH",
    bio: "Specialist in body recomposition, HIIT, and functional bodyweight training.",
    image: milanImg
  },
  {
    name: "Amir",
    role: "STRENGTH & TRANSFORMATION",
    bio: "Specialist in functional movement, raw strength, and total physical transformation.",
    image: amirImg
  },
  {
    name: "Princy",
    role: "COMBAT COACH",
    bio: "Specialist in fight-camp fitness and accelerated weight loss",
    image: princyImg
  },
    {
    name: "Chirag",
    role: "PT & NUTRITIONIST",
    bio: "Specialist in mobility, rehab, and sports nutrition.",
    image: chiragImg
  }
];

export default function Location() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % trainers.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + trainers.length) % trainers.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const openDirections = () => {
    window.open("https://www.google.com/maps/dir/?api=1&destination=AARAMBH+FITNESS+UNISEX+GYM+Mango+Jamshedpur", "_blank");
  };

  const getTrainerImage = (image: string, name: string) => {
    if (!image || image.trim() === "") {
      return `https://picsum.photos/seed/${name}/600/800`;
    }
    return image;
  };

  return (
    <section id="location" className="py-12 md:py-24 bg-zinc-950 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <div className="mb-12">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-600">
                Aarambh HQ
              </h2>
              <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Where Champions are Forged</p>
            </div>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h4 className="text-lg font-black uppercase italic">Address</h4>
                    <button 
                      onClick={openDirections}
                      className="px-4 py-1.5 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:border-white/30 hover:scale-105 transition-all shadow-xl shadow-black/40"
                    >
                      Directions
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-zinc-500 leading-relaxed text-sm md:text-base">
                    Jaishiv Trade Center, 5th Floor<br />
                    Near Suman Hotel, Dimna Road<br />
                    Mango, Jamshedpur – 831012<br />
                    Jharkhand, India
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase italic mb-1">Hours</h4>
                  <p className="text-zinc-500 text-sm md:text-base">Mon - Sat: 5:00 AM - 11:00 PM<br />Sunday: Closed</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase italic mb-1">Contact</h4>
                  <p className="text-zinc-500 text-sm">+91 7488805196</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trainers Slideshow Section (Replaces Map) */}
          <div className="relative group mt-16 lg:mt-0">
            <h3 className="absolute -top-12 left-0 text-zinc-100 font-black uppercase italic tracking-widest text-xs flex items-center gap-3">
              Meet Our Trainers
              <div className="h-[1px] w-12 bg-zinc-800" />
            </h3>

            <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 50 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 50) handlePrev();
                    else if (info.offset.x < -50) handleNext();
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <img 
                    src={getTrainerImage(trainers[currentIndex].image, trainers[currentIndex].name)} 
                    className="w-full h-full object-cover select-none pointer-events-none"
                    alt={trainers[currentIndex].name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />
                  
                  {/* Trainer Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-2">
                        {trainers[currentIndex].name}
                      </h4>
                      <p className="text-white/80 font-black uppercase tracking-[0.3em] text-[8px] md:text-xs mb-3 md:mb-4 bg-white/10 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 inline-block">
                        {trainers[currentIndex].role}
                      </p>
                      <p className="text-zinc-400 text-xs md:text-sm max-w-sm leading-relaxed mb-6">
                        {trainers[currentIndex].bio}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons - Visible on Desktop only, subtle design */}
              <div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-6 pointer-events-none z-20">
                <button 
                  onClick={handlePrev}
                  className="pointer-events-auto w-10 h-10 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="pointer-events-auto w-10 h-10 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="absolute top-10 right-10 flex flex-col gap-2 z-10">
                {trainers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "h-6 bg-white" : "bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

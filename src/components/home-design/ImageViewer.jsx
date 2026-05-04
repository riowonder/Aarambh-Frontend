import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function ImageViewer({ isOpen, onClose, images, currentIndex, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center font-sans"
        >
          <div className="absolute inset-0 bg-neutral-950 pointer-events-none" />
          
          <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none hidden lg:block">
            <img 
              src={images[currentIndex]} 
              className="w-full h-full object-cover blur-[60px] scale-110"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Close Button UI */}
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-end z-[250]">
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Content */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) handlePrev();
                  else if (info.offset.x < -50) handleNext();
                }}
                className="absolute inset-0 flex items-center justify-center p-4 md:p-10 lg:p-14 touch-none z-[230] will-change-transform"
              >
                <img
                  src={images[currentIndex]}
                  alt={`Full view ${currentIndex}`}
                  className="max-w-full max-h-full w-full h-full object-contain pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav Buttons - Hidden on Mobile/Tablet */}
          <button 
            onClick={handlePrev}
            className="absolute left-10 z-[240] w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-full hidden lg:flex items-center justify-center transition-all backdrop-blur-md border border-white/5 group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-10 z-[240] w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-full hidden lg:flex items-center justify-center transition-all backdrop-blur-md border border-white/5 group"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer Tracker */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-[250] pointer-events-none">
            <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white font-black text-[10px] tracking-[0.4em] uppercase pointer-events-auto">
              {currentIndex + 1} <span className="opacity-30 mx-2">/</span> {images.length}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

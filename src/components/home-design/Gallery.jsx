import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import GalleryModal from "./GalleryModal";
import ImageViewer from "./ImageViewer";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Import local gallery images
import img1 from "../../assets/Gallery-imgs/Aarambh Gallery (1).webp";
import img2 from "../../assets/Gallery-imgs/Aarambh Gallery (2).webp";
import img3 from "../../assets/Gallery-imgs/Aarambh Gallery (3).webp";
import img4 from "../../assets/Gallery-imgs/Aarambh Gallery (4).webp";
import img5 from "../../assets/Gallery-imgs/Aarambh Gallery (5).webp";
import img6 from "../../assets/Gallery-imgs/Aarambh Gallery (6).webp";
import img7 from "../../assets/Gallery-imgs/Aarambh Gallery (7).webp";
import img8 from "../../assets/Gallery-imgs/Aarambh Gallery (8).webp";
import img9 from "../../assets/Gallery-imgs/Aarambh Gallery (9).webp";
import img10 from "../../assets/Gallery-imgs/Aarambh Gallery (10).webp";
import img11 from "../../assets/Gallery-imgs/Aarambh Gallery (11).webp";

export default function Gallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewerState, setViewerState] = useState({ isOpen: false, index: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const images = [
    { src: img1, ratio: "aspect-video" },
    { src: img2, ratio: "aspect-video" },
    { src: img3, ratio: "aspect-video" },
    { src: img4, ratio: "aspect-video" },
    { src: img5, ratio: "aspect-video" },
    { src: img6, ratio: "aspect-video" },
    { src: img7, ratio: "aspect-video" },
    { src: img8, ratio: "aspect-video" },
    { src: img9, ratio: "aspect-video" },
    { src: img10, ratio: "aspect-video" },
    { src: img11, ratio: "aspect-video" },
  ];

  const allImageUrls = images.map(img => img.src);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentSlide]);

  const openViewer = (index) => {
    setViewerState({ isOpen: true, index });
  };

  return (
    <section id="gallery" className="py-12 md:py-20 bg-zinc-950 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-600">
              Our Arena
            </h2>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] md:text-sm font-bold">Experience the Vibe of Aarambh Fitness</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-xs md:text-sm hover:text-zinc-300 transition-colors"
          >
            Explore Full Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative group/gallery aspect-video max-w-5xl mx-auto">
          {/* Main Slideshow Container */}
          <div className="relative w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentSlide}
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
                onClick={() => openViewer(currentSlide)}
                className="absolute inset-0 cursor-pointer"
              >
                <img 
                  src={images[currentSlide].src} 
                  alt={`Slide ${currentSlide}`} 
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Overlay with info */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end pointer-events-none">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-white font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] bg-white/10 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10">
                      View Space {currentSlide + 1}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Visible on Desktop only, subtle design */}
            <div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 pointer-events-none">
              <button 
                onClick={handlePrev}
                className="pointer-events-auto w-10 h-10 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/5 opacity-0 group-hover/gallery:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNext}
                className="pointer-events-auto w-10 h-10 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/5 opacity-0 group-hover/gallery:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentSlide ? 1 : -1);
                  setCurrentSlide(i);
                }}
                className={`h-1 transition-all duration-300 rounded-full ${i === currentSlide ? "w-8 bg-white" : "w-3 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <GalleryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        images={images} 
        onOpenViewer={openViewer}
      />

      <ImageViewer 
        isOpen={viewerState.isOpen}
        currentIndex={viewerState.index}
        images={allImageUrls}
        onClose={() => setViewerState({ ...viewerState, isOpen: false })}
        onNavigate={(index) => setViewerState({ ...viewerState, index })}
      />
    </section>
  );
}

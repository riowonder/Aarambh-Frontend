import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import GalleryModal from "./GalleryModal";
import ImageViewer from "./ImageViewer";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";


export default function Gallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewerState, setViewerState] = useState({ isOpen: false, index: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const images = [
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902283/Aarambh_Gallery_1_lsf21b.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902284/Aarambh_Gallery_2_jk3pqx.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902285/Aarambh_Gallery_3_ouahc6.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902286/Aarambh_Gallery_4_gmxjwr.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902287/Aarambh_Gallery_5_txzxbh.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902288/Aarambh_Gallery_6_rrqxjx.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902279/Aarambh_Gallery_7_gu1uw6.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902280/Aarambh_Gallery_8_pjb9qi.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902280/Aarambh_Gallery_9_oourur.webp",  ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902281/Aarambh_Gallery_10_z76o6a.webp", ratio: "aspect-video" },
    { src: "https://res.cloudinary.com/dbvbnarn7/image/upload/v1777902282/Aarambh_Gallery_11_zlw0xi.webp", ratio: "aspect-video" },
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
    setIsModalOpen(false);
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
                onClick={() => setIsModalOpen(true)}
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

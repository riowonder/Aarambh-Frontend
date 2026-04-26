import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface GalleryImage {
  src: string;
  ratio: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  onOpenViewer: (index: number) => void;
}

export default function GalleryModal({ isOpen, onClose, images, onOpenViewer }: GalleryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full sm:h-auto sm:max-h-[85vh] md:max-h-[90vh] max-w-7xl bg-zinc-900 border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md px-6 md:px-8 py-5 md:py-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                Full <span className="text-zinc-100">Gallery</span>
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar md:scrollbar-default overscroll-contain">
              <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onOpenViewer(index)}
                    className={`relative break-inside-avoid rounded-2xl overflow-hidden group border border-white/5 cursor-pointer ${img.ratio}`}
                  >
                    <img 
                      src={img.src} 
                      alt={`Gallery Full ${index}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

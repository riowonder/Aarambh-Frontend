import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-8 flex items-center justify-center pointer-events-none">
        {/* Notch Navbar - Always Centered */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-zinc-900/80 md:backdrop-blur-2xl border border-white/10 px-5 md:px-12 py-3 md:py-5 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black/50 group cursor-pointer pointer-events-auto"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-xs md:text-base font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-white font-display italic group-hover:text-zinc-400 transition-colors whitespace-nowrap">
          Aarambh Fitness
        </span>
      </motion.div>

      {/* Hamburger / Dropdown Trigger - Positioned Absolute Right */}
      <div 
        className="absolute right-4 md:right-6 pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence>
          {!isScrolled && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all border border-white/10 hover:bg-white/5 active:scale-90 ${isDropdownOpen ? 'bg-white/10' : 'bg-transparent'}`}
            >
              {isDropdownOpen ? <X className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Menu className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-4 w-48 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[60]"
            >
              <ul className="py-2">
                <li>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/signup");
                    }}
                    className="w-full text-left px-6 py-3 text-sm font-black uppercase italic tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Join Arena
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-6 py-3 text-sm font-black uppercase italic tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Member Login
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

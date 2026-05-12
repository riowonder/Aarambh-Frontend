import Navbar from "../../components/home-design/Navbar";
import Hero from "../../components/home-design/Hero";
import Gallery from "../../components/home-design/Gallery";
import Testimonials from "../../components/home-design/Testimonials";
import AboutUs from "../../components/home-design/AboutUs";
import Pricing from "../../components/home-design/Pricing";
import Location from "../../components/home-design/Location";
import LoginModal from "../../components/home-design/LoginModal";
import { useEffect, useState } from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import styles from "./landing_page.module.css";
import { useNavigate } from "react-router-dom";

export default function Home({ openLoginOnLoad = false }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (openLoginOnLoad) setIsLoginOpen(true);
  }, [openLoginOnLoad]);

  const goToRegister = () => navigate("/user-register");

  return (
    <main className={`${styles.landingRoot} min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white`}>
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={goToRegister}
      />

      <Hero onOpenRegister={goToRegister} />
      <Gallery />
      <Testimonials />
      <AboutUs />
      <Pricing onOpenRegister={goToRegister} />
      <Location />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={goToRegister}
      />

      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-row flex-wrap md:grid md:grid-cols-3 items-center justify-between gap-y-6 md:gap-0">
          <div className="flex items-center justify-start md:justify-start w-auto md:w-full">
            <span className="text-2xl font-black tracking-tighter uppercase italic">Aarambh <br/>fitness</span>
          </div>
          <div className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold text-center w-full order-3 md:order-3 mt-2 md:mt-1 flex items-center justify-center gap-0">
            @2026 Aarambh Fitness. <br/>All rights reserved.
          </div>
          <div className="flex gap-4 justify-end md:justify-end w-auto md:w-full order-2 md:order-3">
            <a href="https://www.instagram.com/aarambhfitnesss?igsh=MXd3bzY1eXlxcTVmag==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/share/18kBoRhZLJ/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@aarambhfitness" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

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
      <footer className="border-t border-white/5 bg-zinc-950 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between gap-6">
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Aarambh <br />fitness
            </span>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://www.instagram.com/aarambhfitnesss?igsh=MXd3bzY1eXlxcTVmag=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/18kBoRhZLJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@aarambhfitness"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-5 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              © 2026 Aarambh Fitness. All rights reserved.
            </p>
            <div className="flex shrink-0 items-center gap-1.5" aria-label="Designed by Synapse">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                Designed by
              </span>
              <span className="relative block h-10 w-36 overflow-hidden" aria-hidden="true">
                <img
                  src="https://res.cloudinary.com/dxpcwv30u/image/upload/v1791043666/noBgSynapse_u9e73w.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 w-40 max-w-none -translate-x-1/2 -translate-y-1/2"
                  loading="lazy"
                />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

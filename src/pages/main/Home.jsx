/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "../../components/home-design/Navbar";
import Hero from "../../components/home-design/Hero";
import Gallery from "../../components/home-design/Gallery";
import Testimonials from "../../components/home-design/Testimonials";
import Pricing from "../../components/home-design/Pricing";
import Location from "../../components/home-design/Location";
import LoginModal from "../../components/home-design/LoginModal";
import RegisterModal from "../../components/home-design/RegisterModal";
import { useState } from "react";
import { Instagram, Facebook } from "lucide-react";
import styles from "./landing_page.module.css";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
  <main className={`${styles.landingRoot} min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white`}>
      <Navbar 
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />
      
      <Hero onOpenRegister={() => setIsRegisterOpen(true)} />
      <Gallery />
      <Testimonials />
      <Pricing onOpenRegister={() => setIsRegisterOpen(true)} />
      <Location />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
      
      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:grid md:grid-cols-3 items-center gap-8 md:gap-0">
          {/* Brand Name - Left on Desktop */}
          <div className="flex items-center md:justify-start w-full">
            <span className="text-2xl font-black tracking-tighter uppercase italic">Aarambh <br/>fitness</span>
          </div>
          
          {/* Copyright - Center on Desktop */}
          <div className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold text-center w-full order-3 md:order-3 mt-8 md:mt-1 flex items-center justify-center gap-0">
            <span className="mr-0.5"></span>@2026 Aarambh Fitness. <br/>All rights reserved.
          </div>

          {/* Social Handles - Right on Desktop */}
          <div className="flex gap-6 justify-center md:justify-end w-full order-2 md:order-3">
            <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:scale-110 transition-all shadow-xl shadow-black/20">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

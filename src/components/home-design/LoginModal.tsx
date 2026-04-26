import { motion, AnimatePresence } from "motion/react";
import { X, LogIn, User, Calendar, Phone, ArrowRight } from "lucide-react";
import { useState, FormEvent } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onOpenRegister }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder for login logic with new fields
    console.log("Login attempted with:", { username, dob, phone });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-hidden">
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
            transition={{ duration: 0.1 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-12 flex flex-col items-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-all border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
              <LogIn className="w-8 h-8 text-white" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
                Member <span className="text-zinc-500">Portal</span>
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                Access your arena dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-4">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-4">
                  Date of Birth
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-4">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5 active:scale-[0.98]"
                >
                  Enter Arena
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-[10px] font-black uppercase italic tracking-widest text-zinc-600">
                New to Aarambh? <span 
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="text-white cursor-pointer hover:underline"
                >Get Membership</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


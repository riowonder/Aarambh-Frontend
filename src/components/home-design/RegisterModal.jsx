import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Phone, MapPin, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

const plans = [
  { name: "1 Month", price: "₹1,499" },
  { name: "3 Month", price: "₹2,999" },
  { name: "6 Month", price: "₹4,999" },
  { name: "1 Year", price: "₹8,499" },
];

export default function RegisterModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
    plan: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectPlan = (planName) => {
    setFormData((prev) => ({ ...prev, plan: planName }));
    nextStep();
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => setStep(1), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-zinc-950/90"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col min-h-[500px]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {step === 3 ? "Success!" : "New Registration"}
                </h2>
                {step < 3 && (
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    Step {step} of 2: {step === 1 ? "Your Details" : "Choose Plan"}
                  </p>
                )}
              </div>
              <button 
                onClick={resetAndClose}
                className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-2">Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-2">Username</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email ID" className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-2">Mobile</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-zinc-600" />
                        <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" rows={3} className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm resize-none" />
                      </div>
                    </div>

                    <button 
                      onClick={nextStep}
                      className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 mt-6"
                    >
                      Choose Your Plan
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {plans.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => selectPlan(p.name)}
                        className="group p-6 bg-zinc-800/50 border border-white/5 rounded-2xl text-left hover:bg-zinc-800 hover:border-white/20 transition-all flex justify-between items-center"
                      >
                        <div>
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Plan</p>
                          <h4 className="text-xl font-black uppercase italic text-white">{p.name}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Starting at</p>
                          <p className="text-xl font-black text-white">{p.price}</p>
                        </div>
                      </button>
                    ))}
                    <button 
                      onClick={prevStep}
                      className="col-span-full mt-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to details
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 bg-zinc-100/10 border border-white/10 rounded-full flex items-center justify-center mb-8">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                      Thanks for <br/> registration!
                    </h3>
                    <p className="text-zinc-400 text-sm max-w-xs leading-relaxed uppercase tracking-wide font-medium">
                      Confirmation you will be notified through email.
                    </p>
                    <button 
                      onClick={resetAndClose}
                      className="mt-10 bg-white text-black px-12 py-4 rounded-full font-black uppercase italic tracking-[0.2em] text-xs"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

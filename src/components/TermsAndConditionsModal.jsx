import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-2xl max-h-[85vh] bg-zinc-900 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 sm:px-6 sm:py-5 border-b border-white/10 flex justify-between items-center bg-zinc-900/90 z-10">
              <h2 className="text-base sm:text-xl font-black uppercase italic tracking-widest text-white">
                Terms and Conditions
              </h2>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto text-zinc-300 text-sm space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">1. Membership & Payments</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Non-Refundable:</strong> All fees are strictly non-refundable and non-transferable under any circumstances.</li>
                  <li><strong className="text-white">Renewals:</strong> Monthly membership fees must be paid in advance by your designated due date.</li>
                  <li><strong className="text-white">Pause/Freeze Policy:</strong> Memberships may only be frozen for verified medical emergencies (limit: once per year, for a maximum of 7 days).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">2. Health & Safety Disclaimer</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Physical Fitness:</strong> By joining, members confirm they are physically fit and have no medical conditions that prohibit strenuous exercise.</li>
                  <li><strong className="text-white">Self-Responsibility:</strong> You must disclose any pre-existing injuries or medical issues to the trainers before starting. Aarmabh Fitness management is not liable for any injuries or accidents sustained during workouts.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">3. Code of Conduct</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Dress Code:</strong> Proper workout attire and clean indoor athletic shoes are mandatory. Outdoor shoes are strictly prohibited on the gym floor.</li>
                  <li><strong className="text-white">Equipment Handling:</strong> Treat all equipment with respect. You must re-rack your weights and return accessories to their proper places after use.</li>
                  <li><strong className="text-white">Behavior:</strong> Respect staff and fellow members. Abusive language, altercations, or misbehavior will result in the immediate cancellation of your membership.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">4. Personal Belongings</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Valuables:</strong> Members are solely responsible for the safety of their own valuables (phones, wallets, jewelry). Management accepts no responsibility for lost, stolen, or damaged items on the premises.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">5. Timings & Right of Admission</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Operating Hours:</strong> Members must strictly adhere to the official opening and closing hours. Gym holidays will be communicated in advance via the notice board or WhatsApp group.</li>
                  <li><strong className="text-white">Right of Admission:</strong> Management reserves the right of admission and retains the authority to terminate any membership without prior notice if these rules are violated.</li>
                </ul>
              </div>
            </div>
            
            <div className="px-4 py-3 sm:px-6 sm:py-5 border-t border-white/10 flex justify-end bg-zinc-900/90 z-10">
              <button 
                onClick={onClose}
                className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase italic tracking-widest text-xs hover:bg-zinc-200 transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

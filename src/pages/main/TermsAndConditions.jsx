import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-4xl flex flex-col">
        <Link 
          to="/" 
          className="self-start mb-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full flex flex-col"
        >
          <div className="py-6 sm:py-8 border-b border-white/10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic tracking-widest text-white">
              Terms and Conditions
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base mt-2 font-medium">
              Please read these terms carefully before using our services.
            </p>
          </div>
          
          <div className="py-8 text-zinc-300 text-sm sm:text-base space-y-6 md:space-y-8 leading-relaxed">
            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-wide text-base sm:text-lg">1. Membership & Payments</h3>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-white">Non-Refundable:</strong> All fees are strictly non-refundable and non-transferable under any circumstances.</li>
                <li><strong className="text-white">Renewals:</strong> Monthly membership fees must be paid in advance by your designated due date.</li>
                <li><strong className="text-white">Pause/Freeze Policy:</strong> Memberships may only be frozen for verified medical emergencies (limit: once per year, for a maximum of 7 days).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-wide text-base sm:text-lg">2. Health & Safety Disclaimer</h3>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-white">Physical Fitness:</strong> By joining, members confirm they are physically fit and have no medical conditions that prohibit strenuous exercise.</li>
                <li><strong className="text-white">Self-Responsibility:</strong> You must disclose any pre-existing injuries or medical issues to the trainers before starting. Aarmabh Fitness management is not liable for any injuries or accidents sustained during workouts.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-wide text-base sm:text-lg">3. Code of Conduct</h3>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-white">Dress Code:</strong> Proper workout attire and clean indoor athletic shoes are mandatory. Outdoor shoes are strictly prohibited on the gym floor.</li>
                <li><strong className="text-white">Equipment Handling:</strong> Treat all equipment with respect. You must re-rack your weights and return accessories to their proper places after use.</li>
                <li><strong className="text-white">Behavior:</strong> Respect staff and fellow members. Abusive language, altercations, or misbehavior will result in the immediate cancellation of your membership.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-wide text-base sm:text-lg">4. Personal Belongings</h3>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-white">Valuables:</strong> Members are solely responsible for the safety of their own valuables (phones, wallets, jewelry). Management accepts no responsibility for lost, stolen, or damaged items on the premises.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-wide text-base sm:text-lg">5. Timings & Right of Admission</h3>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-white">Operating Hours:</strong> Members must strictly adhere to the official opening and closing hours. Gym holidays will be communicated in advance via the notice board or WhatsApp group.</li>
                <li><strong className="text-white">Right of Admission:</strong> Management reserves the right of admission and retains the authority to terminate any membership without prior notice if these rules are violated.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

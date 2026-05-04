import { motion, AnimatePresence } from "motion/react";
import { X, LogIn, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function LoginModal({ isOpen, onClose, onOpenRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, dobDay, dobMonth, dobYear } = formData;

    if (!dobDay || !dobMonth || !dobYear) {
      toast.error("Please enter a valid date of birth");
      return;
    }

    setLoading(true);
    try {
      const dd = String(dobDay).padStart(2, "0");
      const mm = String(dobMonth).padStart(2, "0");
      const yyyy = String(dobYear);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user-login`,
        { email, dob: `${dd}/${mm}/${yyyy}` },
        { withCredentials: true }
      );

      login(response.data.user);
      toast.success("Welcome back!");
      onClose();
      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-12 flex flex-col items-center"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-all border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
              <LogIn className="w-8 h-8 text-white" />
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
                Member <span className="text-zinc-500">Portal</span>
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                Access your arena dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-4">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="xyz@example.com"
                    autoComplete="email"
                    required
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-4">
                  Date of Birth
                </label>
                <div className="flex gap-3">
                  {/* Day */}
                  <input
                    type="number"
                    name="dobDay"
                    value={formData.dobDay}
                    onChange={handleInputChange}
                    placeholder="DD"
                    min={1}
                    max={31}
                    inputMode="numeric"
                    required
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {/* Month */}
                  <input
                    type="number"
                    name="dobMonth"
                    value={formData.dobMonth}
                    onChange={handleInputChange}
                    placeholder="MM"
                    min={1}
                    max={12}
                    inputMode="numeric"
                    required
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {/* Year */}
                  <input
                    type="number"
                    name="dobYear"
                    value={formData.dobYear}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    min={1900}
                    max={new Date().getFullYear()}
                    inputMode="numeric"
                    required
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all text-sm font-medium text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Enter Arena
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[10px] font-black uppercase italic tracking-widest text-zinc-600">
                New to Aarambh?{" "}
                <span
                  onClick={() => { onClose(); onOpenRegister(); }}
                  className="text-white cursor-pointer hover:underline"
                >
                  Get Membership
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

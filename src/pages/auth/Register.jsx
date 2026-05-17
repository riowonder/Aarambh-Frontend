import { motion, AnimatePresence } from "motion/react";
import {
  User, Mail, Phone, MapPin, Check, ArrowRight, ArrowLeft,
  Calendar, Hash, Droplets, ImageIcon,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const plans = [
  { name: "1 Month",  apiName: "1 Month",  amount: "₹1,499" },
  { name: "3 Month",  apiName: "3 Months", amount: "₹2,999" },
  { name: "6 Month",  apiName: "6 Months", amount: "₹4,999" },
  { name: "1 Year",   apiName: "1 Year",   amount: "₹8,499" },
];

const INITIAL_FORM = {
  name: "", email: "", phone: "", address: "",
  dob: "", age: "", gender: "", aadhar: "", blood_group: "",
  image: null, subscription_plan: "Custom", start_date: "",
};

const INPUT_CLS =
  "w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all";

const LABEL_CLS =
  "text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-2";

export default function Register() {
  const [step, setStep]           = useState(1);
  const [formData, setFormData]   = useState(INITIAL_FORM);
  const [loading, setLoading]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errors, setErrors]       = useState({});
  const { login }               = useUser();
  const navigate                = useNavigate();

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age -= 1;

    return age > 0 ? age : "";
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    // Clear error on change
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    if (name === "image" && files[0]) {
      if (files[0].size > 7 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Photo must be under 7 MB. Try compressing it or choosing a smaller image." }));
        e.target.value = "";
        return;
      }
    }
    if (name === "dob") {
      setFormData((prev) => ({ ...prev, dob: value, age: calculateAge(value) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: type === "file" ? files[0] : value }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = "Full name is required.";
    if (!formData.phone || formData.phone.length !== 10)
      errs.phone = "Enter a valid 10-digit phone number.";
    if (!formData.dob)
      errs.dob = "Date of birth is required.";
    if (!formData.address.trim())
      errs.address = "Address is required.";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address.";
    if (formData.aadhar && !/^\d{12}$/.test(formData.aadhar))
      errs.aadhar = "Aadhar must be exactly 12 digits.";
    return errs;
  };

  const goToStep2 = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const selectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const confirmPlan = async () => {
    if (!selectedPlan) return;
    if (selectedPlan === "custom") {
      await submitRegistration({ ...formData, subscription_plan: "Custom", start_date: "" });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const updated = { ...formData, subscription_plan: selectedPlan.apiName, start_date: today };
      setFormData(updated);
      await submitRegistration(updated);
    }
  };

  const submitRegistration = async (data) => {
    setLoading(true);
    try {
      const SKIP = new Set(["subscription_plan", "start_date"]);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (SKIP.has(k)) return;
        if (v || v === 0) fd.append(k, v);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user-register`, fd,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      const createdUser = response.data.user || { name: data.name, email: data.email };

      try {
        if (data.start_date && data.subscription_plan && data.subscription_plan !== "Custom") {
          const userId = createdUser.id || createdUser._id;
          if (userId) {
            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/member/${userId}/subscription`,
              { plan: data.subscription_plan, amount: data.amount, extra_days: 0, start_date: data.start_date },
              { withCredentials: true }
            );
          }
        }
      } catch (subErr) {
        console.error("Subscription creation failed:", subErr);
      }

      login(createdUser);
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center px-4 py-10 sm:py-14 md:py-16">
      <div className="w-full max-w-xl">

        {/* Back link */}
        {step < 3 && (
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </button>
        )}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-white/5">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              {step === 3 ? "Success!" : "New Registration"}
            </h2>
            {step < 3 && (
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Step {step} of 2: {step === 1 ? "Your Details" : "Choose Plan"}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="px-5 py-5 sm:px-8 sm:py-6">
            <AnimatePresence mode="wait">

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input name="name" type="text" required value={formData.name} onChange={handleInputChange}
                          placeholder="Full Name"
                          className={`${INPUT_CLS} ${errors.name ? "border-red-500/60 focus:border-red-500/80" : ""}`} />
                      </div>
                      {errors.name && <p className="text-[10px] text-red-400 ml-2">{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange}
                          placeholder="Email ID"
                          className={`${INPUT_CLS} ${errors.email ? "border-red-500/60 focus:border-red-500/80" : ""}`} />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-400 ml-2">{errors.email}</p>}
                    </div>
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input name="phone" type="tel" required inputMode="numeric" maxLength={10}
                          value={formData.phone} onChange={handleInputChange}
                          placeholder="10-digit number"
                          className={`${INPUT_CLS} ${errors.phone ? "border-red-500/60 focus:border-red-500/80" : ""}`} />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-400 ml-2">{errors.phone}</p>}
                    </div>
                    {/* DOB */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Date of Birth *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input name="dob" type="date" required value={formData.dob} onChange={handleInputChange}
                          className={`${INPUT_CLS} ${errors.dob ? "border-red-500/60 focus:border-red-500/80" : ""}`} />
                      </div>
                      {errors.dob && <p className="text-[10px] text-red-400 ml-2">{errors.dob}</p>}
                    </div>
                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Gender</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <select name="gender" value={formData.gender} onChange={handleInputChange}
                          className={`${INPUT_CLS} appearance-none bg-zinc-800/50`}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    {/* Aadhar */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Aadhar Number</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input name="aadhar" type="text" pattern="[0-9]{12}" value={formData.aadhar}
                          onChange={handleInputChange} placeholder="12-digit Aadhar"
                          className={`${INPUT_CLS} ${errors.aadhar ? "border-red-500/60 focus:border-red-500/80" : ""}`} />
                      </div>
                      {errors.aadhar && <p className="text-[10px] text-red-400 ml-2">{errors.aadhar}</p>}
                    </div>
                    {/* Blood Group */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Blood Group</label>
                      <div className="relative">
                        <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <select name="blood_group" value={formData.blood_group} onChange={handleInputChange}
                          className={`${INPUT_CLS} appearance-none bg-zinc-800/50`}>
                          <option value="">Select Blood Group</option>
                          {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Profile Image */}
                    <div className="space-y-1.5">
                      <label className={LABEL_CLS}>Profile Image</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input name="image" type="file" accept="image/*" onChange={handleInputChange}
                          className={`w-full bg-zinc-800/50 border rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-zinc-700 file:text-zinc-300 focus:outline-none focus:border-white/20 transition-all cursor-pointer ${errors.image ? "border-red-500/60" : "border-white/5"}`} />
                      </div>
                      {errors.image
                        ? <p className="text-[10px] text-red-400 ml-2">{errors.image}</p>
                        : formData.image && <p className="text-[10px] text-zinc-500 ml-2 truncate">{formData.image.name}</p>
                      }
                      <p className="text-[10px] text-amber-500/50 ml-2 mt-1 font-bold uppercase tracking-wide">
                        Clear face photo required. No edited or social media pictures.
                      </p>
                    </div>
                  </div>

                  {/* Address — full width */}
                  <div className="space-y-1.5">
                    <label className={LABEL_CLS}>Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-zinc-600" />
                      <textarea name="address" required rows={3} value={formData.address}
                        onChange={handleInputChange} placeholder="Full Address"
                        className={`w-full bg-zinc-800/50 border rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-800 transition-all resize-none ${errors.address ? "border-red-500/60 focus:border-red-500/80" : "border-white/5 focus:border-white/20"}`} />
                    </div>
                    {errors.address && <p className="text-[10px] text-red-400 ml-2">{errors.address}</p>}
                  </div>

                  <button
                    onClick={goToStep2}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 mt-6 hover:bg-zinc-200 transition-colors"
                  >
                    Choose Your Plan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Creating your account...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {plans.map((p) => {
                          const isSelected = selectedPlan && selectedPlan !== "custom" && selectedPlan.name === p.name;
                          return (
                            <button key={p.name} onClick={() => selectPlan(p)}
                              className={`group p-6 rounded-2xl text-left transition-all flex justify-between items-center border ${
                                isSelected
                                  ? "bg-white text-black border-white"
                                  : "bg-zinc-800/50 border-white/5 hover:bg-zinc-800 hover:border-white/20"
                              }`}
                            >
                              <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? "text-zinc-500" : "text-zinc-500"}`}>Plan</p>
                                <h4 className={`text-xl font-black uppercase italic ${isSelected ? "text-black" : "text-white"}`}>{p.name}</h4>
                              </div>
                              <div className="text-right">
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? "text-zinc-500" : "text-zinc-500"}`}>Starting at</p>
                                <p className={`text-xl font-black ${isSelected ? "text-black" : "text-white"}`}>{p.amount}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Skip plan option */}
                      <div
                        onClick={() => setSelectedPlan("custom")}
                        className={`mt-4 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer border transition-all ${
                          selectedPlan === "custom"
                            ? "bg-zinc-700 border-white/20"
                            : "bg-zinc-800/30 border-white/5 hover:bg-zinc-800/50 hover:border-white/10"
                        }`}
                      >
                        <div>
                          <p className="text-zinc-300 text-xs font-black uppercase italic tracking-widest">
                            Not sure yet?
                          </p>
                          <p className="text-zinc-500 text-[10px] mt-0.5 leading-relaxed">
                            Skip for now — the gym owner will assign your plan and pricing after reviewing your registration.
                          </p>
                        </div>
                        <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedPlan === "custom" ? "border-white bg-white" : "border-zinc-600"
                        }`}>
                          {selectedPlan === "custom" && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>

                      {/* Confirm button */}
                      <button
                        onClick={confirmPlan}
                        disabled={!selectedPlan}
                        className="w-full mt-5 bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Complete Registration
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button onClick={() => { setStep(1); setSelectedPlan(null); }}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to details
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── STEP 3 ── */}
              {step === 3 && (
                <motion.div key="step3"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 bg-zinc-100/10 border border-white/10 rounded-full flex items-center justify-center mb-8">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">
                    Thanks for <br /> registration!
                  </h3>
                  <p className="text-zinc-400 text-sm max-w-xs leading-relaxed uppercase tracking-wide font-medium">
                    Confirmation you will be notified through email if provided.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-10 bg-white text-black px-12 py-4 rounded-full font-black uppercase italic tracking-[0.2em] text-xs hover:bg-zinc-200 transition-colors"
                  >
                    Back to Home
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

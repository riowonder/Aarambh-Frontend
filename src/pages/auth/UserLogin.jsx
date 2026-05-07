// **not in use currently**

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function UserLogin() {
  const [formData, setFormData] = useState({ phone: "", dobDay: "", dobMonth: "", dobYear: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Allow only digits and limit to 10
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build dob as DD/MM/YYYY
      const { dobDay, dobMonth, dobYear, phone } = formData;
      if (!dobDay || !dobMonth || !dobYear) {
        throw new Error('Please enter a valid date of birth');
      }

      const dd = String(dobDay).padStart(2, '0');
      const mm = String(dobMonth).padStart(2, '0');
      const yyyy = String(dobYear);
      const payload = { phone, dob: `${dd}/${mm}/${yyyy}` };

      console.log("Submitting login with payload:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user-login`,
        payload,
        { withCredentials: true }
      );
      login(response.data.user);
      toast.success("User logged in successfully!");
      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login as user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted overflow-hidden fixed top-0 left-0">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">User Login</h2>
          <p className="text-sm text-muted-foreground">Enter your phone number and DOB to login</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 text-start">Phone Number : </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              maxLength={10}
              inputMode="numeric"
              className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="987654210"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 text-start">Date of Birth :</label>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                name="dobDay"
                value={formData.dobDay}
                onChange={handleInputChange}
                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-20"
                placeholder="DD"
                min={1}
                max={31}
                inputMode="numeric"
                required
              />
              <input
                type="number"
                name="dobMonth"
                value={formData.dobMonth}
                onChange={handleInputChange}
                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-20"
                placeholder="MM"
                min={1}
                max={12}
                inputMode="numeric"
                required
              />
              <input
                type="number"
                name="dobYear"
                value={formData.dobYear}
                onChange={handleInputChange}
                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-28"
                placeholder="YYYY"
                min={1900}
                max={new Date().getFullYear()}
                inputMode="numeric"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <NavLink to="/user-register" className="underline hover:text-black">Sign Up</NavLink>
        </p>
        {/* <p className="text-sm text-center mt-2">
          <NavLink to="/dashlogin" className="underline text-cyan-700 hover:text-cyan-900 font-medium">
            Login as admin
          </NavLink>
        </p> */}
      </div>
    </div>
  );
}

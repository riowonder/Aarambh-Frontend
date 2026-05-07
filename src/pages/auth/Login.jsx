import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Base URL : ", import.meta.env.VITE_API_BASE_URL);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          data: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );

      // Store user data in context and localStorage
      login(response.data.user);
      toast.success("Logged in successfully!");

      // Navigate based on user role
      if (response.data.user.role === 'manager') {
        navigate("/manager/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden fixed top-0 left-0">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Admin Login</h2>
          <p className="text-sm text-gray-300">Enter your email and password below to login</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white text-start">Email or Username</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="px-3 py-2 rounded-md border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#111827' }}
              placeholder="you@example.com or username"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white text-start">Password</label>
              <NavLink to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</NavLink>
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 pr-10 rounded-md border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#111827' }}
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-300">
          Don't have an account? <NavLink to="/dashsignup" className="underline text-blue-400 hover:text-blue-300">Sign Up</NavLink>
        </p>
        <p className="text-sm text-center mt-2">
          <NavLink to="/user-login" className="underline text-blue-400 hover:text-blue-300 font-medium">
            Login as user
          </NavLink>
        </p>
      </div>
    </div>
  );
}
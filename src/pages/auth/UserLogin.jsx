import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user-login`,
        formData,
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
          <p className="text-sm text-muted-foreground">Enter your email and password to login</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 text-start">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="manager@example.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 text-start">Password</label>
              <NavLink to="/user-forgot-password" className="text-sm text-gray-600 hover:text-black">Forgot password?</NavLink>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              autoComplete="off"
              onChange={handleInputChange}
              className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
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
        <p className="text-sm text-center mt-2">
          <NavLink to="/" className="underline text-cyan-700 hover:text-cyan-900 font-medium">
            Login as admin
          </NavLink>
        </p>
      </div>
    </div>
  );
}

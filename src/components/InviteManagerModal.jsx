import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext';

const InviteManagerModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true); // Show password by default as requested
  const [error, setError] = useState('');
  const { user } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/invite-manager`, {
        name: form.name,
        email: form.email,
        password: form.password,
        admin_email: user.email
      }, { withCredentials: true });

      toast.success('Manager invited successfully!');
      setForm({ name: '', email: '', password: '' });
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to invite manager';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setForm({ name: '', email: '', password: '' });
      setError('');
      onClose();
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, password }));
  };

  if (!isOpen) return null;

  return (
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4" onClick={handleClose}>
      <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Invite Manager</h2>
              <p className="text-sm text-gray-600 text-left">Add a new manager to your gym</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="p-6 overflow-y-auto">
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">
                Manager Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                placeholder="Enter manager's full name"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                placeholder="manager@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-[0.8rem] pr-10 border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                  placeholder="Enter password"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Password will be visible to admin
                </p>
                <button
                  type="button"
                  onClick={generatePassword}
                  disabled={loading}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 cursor-pointer"
                >
                  Generate Password
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Manager Access</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Can manage members and subscriptions</li>
                <li>• Cannot access finance data</li>
                <li>• Cannot change gym settings</li>
                <li>• Cannot invite other managers</li>
              </ul>
            </div>
          </div>

          <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
            <button
              type="submit"
              disabled={loading || !form.name || !form.email || !form.password}
              className="py-2 px-6 bg-black text-white rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inviting...' : 'Invite Manager'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteManagerModal; 
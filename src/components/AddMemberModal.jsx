import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

// ─── constants ───────────────────────────────────────────────────────────────

const PLANS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Custom'];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const INITIAL_FORM = {
  serial_no: '',
  name: '',
  email: '',
  phone_number: '',
  dob: '',
  age: '',
  aadhar_number: '',
  blood_group: '',
  address: '',
  // subscription
  subscription_plan: 'Custom',
  extra_days: '',
  amount: '',
  start_date: '',
};

// ─── helpers ─────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition bg-white';

const labelCls =
  'block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide';

// ─── component ───────────────────────────────────────────────────────────────

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [image, setImage]         = useState(null);
  const [imageError, setImageError] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  if (!isOpen) return null;

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone_number') {
      setForm((p) => ({ ...p, phone_number: value.replace(/\D/g, '').slice(0, 10) }));
      return;
    }
    if (name === 'aadhar_number') {
      setForm((p) => ({ ...p, aadhar_number: value.replace(/\D/g, '').slice(0, 12) }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) { setImage(null); setImageError(''); return; }
    if (file.size > 3 * 1024 * 1024) {
      setImageError('Image must be under 3 MB');
      setImage(null);
    } else {
      setImageError('');
      setImage(file);
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setImage(null);
    setImageError('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageError) return;
    setError('');
    setLoading(true);

    try {
      // Build member FormData
      const fd = new FormData();
      const memberFields = [
        'serial_no', 'name', 'email', 'phone_number',
        'dob', 'age', 'aadhar_number', 'blood_group', 'address',
      ];
      memberFields.forEach((k) => { if (form[k]) fd.append(k, form[k]); });
      if (image) fd.append('image', image);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/member/add`,
        fd,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success) {
        // Optionally add subscription
        if (form.start_date && form.subscription_plan) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/member/${data.member._id}/subscription`,
              {
                plan: form.subscription_plan,
                amount: Number(form.amount) || 0,
                extra_days: form.extra_days ? Number(form.extra_days) : 0,
                start_date: form.start_date,
                status: 'Active',
              },
              { withCredentials: true }
            );
            toast.success('Member and subscription added!');
          } catch {
            toast.success('Member added (subscription failed)');
          }
        } else {
          toast.success('Member added successfully!');
        }

        onSuccess();
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[1002] p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Add New Member</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            {/* ── Basic Info ── */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Basic Info</p>
              <div className="space-y-3">

                <div>
                  <label className={labelCls}>Serial No. <span className="text-red-400">*</span></label>
                  <input
                    type="text" name="serial_no" value={form.serial_no}
                    onChange={handleChange} required placeholder="e.g. 001"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} required placeholder="Full name"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Phone <span className="text-red-400">*</span></label>
                    <input
                      type="tel" name="phone_number" value={form.phone_number}
                      onChange={handleChange} required placeholder="10 digits"
                      inputMode="numeric" maxLength={10}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="Optional"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Date of Birth <span className="text-red-400">*</span></label>
                    <input
                      type="date" name="dob" value={form.dob}
                      onChange={handleChange} required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Age</label>
                    <input
                      type="number" name="age" value={form.age}
                      onChange={handleChange} placeholder="e.g. 25"
                      min="1" max="120"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Aadhar No.</label>
                    <input
                      type="text" name="aadhar_number" value={form.aadhar_number}
                      onChange={handleChange} placeholder="12 digits"
                      inputMode="numeric" maxLength={12}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Blood Group</label>
                    <select name="blood_group" value={form.blood_group} onChange={handleChange} className={inputCls}>
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Address <span className="text-red-400">*</span></label>
                  <textarea
                    name="address" value={form.address}
                    onChange={handleChange} required
                    placeholder="Full address" rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div>
                  <label className={labelCls}>Profile Image</label>
                  <input
                    type="file" accept="image/*"
                    onChange={handleImage}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                  />
                  {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                  {image && !imageError && <p className="text-gray-400 text-xs mt-1 truncate">{image.name}</p>}
                </div>

              </div>
            </section>

            {/* ── Subscription ── */}
            <section className="border-t border-gray-100 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Subscription</p>
              <div className="space-y-3">

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Plan</label>
                    <select name="subscription_plan" value={form.subscription_plan} onChange={handleChange} className={inputCls}>
                      {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Extra Days</label>
                    <input
                      type="number" name="extra_days" value={form.extra_days}
                      onChange={handleChange} placeholder="0" min="0"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Amount (₹)</label>
                    <input
                      type="number" name="amount" value={form.amount}
                      onChange={handleChange} placeholder="0" min="0"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Start Date</label>
                    <input
                      type="date" name="start_date" value={form.start_date}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                </div>

              </div>
            </section>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-2 shrink-0">
            <button
              type="submit"
              disabled={loading || !!imageError}
              className="flex-1 py-2.5 bg-black text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

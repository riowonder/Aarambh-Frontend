import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PLAN_OPTIONS = [
  '1 Month',
  '3 Months',
  '6 Months',
  '1 Year',
  'Custom',
];

const EditSubscriptionModal = ({ isOpen, onClose, subscription, onSuccess }) => {
  const [form, setForm] = useState({
    plan: '',
    amount: '',
    extra_days: '',
    start_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setForm({
        plan: subscription.plan || '',
        amount: subscription.amount || '',
        extra_days: subscription.extra_days || '',
        start_date: subscription.start_date ? new Date(subscription.start_date).toISOString().split('T')[0] : '',
      });
    }
  }, [subscription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        plan: form.plan,
        amount: form.amount ? Number(form.amount) : 0,
        extra_days: form.extra_days ? Number(form.extra_days) : 0,
        start_date: form.start_date,
      };

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/member/subscription/${subscription._id}`, payload, { withCredentials: true });

      toast.success('Subscription updated successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update subscription';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4" onClick={handleClose}>
      <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Edit Subscription</h2>
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
              <label className="block mb-2 font-bold text-gray-800 text-left">Plan</label>
              <select
                name="plan"
                value={form.plan}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                required
                disabled={loading}
              >
                <option value="" disabled>
                  Select a plan
                </option>
                {PLAN_OPTIONS.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                required
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Extra Days</label>
              <input
                type="number"
                name="extra_days"
                value={form.extra_days}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                disabled={loading}
                min="0"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4">
                {error}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
            <button
              type="submit"
              disabled={loading || !form.plan || !form.amount || !form.start_date}
              className="py-2 px-6 bg-black text-white rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Subscription'}
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

export default EditSubscriptionModal; 
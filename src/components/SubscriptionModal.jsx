import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import EditSubscriptionModal from './EditSubscriptionModal';

// ─── constants ───────────────────────────────────────────────────────────────

const FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Current',  value: 'current' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Expired',  value: 'expired' },
];

const PLAN_OPTIONS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Custom'];

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const statusStyle = (status) => {
  if (status === 'Active')   return 'bg-green-100 text-green-700';
  if (status === 'Upcoming') return 'bg-blue-100 text-blue-700';
  return 'bg-red-100 text-red-700';
};

// ─── AddSubscriptionForm ─────────────────────────────────────────────────────

function AddSubscriptionForm({ memberId, onSuccess, onCancel }) {
  const [form, setForm]     = useState({ plan: '', amount: '', extra_days: '', start_date: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

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
      if (form.status) payload.status = form.status;
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/member/${memberId}/subscription`,
        payload,
        { withCredentials: true }
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subscription');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition';
  const labelCls = 'block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1">
      <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">
        <div>
          <label className={labelCls}>Plan</label>
          <select name="plan" value={form.plan} onChange={handleChange} className={inputCls} required>
            <option value="" disabled>Select a plan</option>
            {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Amount (₹)</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Extra Days</label>
          <input type="number" name="extra_days" value={form.extra_days} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Start Date</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Status (optional)</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
            <option value="">Auto</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      <div className="px-5 py-4 border-t border-gray-100 flex gap-2 shrink-0">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-black text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── SubscriptionCard (mobile row) ───────────────────────────────────────────

function SubscriptionCard({ sub, onEdit, onDelete }) {
  return (
    <div className="border border-gray-100 rounded-xl px-4 py-3 space-y-2">
      {/* top row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-900 text-sm">{sub.plan}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle(sub.status)}`}>
          {sub.status}
        </span>
      </div>
      {/* details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>₹{sub.amount}</span>
        <span>+{sub.extra_days || 0} extra days</span>
        <span>Start: {fmtDate(sub.start_date)}</span>
        <span>End: {fmtDate(sub.end_date)}</span>
      </div>
      {/* actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(sub)}
          className="flex-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(sub)}
          className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── SubscriptionModal ────────────────────────────────────────────────────────

export default function SubscriptionModal({ isOpen, onClose, memberId, onSuccess }) {
  const [subscriptions, setSubscriptions]       = useState([]);
  const [filter, setFilter]                     = useState('all');
  const [showAdd, setShowAdd]                   = useState(false);
  const [showEdit, setShowEdit]                 = useState(false);
  const [selectedSubscription, setSelectedSub] = useState(null);
  const [loading, setLoading]                   = useState(false);

  useEffect(() => {
    if (isOpen) fetchSubscriptions();
  }, [isOpen, filter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/member/${memberId}/subscriptions?filter=${filter}`,
        { withCredentials: true }
      );
      setSubscriptions(res.data.subscriptions || []);
    } catch {
      toast.error('Failed to fetch subscriptions');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sub) => {
    setSelectedSub(sub);
    setShowEdit(true);
  };

  const handleDelete = async (sub) => {
    // inline confirm dialog
    const confirmed = await new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4';
      overlay.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
          <h3 class="text-base font-bold text-gray-900 mb-2">Delete Subscription</h3>
          <p class="text-sm text-gray-500 mb-5">Delete the <strong>${sub.plan}</strong> subscription? This cannot be undone.</p>
          <div class="flex gap-2">
            <button id="c" class="flex-1 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">Cancel</button>
            <button id="d" class="flex-1 py-2 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700">Delete</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      const cleanup = () => document.body.removeChild(overlay);
      overlay.querySelector('#c').onclick = () => { cleanup(); resolve(false); };
      overlay.querySelector('#d').onclick = () => { cleanup(); resolve(true); };
      overlay.onclick = (e) => { if (e.target === overlay) { cleanup(); resolve(false); } };
    });

    if (!confirmed) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/member/subscription/${sub._id}`,
        { withCredentials: true }
      );
      toast.success('Subscription deleted');
      fetchSubscriptions();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ── Main modal ── */}
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[1002] p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900">Subscriptions</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter bar + Add button */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-3 shrink-0 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filter === f.value ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-gray-800 transition whitespace-nowrap"
            >
              + Add
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {loading ? (
              <p className="text-center py-10 text-sm text-gray-400">Loading…</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-center py-10 text-sm text-gray-400">No subscriptions found.</p>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-2">
                  {subscriptions.map((sub) => (
                    <SubscriptionCard key={sub._id} sub={sub} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Plan','Status','Amount','Extra Days','Start','End',''].map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subscriptions.map((sub) => (
                        <tr key={sub._id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-900 font-medium">{sub.plan}</td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle(sub.status)}`}>{sub.status}</span>
                          </td>
                          <td className="px-3 py-3 text-gray-700">₹{sub.amount}</td>
                          <td className="px-3 py-3 text-gray-700">{sub.extra_days || 0}</td>
                          <td className="px-3 py-3 text-gray-700">{fmtDate(sub.start_date)}</td>
                          <td className="px-3 py-3 text-gray-700">{fmtDate(sub.end_date)}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(sub)} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">Edit</button>
                              <button onClick={() => handleDelete(sub)} className="text-xs font-semibold text-red-600 hover:underline cursor-pointer">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Subscription sheet ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[1003] p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-bold text-gray-900">Add Subscription</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <AddSubscriptionForm
              memberId={memberId}
              onSuccess={() => { setShowAdd(false); fetchSubscriptions(); if (onSuccess) onSuccess(); }}
              onCancel={() => setShowAdd(false)}
            />
          </div>
        </div>
      )}

      {/* ── Edit Subscription modal ── */}
      {showEdit && selectedSubscription && (
        <EditSubscriptionModal
          isOpen={showEdit}
          onClose={() => { setShowEdit(false); setSelectedSub(null); }}
          subscription={selectedSubscription}
          onSuccess={() => { fetchSubscriptions(); if (onSuccess) onSuccess(); }}
        />
      )}
    </>
  );
}

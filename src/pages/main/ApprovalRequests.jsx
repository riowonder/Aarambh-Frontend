import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import EditSubscriptionModal from '../../components/EditSubscriptionModal';
import SubscriptionModal from '../../components/SubscriptionModal';
import EditMemberModal from '../../components/EditMemberModal';
import { useUser } from '../../context/UserContext';
import { computeDaysLeft } from '../../utils/dates';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 font-medium break-words">{value}</span>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function ApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isSubEditOpen, setIsSubEditOpen] = useState(false);
  const [editSubscription, setEditSubscription] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionMemberId, setSubscriptionMemberId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/pending-user-approvals`, { withCredentials: true });
      // Sort by latest request first
      const sorted = (res.data.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRequests(sorted);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      toast.error('Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (e, userId) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/admin/approve-user/${userId}`, {}, { withCredentials: true });
      toast.success('User approved successfully!');
  // Refresh local list and invalidate dashboard members so main dashboard refetches
  fetchRequests();
  // Invalidate dashboard members query
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'members'] });
  // Also invalidate all members-list queries (all members page) — use both key and predicate for robustness
  queryClient.invalidateQueries({ queryKey: ['members-list'] });
  queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'members-list' });
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
      setLoading(false);
    }
  };

  const handleReject = async (e, userId) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/admin/reject-user/${userId}`, {}, { withCredentials: true });
      toast.success('User rejected!');
  fetchRequests();
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'members'] });
  queryClient.invalidateQueries({ queryKey: ['members-list'] });
  queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'members-list' });
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-4 py-4 sm:px-8 sm:py-8 overflow-x-hidden">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
              onClick={() => navigate('/admin/dashboard')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <div className="text-sm font-medium text-gray-600 bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
              Pending: <span className="font-semibold text-gray-900">{requests.length}</span>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Approval Requests</h2>
            <p className="text-sm text-gray-500 mt-1">Tap a request to view full details</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl border border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-500 font-medium tracking-wide">Loading requests...</p>
            </div>
          ) : !Array.isArray(requests) || requests.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center px-4 bg-white rounded-2xl border border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">No pending requests</h3>
              <p className="text-gray-500 mt-2 max-w-sm">You're all caught up! There are no user approvals waiting at the moment.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((req) => {
                const isOpen = expandedId === req._id;
                const initials = req.name ? req.name.charAt(0).toUpperCase() : 'U';

                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md"
                  >
                    {/* Card header — always visible, clickable to expand */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpand(req._id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleExpand(req._id);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-4 sm:px-5 text-left focus:outline-none cursor-pointer"
                    >
                      {/* Avatar */}
                      {req.image ? (
                        <img
                          src={req.image}
                          alt={req.name}
                          className="h-11 w-11 flex-shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg">
                          {initials}
                        </div>
                      )}

                      {/* Name + contact + date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">{req.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {req.phone_number || req.email || '—'}
                        </p>
                        {req.createdAt && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(req.createdAt)} · {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>

                      {/* Approve + chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleApprove(e, req._id)}
                          className="px-3 py-1.5 text-white bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <ChevronIcon open={isOpen} />
                      </div>
                    </div>

                    {/* Expandable details */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 sm:px-5 pb-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mt-3 mb-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Registration Details</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditMember(req);
                                setIsEditOpen(true);
                              }}
                              className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-lg border border-gray-100"
                            >
                              Edit Member
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (req.subscription) {
                                  setEditSubscription(req.subscription);
                                  setIsSubEditOpen(true);
                                } else {
                                  // Open SubscriptionModal with Add sheet for this member
                                  setSubscriptionMemberId(req._id);
                                  setShowSubscriptionModal(true);
                                }
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"
                            >
                              Edit Subscription
                            </button>
                          </div>
                        </div>
                        <DetailRow label="Full Name"      value={req.name} />
                        <DetailRow label="Email"          value={req.email} />
                        <DetailRow label="Phone"          value={req.phone_number} />
                        <DetailRow label="Date of Birth"  value={formatDate(req.dob)} />
                        <DetailRow label="Age"            value={req.age ? `${req.age} years` : null} />
                        <DetailRow label="Gender"         value={req.gender} />
                        <DetailRow label="Blood Group"    value={req.blood_group} />
                        <DetailRow label="Aadhar Number"  value={req.aadhar_number} />
                        <DetailRow label="Address"        value={req.address} />
                        <DetailRow label="Height"         value={req.height ? `${req.height} cm` : null} />
                        <DetailRow label="Weight"         value={req.weight ? `${req.weight} kg` : null} />
                        <DetailRow label="Requested On"   value={
                          req.createdAt
                            ? `${formatDate(req.createdAt)} at ${new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : null
                        } />

                        {/* Subscription details (new) */}
                        {req.subscription ? (
                          <div className="mt-3 border-t pt-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Subscription</p>
                            <DetailRow label="Plan" value={req.subscription.plan} />
                            <DetailRow label="Status" value={req.subscription.status} />
                            <DetailRow label="Amount" value={req.subscription.amount != null ? req.subscription.amount : '0'} />
                            <DetailRow label="Start Date" value={formatDate(req.subscription.start_date)} />
                            <DetailRow label="End Date" value={formatDate(req.subscription.end_date)} />
                            <DetailRow label="Total Days" value={(() => {
                              const s = req.subscription?.start_date;
                              const e = req.subscription?.end_date;
                              if (!s || !e) return null;
                              const start = new Date(s);
                              const end = new Date(e);
                              start.setHours(0,0,0,0);
                              end.setHours(0,0,0,0);
                              const dayMs = 1000 * 60 * 60 * 24;
                              // inclusive count: difference in days + 1 (May 18..Jun 16 => 30)
                              const diffDays = Math.floor((end - start) / dayMs) + 1;
                              return `${Math.max(0, diffDays)} days`;
                            })()} />
                          </div>
                        ) : (
                          <div className="mt-3 border-t pt-3">
                            <DetailRow label="Subscription" value={"No Subscription Choosen"} />
                          </div>
                        )}

                        {/* Reject button inside dropdown */}
                        <button
                          onClick={(e) => handleReject(e, req._id)}
                          className="mt-4 w-full py-2.5 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Edit Member Modal instance */}
      <EditSubscriptionModal
        isOpen={isSubEditOpen}
        onClose={() => {
          setIsSubEditOpen(false);
          setEditSubscription(null);
        }}
        subscription={editSubscription}
        onSuccess={() => {
          // refresh full list from server to ensure derived fields (days_left, end_date) are accurate
          fetchRequests();
        }}
      />
      <EditMemberModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditMember(null);
        }}
        member={editMember}
        onSave={(updatedMember) => {
          setRequests((prev) => prev.map((r) => (r._id === updatedMember._id ? { ...r, ...updatedMember } : r)));
          setIsEditOpen(false);
          setEditMember(null);
        }}
      />
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => { setShowSubscriptionModal(false); setSubscriptionMemberId(null); fetchRequests(); }}
        memberId={subscriptionMemberId}
        initialShowAdd={true}
        onSuccess={() => { setShowSubscriptionModal(false); setSubscriptionMemberId(null); fetchRequests(); }}
      />
    </div>
  );
}

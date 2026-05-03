import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function ApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  // Use env var for base API URL, or fallback to localhost
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/pending-user-approvals`, { withCredentials: true });
      setRequests(res.data.data || []);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      toast.error('Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/admin/approve-user/${userId}`, {}, { withCredentials: true });
      toast.success('User approved successfully!');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
      setLoading(false);
    }
  };

  const handleReject = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/admin/reject-user/${userId}`, {}, { withCredentials: true });
      toast.success('User rejected!');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-6 py-4 sm:p-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">

          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer "
              onClick={() => navigate('/admin/dashboard')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <div className="text-sm font-medium text-gray-600 bg-gray-100 px-5 py-2.5 rounded-xl border border-gray-300">
              Pending Requests: <span className="font-semibold text-gray-900">{requests.length}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Approval Requests</h2>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide">Loading requests...</p>
              </div>
            ) : !Array.isArray(requests) || requests.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-center px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">No pending requests</h3>
                <p className="text-gray-500 mt-2 max-w-sm">You're all caught up! There are no user approvals waiting at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full whitespace-nowrap">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-6">
                          <div className="flex items-center">
                            <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xl">
                              {req.name ? req.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="ml-5">
                              <div className="text-base font-semibold text-gray-900">{req.name || 'Unknown User'}</div>
                              <div className="text-sm text-gray-500 mt-1">{req.email || req.phone_number || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-base font-semibold text-gray-900">
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            }) : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex justify-end gap-3 w-full">
                            <button
                              onClick={() => handleReject(req._id)}
                              className="px-5 py-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(req._id)}
                              className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition cursor-pointer"
              onClick={() => navigate('/admin/dashboard')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <div className="text-sm border-2 border-orange-300 shadow-md sm:text-lg font-semibold text-orange-800 bg-orange-100 px-4 py-2 rounded-lg">
              Pending Requests: <span className="font-bold text-orange-900">{requests.length}</span>
            </div>
          </div>

          <div className="flex justify-center items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-montserrat">Approval Requests</h2>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
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
                  <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">User Details</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Requested On</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50/60 transition-colors duration-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                              {req.name ? req.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{req.name || 'Unknown User'}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{req.email || req.phone_number || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-900 font-semibold">
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString(undefined, { 
                              year: 'numeric', month: 'short', day: 'numeric' 
                            }) : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 font-medium">
                            {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-3 w-full">
                            <button
                              onClick={() => handleReject(req._id)}
                              className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(req._id)}
                              className="px-4 py-2 border border-transparent text-white bg-black hover:bg-gray-800 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow cursor-pointer"
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

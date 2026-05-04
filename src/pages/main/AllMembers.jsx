// ============================================================
// All Members Page Component
// Displays a paginated list of gym members with search and filter
// ============================================================

import React, { useState } from 'react';
import axios from 'axios';
import ShowMemberModal from '../../components/ShowMemberModal';
import AddMemberModal from '../../components/AddMemberModal';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MemberCard from '../../components/MemberCard';

export default function AllMembers() {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // ============================================================
  // DATA FETCHING
  // ============================================================
  const fetchMembersData = async () => {
    if (searchQuery.trim()) {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/search?q=${encodeURIComponent(searchQuery)}&filter=${statusFilter}`, { withCredentials: true });
      return {
        members: response.data.members || [],
        totalMembers: response.data.totalMembers || 0,
        totalPages: 1,
        currentPage: 1
      };
    } else {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/get-members?page=${currentPage}&limit=10&filter=${statusFilter}`, { withCredentials: true });
      return {
        members: response.data.members || [],
        totalMembers: response.data.totalMembers || 0,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1
      };
    }
  };

  // ============================================================
  // REACT QUERY HOOK
  // ============================================================
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['members-list', currentPage, statusFilter, searchQuery],
    queryFn: fetchMembersData,
    enabled: !!user?.email,
    placeholderData: (previousData) => previousData,
  });

  // ============================================================
  // DERIVED STATE
  // ============================================================
  const members = data?.members || [];
  const totalMembers = data?.totalMembers || 0;
  const totalPages = data?.totalPages || 1;
  const loading = isLoading;
  const isSearching = isFetching && !!searchQuery.trim();

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  // Filter handler - resets pagination when filter changes
  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  // Search input change handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Refresh members list after changes
  const handleSaveMember = () => {
    queryClient.invalidateQueries({ queryKey: ['members-list'] });
  };

  const handleAddMemberSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['members-list'] });
  };

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  // Format days left display - handles both string and number values
  const formatDaysLeft = (daysLeft) => {
    if (typeof daysLeft === 'string') {
      // If it's already a status string, return as is
      return daysLeft;
    }
    // If it's a number, format with "left"
    if (typeof daysLeft === 'number') {
      return `${daysLeft} ${daysLeft === 1 ? "Day" : "Days"} left`;
    }
    // Fallback
    return "N/A";
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-6 py-3 sm:p-6 overflow-x-hidden">
        <div className="max-w-full">
          {/* ========== MODALS ========== */}
          {/* Add Member Modal */}
          <AddMemberModal isOpen={showAddMember} onClose={() => setShowAddMember(false)} onSuccess={handleAddMemberSuccess} />

          {/* ========== HEADER SECTION ========== */}
          {/* Back Button and Total Members */}
          <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold px-2 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition cursor-pointer"
              onClick={() => navigate(user?.role === 'manager' ? '/manager/dashboard' : '/admin/dashboard')}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <div className="text-sm sm:text-lg font-semibold text-green-800 bg-green-100 px-2 sm:px-4 py-2 rounded-lg border-2 border-green-300 shadow-md">
              Total Members: <span className="font-bold text-green-900">{totalMembers}</span>
            </div>
          </div>

          {/* ========== PAGE TITLE ========== */}
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-montserrat">All Members</h2>
          </div>

          {/* ========== FILTER AND SEARCH SECTION ========== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-2 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="all">All Members</option>
                <option value="active" className="text-green-600">Active Members</option>
                <option value="inactive" className="text-red-600">Inactive Members</option>
              </select>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-black text-white px-2 sm:px-4 py-2 rounded-md font-semibold hover:bg-gray-900 transition cursor-pointer text-sm sm:text-base"
              >
                <span className="hidden sm:inline">+ Add Member</span>
                <span className="sm:hidden">+Add</span>
              </button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, roll no, phone, gender, or address..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-2 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base flex-1"
              />
              <button
                // We keep disabled if there's no query, but it auto searches anyway through useQuery
                disabled={!searchQuery.trim() || isSearching}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer text-sm sm:text-base"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              {searchQuery.trim() && (
                <button
                  onClick={clearSearch}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition cursor-pointer text-sm sm:text-base"
                >
                  X
                </button>
              )}
            </div>
          </div>

          {/* ========== LOADING STATE ========== */}
          {(loading || isSearching) && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">
                {isSearching ? 'Searching...' : 'Loading data...'}
              </p>
            </div>
          )}

          {/* ========== MEMBERS TABLE SECTION ========== */}
          {!loading && !isSearching && (
             members.length === 0 ? (
    <div className="text-center py-8 text-gray-500">
      <p className="text-lg font-medium">No members found</p>
      <p className="text-sm">
        {searchQuery.trim()
          ? "Try searching with different keywords or check your spelling."
          : "Add your first member to get started"}
      </p>
    </div>
  ) : (
            
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden md:block bg-white rounded-xl p-4 sm:p-6 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">IMAGE</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">NAME</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">SUBSCRIPTION PLAN</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">Days Left</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">Phone Number</th>
                      </tr>
                    </thead>
                    {/* Separator line under table headers */}
                    <tbody>
                      <tr>
                        <td colSpan={5}>
                          <div className="border-b border-gray-300 w-full"></div>
                        </td>
                      </tr>
                      {members.map((member) => (
                        <tr
                          key={member._id}
                          className="border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSelectMember(member)}
                        >
                          <td className="px-4 py-3 text-left text-gray-900">
                            {member.image ? (
                              <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-left text-gray-900">{member.name}</td>
                          <td className="px-4 py-3 text-left text-gray-900">{member.subscriptions?.[0]?.plan || 'N/A'}</td>
                          <td className="px-4 py-3 text-left text-gray-900">
                            {formatDaysLeft(member.days_left)}
                          </td>
                          <td className="px-4 py-3 text-left text-gray-900">{member.phone_number || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View - Hidden on desktop and tablets */}
              <div className="md:hidden space-y-2">
                {members.map((member) => (
                  <MemberCard
                    key={member._id}
                    member={member}
                    onClick={() => handleSelectMember(member)}
                  />
                ))}
              </div>

              {/* Search Results Info - Shows when search is active */}
              {searchQuery.trim() && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Found {totalMembers} member{totalMembers !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
              )}

              {/* No Results Message - Shows when search yields no results
              {searchQuery.trim() && totalMembers === 0 && (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600 mb-2">No members found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-500">Try searching with different keywords or check your spelling.</p>
                </div>
              )} */}

              {/* ========== PAGINATION ========== */}
              {/* Only show pagination for non-search results */}
              {!searchQuery.trim() && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalMembers)} of {totalMembers} members
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ))}

          {/* ========== MODALS ========== */}
          {/* Member Details Modal */}
          <ShowMemberModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            member={selectedMember}
            onSave={handleSaveMember}
          />
        </div>
      </div>
    </div>
  );
} 

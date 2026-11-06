import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, Users, Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import NewFieldModal from "./NewField";
import AddMemberModal from "../../components/AddMemberModal";
import ExpiredSubscriptionsModal from "../../components/ExpiredSubscriptionsModal";
import ExpiringSoonModal from "../../components/ExpiringSoonModal";
import axios from "axios";
import ShowMemberModal from "../../components/ShowMemberModal";
import SearchMembersModal from '../../components/SearchMembersModal';
import Spinner, { CardSkeleton, TableSkeleton } from "../../components/Spinner";
import { computeDaysLeft, isYetToStart } from '../../utils/dates';
import MemberCard from "../../components/MemberCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// const expiredSubscriptions = [
//   { name: "UNKNOWN", date: "19 Feb 2023" },
//   { name: "Beru", date: "19 Dec 2023" },
//   { name: "Demon", date: "19 Feb 2023" },
//   { name: "Kratos", date: "19 Mar 2023" },
// ];

// const expiringSoon = [
//   { name: "Naruto Uzumaki", days: 9 },
//   { name: "Madara Uchiha", days: 4 },
//   { name: "Obito Uchiha", days: 6 },
//   { name: "Sung Jinwoo", days: 0 },
// ];

// const birthdayList = [
//   { name: "John Doe", days_left: 5 },
//   { name: "Jane Smith", days_left: 2 },
//   { name: "Alice Johnson", days_left: 0 },
//   { name: "Bob Brown", days_left: 8 },
// ];

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showExpiringSoonModal, setShowExpiringSoonModal] = useState(false);

  const queryClient = useQueryClient();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [member, setMember] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);




  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Queries
  const { data: members = [], isLoading: isMembersLoading, isError: membersError, refetch: retryMembers } = useQuery({
    queryKey: ['dashboard', 'members'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/get-members`, { withCredentials: true });
      return response.data.members || [];
    }
  });

  const { data: expiredSubscriptions = [], isLoading: isExpiredLoading, isError: expiredError, refetch: retryExpired } = useQuery({
    queryKey: ['dashboard', 'expiredSubscriptions'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/expired`, { withCredentials: true });
      return response.data.expiredSubscriptions || [];
    }
  });

  const { data: expiringSoon = [], isLoading: isExpiringLoading, isError: expiringError, refetch: retryExpiring } = useQuery({
    queryKey: ['dashboard', 'expiringSoon'],
    queryFn: async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/member/expiring-soon`, {}, { withCredentials: true });
      return response.data.expiringSoon || [];
    }
  });

  const { data: pendingApprovals = [], isError: approvalsError, refetch: retryApprovals } = useQuery({
    queryKey: ['dashboard', 'pendingApprovals'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/pending-user-approvals`, { withCredentials: true });
      return response.data.data || [];
    },
    refetchInterval: 60000, // refresh every 60s
  });


  const handleAddMemberSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleSaveMember = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  return (
    <div className="min-h-screen px-3 sm:px-5 pt-0 pb-0 min-w-0">
      {/* ===============================================
          MODALS - Hidden UI components for interactions
          =============================================== */}

      {/* Sidebar Navigation Modal */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onMembersClick={() => navigate('/admin/members')} />

      {/* Add New Member Modal Form */}
      <AddMemberModal isOpen={showAddMember} onClose={() => setShowAddMember(false)} onSuccess={handleAddMemberSuccess} />

      {/* Search and Filter Members Modal */}
      <SearchMembersModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectMember={(m) => {
          setShowSearchModal(false);
          setMember(m);
          setShowMemberModal(true);
        }}
      />

      {/* Show Detailed Member Information Modal */}
      <ShowMemberModal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} member={member} onSave={handleSaveMember} />

      {/* List of All Expired Subscriptions Modal */}
      <ExpiredSubscriptionsModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        expiredSubscriptions={expiredSubscriptions}
      />

      {/* List of All Expiring Soon Subscriptions Modal */}
      <ExpiringSoonModal
        isOpen={showExpiringSoonModal}
        onClose={() => setShowExpiringSoonModal(false)}
        expiringSoon={expiringSoon}
      />

      {/* ===============================================
          MAIN CONTENT AREA
          =============================================== */}
      <div className="">

        {/* HEADER SECTION - Gym name and hamburger menu */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {/* Gym name title and badge */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
            <h1 className="text-3xl sm:text-5xl text-gray-700 font-extrabold tracking-tight font-montserrat">{user?.gym_name || "GYM"}</h1>
            <span className="bg-black text-white leading-tight px-1 sm:px-3 py-1 rounded font-semibold text-xs sm:text-md lg:text-base sm:mb-1 font-poppins">MEMBERSHIP MANAGER</span>
          </div>

          {/* Notification bell + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Approval requests bell */}
            <button
              onClick={() => navigate('/admin/approval-requests')}
              className="relative bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Pending approval requests"
              aria-label="Pending approval requests"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {pendingApprovals.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none">
                  {pendingApprovals.length > 99 ? "99+" : pendingApprovals.length}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleSidebar}
              className="bg-white font-bold text-2xl text-black p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {approvalsError && (
          <p role="alert" className="mb-4 text-sm text-red-700">Approval count could not be loaded. <button type="button" onClick={() => retryApprovals()} className="underline">Retry</button></p>
        )}

        {/* ===============================================
            TOP STATS CARDS SECTION
            Shows: Expired subscriptions, Expiring soon
            =============================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

          {/* CARD 1: EXPIRED SUBSCRIPTIONS - Members with expired memberships */}
          <div className="bg-[#e8d6e2] min-w-0 w-full p-5 rounded-[10px] flex flex-col justify-between">
            <div className="rounded-lg flex flex-col flex-1">
              <h2 className="font-bold text-[1.3rem] mb-4 text-start font-montserrat text-gray-800">SUBSCRIPTION EXPIRED</h2>
              {isExpiredLoading ? (
                <div className="animate-pulse flex flex-col gap-3 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-black/10 rounded w-1/2"></div>
                      <div className="h-4 bg-black/10 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : expiredError ? (
                <p role="alert" className="text-sm text-red-700">Could not load expired subscriptions. <button type="button" onClick={() => retryExpired()} className="underline">Retry</button></p>
              ) : expiredSubscriptions.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-center text-gray-500">
                  <div>
                    <p className="text-xs sm:text-sm">No expired subscriptions</p>
                    <p className="text-xs sm:text-sm">Add your first member to get started</p>
                  </div>
                </div>
              ) : (
                <ul className="mb-2 px-0.5 sm:px-0">
                  {expiredSubscriptions.slice(0, 4).map((item, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-2 text-sm sm:text-base font-medium text-gray-800 mb-1">

                      <span className="min-w-0 flex-1 truncate">
                        {item.name}
                        <span className="text-xs text-gray-600 font-medium">
                          {" "}({item.subscriptions?.[0]?.plan || "N/A"})
                        </span>
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-xs sm:text-sm">{item.subscriptions[0]?.end_date ? new Date(item.subscriptions[0].end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>

                    </li>
                  ))}
                </ul>
              )}
            </div>
            {expiredSubscriptions.length > 0 && (
              <button
                className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800 hover:underline mt-auto ml-auto block"
                onClick={() => setShowExpiredModal(true)}
              >
                Show all →
              </button>
            )}
          </div>

          {/* CARD 2: EXPIRING SOON - Members with memberships expiring in next 10 days */}
          <div className="bg-[#f2e6c9] min-w-0 w-full p-5 rounded-[10px] flex flex-col justify-between">
            <div className="rounded-lg flex flex-col flex-1">
              <h2 className="font-bold text-[1.3rem] mb-4 text-start font-montserrat text-gray-800">EXPIRING SOON</h2>
              {isExpiringLoading ? (
                <div className="animate-pulse flex flex-col gap-3 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-black/10 rounded w-1/2"></div>
                      <div className="h-4 bg-black/10 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : expiringError ? (
                <p role="alert" className="text-sm text-red-700">Could not load expiring subscriptions. <button type="button" onClick={() => retryExpiring()} className="underline">Retry</button></p>
              ) : expiringSoon.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-center text-gray-500">
                  <p className="text-xs sm:text-sm">No expiring soon subscriptions in the next 10 days</p>
                </div>
              ) : (
                <ul className="mb-2 px-0.5 sm:px-0">
                  {expiringSoon.slice(0, 4).map((item, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-2 text-sm sm:text-base font-medium text-gray-800 mb-1">
                      <span className="min-w-0 flex-1 truncate">
                        {item.name}
                        <span className="text-xs text-gray-600 font-medium">
                          {" "}({item.subscriptions?.[0]?.plan || "N/A"})
                        </span>
                      </span>

                      {(() => {
                        const days = computeDaysLeft(item.subscriptions?.[0]?.start_date, item.subscriptions?.[0]?.end_date) ?? 0;
                        return (
                          <span className={`shrink-0 whitespace-nowrap text-xs sm:text-sm ${days === 0
                            ? "text-red-600 font-bold"
                            : days <= 4
                              ? "text-red-500 font-bold"
                              : "text-yellow-700 font-bold"
                            }`}>
                            {days} {days === 1 ? "Day" : "Days"} left
                          </span>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {expiringSoon.length > 0 && (
              <button
                className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800 hover:underline mt-auto ml-auto block"
                onClick={() => setShowExpiringSoonModal(true)}
              >
                Show all →
              </button>
            )}
          </div>


        </div>

        {/* ===============================================
            MEMBERS SECTION HEADER - Modern Design
            =============================================== */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 rounded-[2rem] border border-white/10 p-5 sm:p-6 shadow-2xl">
          
          {/* MOBILE VIEW */}
          <div className="sm:hidden space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase italic tracking-tight text-white">Members</h2>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-500">Manage your gym</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowAddMember(true)}
                className="group bg-white hover:bg-zinc-100 text-black px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
              <button 
                onClick={() => setShowSearchModal(true)}
                className="group bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Left: Title with icon */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Members</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">Manage your gym community</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSearchModal(true)}
                className="group bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                Search Members
              </button>
              <button 
                onClick={() => setShowAddMember(true)}
                className="group bg-white hover:bg-zinc-100 text-black px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add New Member
              </button>
            </div>
          </div>
        </div>

        {/* ===============================================
            MEMBERS TABLE SECTION
            Displays list of all members with their details
            =============================================== */}
        <div className="bg-white rounded-xl p-4 sm:p-6">          {/* TABLE CONTENT - Shows member data in table or card format based on screen size */}
          <div className="w-full overflow-x-auto">
            {/* LOADING STATE - Skeleton table while fetching member data */}
            {isMembersLoading ? (
              <div className="py-2">
                <div className="hidden sm:block">
                  <TableSkeleton rows={6} />
                </div>
                <div className="sm:hidden space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-1/4"></div></div>
                        <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-1/6"></div></div>
                        <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-1/3"></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : membersError ? (
                <p role="alert" className="py-8 text-center text-sm text-red-700">Could not load members. <button type="button" onClick={() => retryMembers()} className="underline">Retry</button></p>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {/* EMPTY STATE - Message shown when no members exist */}
                  <p className="text-lg font-medium">No members found</p>
                  <p className="text-sm">Add your first member to get started</p>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE VIEW - Full table with all member details */}
                  <div className="hidden sm:block">
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
                        {/* Individual member rows - Shows first 6 members */}
                        {members.slice(0, 6).map((member, idx) => {
                          return (
                            <tr
                              key={idx}
                              className="border-b border-gray-200 hover:bg-gray-50"
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
                              <td className="px-4 py-3 text-left text-gray-900"><button type="button" className="text-left font-medium hover:underline focus-visible:underline" onClick={() => { setMember(member); setShowMemberModal(true); }} aria-label={`View ${member.name}`}>{member.name}</button></td>
                              <td className="px-4 py-3 text-left text-gray-900">{member.subscriptions[0]?.plan || 'N/A'}</td>
                              <td className="px-4 py-3 text-left text-gray-900">
                                {isYetToStart(member.subscriptions?.[0]?.start_date)
                                  ? "Yet to start"
                                  : (computeDaysLeft(member.subscriptions?.[0]?.start_date, member.subscriptions?.[0]?.end_date) ?? 0)}
                              </td>
                              <td className="px-4 py-3 text-left text-gray-900">{member.phone_number || 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARD VIEW */}
                  <div className="sm:hidden space-y-2">
                    {members.slice(0, 6).map((member, idx) => (
                      <MemberCard
                        key={idx}
                        member={member}
                        onClick={() => {
                          setMember(member);
                          setShowMemberModal(true);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

            {/* SHOW ALL MEMBERS BUTTON - Link to full members list when more than 6 members exist */}
            {members.length > 6 && (
              <div className="text-right mt-4">
                <button
                  className="text-sm text-gray-600 hover:text-gray-800 hover:underline cursor-pointer font-medium"
                  onClick={() => navigate(user?.role === 'manager' ? '/manager/members' : '/admin/members')}
                >
                  Show All Members →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW FIELD MODAL - Form for adding new subscription plans/packages */}
      <NewFieldModal isOpen={isNewFieldModalOpen} onClose={() => setIsNewFieldModalOpen(false)} />
    </div>
  );
}

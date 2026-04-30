import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import NewFieldModal from "./NewField";
import AddMemberModal from "../../components/AddMemberModal";
import ExpiredSubscriptionsModal from "../../components/ExpiredSubscriptionsModal";
import ExpiringSoonModal from "../../components/ExpiringSoonModal";
import axios from "axios";
import ShowMemberModal from "../../components/ShowMemberModal";
import { toast } from "react-hot-toast";
import SearchMembersModal from '../../components/SearchMembersModal';
import Spinner, { CardSkeleton, TableSkeleton } from "../../components/Spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const expiredSubscriptions = [
  { name: "UNKNOWN", date: "19 Feb 2023" },
  { name: "Beru", date: "19 Dec 2023" },
  { name: "Demon", date: "19 Feb 2023" },
  { name: "Kratos", date: "19 Mar 2023" },
];

const expiringSoon = [
  { name: "Naruto Uzumaki", days: 9 },
  { name: "Madara Uchiha", days: 4 },
  { name: "Obito Uchiha", days: 6 },
  { name: "Sung Jinwoo", days: 0 },
];

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
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showExpiringSoonModal, setShowExpiringSoonModal] = useState(false);

  const queryClient = useQueryClient();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [member, setMember] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAllMembersModal, setShowAllMembersModal] = useState(false);

  // Normalize today's date to midnight for birthday calculations
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const getNextBirthdayDate = (dobStr) => {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    const thisYear = new Date(
      today.getFullYear(),
      dob.getMonth(),
      dob.getDate()
    );
    thisYear.setHours(0, 0, 0, 0);

    if (thisYear >= today) return thisYear;

    const nextYear = new Date(
      today.getFullYear() + 1,
      dob.getMonth(),
      dob.getDate()
    );
    nextYear.setHours(0, 0, 0, 0);
    return nextYear;
  };

  const getDaysUntilBirthday = (dobStr) => {
    const target = getNextBirthdayDate(dobStr);
    if (!target) return null;
    const diffMs = target - today;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  const getDayStatus = (dobStr) => {
    const diffDays = getDaysUntilBirthday(dobStr);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Queries
  const { data: members = [], isLoading: isMembersLoading } = useQuery({
    queryKey: ['dashboard', 'members'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/get-members`, { withCredentials: true });
      return response.data.members || [];
    }
  });

  const { data: expiredSubscriptions = [], isLoading: isExpiredLoading } = useQuery({
    queryKey: ['dashboard', 'expiredSubscriptions'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/expired`, { withCredentials: true });
      return response.data.expiredSubscriptions || [];
    }
  });

  const { data: expiringSoon = [], isLoading: isExpiringLoading } = useQuery({
    queryKey: ['dashboard', 'expiringSoon'],
    queryFn: async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/member/expiring-soon`, {}, { withCredentials: true });
      return response.data.expiringSoon || [];
    }
  });

  const { data: birthdayList = [], isLoading: isBirthdayLoading } = useQuery({
    queryKey: ['dashboard', 'birthdays'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/get-birthdays`, { withCredentials: true });
      return response.data.birthdayMembers || [];
    }
  });

  const isInitialLoading = isMembersLoading || isExpiredLoading || isExpiringLoading || isBirthdayLoading;

  const handleAddMemberSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleSaveMember = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  // Show initial loading screen
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ===============================================
          MODALS - Hidden UI components for interactions
          =============================================== */}
      
      {/* Sidebar Navigation Modal */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onMembersClick={() => setShowAllMembersModal(true)} />
      
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
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          {/* Gym name title and badge */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
            <h1 className="text-3xl sm:text-5xl text-gray-700 font-extrabold tracking-tight font-montserrat">{user?.gym_name || "GYM"}</h1>
            <span className="bg-black text-white px-2 sm:px-3 py-1 rounded font-semibold text-xs sm:text-md sm:mb-1 font-poppins">SUBSCRIPTION MANAGER</span>
          </div>
          
          {/* Hamburger Menu Button - Opens sidebar on mobile */}
          <button 
            onClick={toggleSidebar}
            className="bg-white font-bold text-2xl text-black p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* ===============================================
            TOP STATS CARDS SECTION
            Shows: Expired subscriptions, Expiring soon, Birthdays
            =============================================== */}
        <div className="flex flex-wrap gap-6 mb-8">
          
          {/* CARD 1: EXPIRED SUBSCRIPTIONS - Members with expired memberships */}
          <div className="bg-[#e8d6e2] flex-1 min-w-[300px] p-6 rounded-[10px] flex flex-col justify-between">
            <div className="rounded-lg">
              <h2 className="font-bold text-[1.3rem] mb-4 text-start font-montserrat text-gray-800">SUBSCRIPTION EXPIRED</h2>
              {isExpiredLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Spinner size="md" />
                </div>
              ) : expiredSubscriptions.length === 0 ? (
                <div className="text-center py-4 text-gray-500 flex items-center justify-center h-full">
                  <div>
                    <p className="text-xs sm:text-sm">No expired subscriptions</p>
                    <p className="text-xs sm:text-sm">Add your first member to get started</p>
                  </div>
                </div>
              ) : (
                <ul className="mb-2">
                  {expiredSubscriptions.slice(0, 4).map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm sm:text-base font-medium text-gray-800 mb-1">
                      <span className="truncate mr-2">{item.name}</span>
                      <span className="text-xs sm:text-sm">{item.subscriptions[0]?.end_date ? new Date(item.subscriptions[0].end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {expiredSubscriptions.length > 4 && (
              <div 
                className="text-right font-bold cursor-pointer hover:underline mt-auto" 
                style={{marginTop: 'auto'}}
                onClick={() => setShowExpiredModal(true)}
              >
                Show all
              </div>
            )}
          </div>

          {/* CARD 2: EXPIRING SOON - Members with memberships expiring in next 10 days */}
          <div className="bg-[#f2e6c9] flex-1 min-w-[300px] p-6 rounded-[10px] flex flex-col justify-between">
            <div className="rounded-lg">
              <h2 className="font-bold text-[1.3rem] mb-4 text-start font-montserrat text-gray-800">EXPIRING SOON</h2>
              {isExpiringLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Spinner size="md" />
                </div>
              ) : expiringSoon.length === 0 ? (
                <div className="text-center py-4 text-gray-500 flex items-center justify-center h-full">
                  <p className="text-xs sm:text-sm">No expiring soon subscriptions in the next 10 days</p>
                </div>
              ) : (
                <ul className="mb-2">
                {expiringSoon.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm sm:text-base font-medium text-gray-800 mb-1">
                    <span className="truncate mr-2">{item.name}</span>
                    <span className={`text-xs sm:text-sm ${
                      item.days_left === 0
                        ? "text-red-600 font-bold"
                        : item.days_left <= 4
                        ? "text-red-500 font-bold"
                        : "text-yellow-700 font-bold"
                    }`}>
                      {item.days_left} {item.days_left === 1 ? "Day" : "Days"} left
                    </span>
                  </li>
                  ))}
                </ul>
              )}
            </div>
            {expiringSoon.length > 4 && (
              <div 
                className="text-right font-bold cursor-pointer hover:underline mt-auto" 
                style={{marginTop: 'auto'}}
                onClick={() => setShowExpiringSoonModal(true)}
              >
                Show all
              </div>
            )}
          </div>

          {/* CARD 3: MEMBERS BIRTHDAY - Upcoming member birthdays */}
          <div className="bg-[#c1ebf1] flex-1 min-w-[300px] p-6 rounded-[10px] flex flex-col justify-between">
            <div className="rounded-lg">
              <h2 className="font-bold text-[1.3rem] mb-4 text-start font-montserrat text-gray-800">MEMBERS BIRTHDAY 🎂</h2>
              {isBirthdayLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Spinner size="md" />
                </div>
              ) : birthdayList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 flex items-center justify-center h-full">
                  <p className="text-xs sm:text-sm">No upcoming birthdays</p>
                </div>
              ) : (
                <ul className="mb-2">
                  {birthdayList.slice(0, 4).map((item, idx) => {
                    const status = getDayStatus(item.dob);
                    const days = getDaysUntilBirthday(item.dob);
                    const isToday = status === "Today";
                    const isTomorrow = status === "Tomorrow";

                    return (
                      <li key={idx} className="flex justify-between text-sm sm:text-base font-medium text-gray-800 mb-1">
                        <span className="truncate mr-2">{item.name}</span>
                        <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded ${
                          isToday
                            ? "bg-emerald-500 text-white"
                            : isTomorrow
                            ? "bg-sky-500 text-white"
                            : "text-yellow-700 font-bold"
                        }`}>
                          {status}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {birthdayList.length > 4 && (
              <div
                className="text-right font-bold cursor-pointer hover:underline mt-auto"
                style={{ marginTop: 'auto' }}
                onClick={() => navigate('/admin/birthdays')}
              >
                Show all
              </div>
            )}
          </div>
        </div>

        {/* ===============================================
            MEMBERS TABLE SECTION
            Displays list of all members with their details
            =============================================== */}
        <div className="bg-white rounded-xl p-4 sm:p-6">
          
          {/* MOBILE VIEW - Header and search/add buttons for small screens */}
          <div className="sm:hidden mb-4">
            <h2 className="text-xl font-extrabold tracking-tight bg-[#d6f6ff] px-3 py-1 rounded mb-3 font-montserrat">MEMBERS</h2>
            <div className="flex flex-col gap-2">
              <button className="bg-black text-white px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-1 cursor-pointer" onClick={() => setShowSearchModal(true)}>
                <Search className="w-4 h-4" />Search Members
              </button>
              <button className="bg-white border-2 border-black px-3 py-2 rounded text-sm font-semibold cursor-pointer" onClick={() => setShowAddMember(true)}>+ Add New Member</button>
            </div>
          </div>

          {/* DESKTOP VIEW - Header with title and action buttons for larger screens */}
          <div className="hidden sm:flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold tracking-tight bg-[#d6f6ff] px-6 py-3 rounded-xl font-montserrat">MEMBERS</h2>
            <div className="flex gap-2">
              <button className="bg-white border-2 border-black px-3 py-1 rounded text-sm font-semibold cursor-pointer" onClick={() => setShowAddMember(true)}>+ Add New Member</button>
              <button className="bg-black text-white px-3 py-1 rounded text-sm font-semibold flex items-center gap-1 cursor-pointer" onClick={() => setShowSearchModal(true)}>
                <Search className="w-4 h-4" />Search
              </button>
            </div>
          </div>

          {/* TABLE CONTENT - Shows member data in table or card format based on screen size */}
          <div className="w-full overflow-x-auto">
            {/* LOADING STATE - Spinner while fetching member data */}
            {isMembersLoading ? (
              <div className="py-8">
                <div className="flex items-center justify-center mb-4">
                  <Spinner size="lg" />
                </div>
                <p className="text-center text-gray-500">Loading members...</p>
              </div>
            ) : 
            
                members.length === 0 ? (
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
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">NAME</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">SUBSCRIPTION PLAN</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">Days Left</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800 font-poppins">Phone Number</th>
                        <th className="px-4 py-3 text-left"></th>
                      </tr>
                    </thead>
                    {/* Separator line under table headers */}
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <div className="border-b border-gray-300 w-full"></div>
                        </td>
                      </tr>
                      {/* Individual member rows - Shows first 6 members */}
                      {members.slice(0, 6).map((member, idx) => {
                        return (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-left text-gray-900">{member.name}</td>
                            <td className="px-4 py-3 text-left text-gray-900">{member.subscriptions[0]?.plan || 'N/A'}</td>
                            <td className="px-4 py-3 text-left text-gray-900">
                              {member.days_left}
                            </td>
                            <td className="px-4 py-3 text-left text-gray-900">{member.phone_number || 'N/A'}</td>
                            <td className="px-4 py-3 text-left">
                              <button
                                className="bg-cyan-100 text-black px-5 py-2 rounded-md font-semibold hover:bg-cyan-200 transition cursor-pointer"
                                onClick={() => {
                                  setMember(member);
                                  setShowMemberModal(true);
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARD VIEW - Individual cards for each member on small screens */}
                <div className="sm:hidden space-y-4"> 
                  {members.slice(0, 6).map((member, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Member card header with name and view button */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                        <button
                          className="bg-cyan-100 text-black px-3 py-1 rounded text-sm font-semibold hover:bg-cyan-200 transition cursor-pointer"
                          onClick={() => {
                            setMember(member);
                            setShowMemberModal(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                      {/* Member card details - Shows subscription, days left, phone, age, gender */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Plan:</span>
                          <span className="font-medium">{member.subscriptions[0]?.plan || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days Left:</span>
                          <span className="font-medium">{member.days_left}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span className="font-medium">{member.phone_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium">{member.age || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gender:</span>
                          <span className="font-medium">{member.gender || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
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

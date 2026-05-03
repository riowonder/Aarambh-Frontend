import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import axios from "axios";
import ShowMemberModal from "../../components/ShowMemberModal";
import Spinner from "../../components/Spinner";

export default function Birthday() {
    const navigate = useNavigate();

    // --- LOGIC START ---
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [filterType, setFilterType] = useState("active"); // 'active' | 'all'
    const [membersData, setMembersData] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 12; // Adjusted for grid layout
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isBirthdayLoading, setIsBirthdayLoading] = useState(false);

    const getNextBirthdayDate = (dobStr) => {
        const dob = new Date(dobStr);
        const thisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        thisYear.setHours(0, 0, 0, 0);
        if (thisYear >= today) return thisYear;
        const nextYear = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
        nextYear.setHours(0, 0, 0, 0);
        return nextYear;
    };

    const getDaysUntilBirthday = (dobStr) => {
        const target = getNextBirthdayDate(dobStr);
        const diffMs = target - today;
        return Math.round(diffMs / (1000 * 60 * 60 * 24));
    };

    const getDayStatus = (dobStr) => {
        const diffDays = getDaysUntilBirthday(dobStr);
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        return `${diffDays} days left`;
    };

    const isMemberActive = (member) => {
        return member.subscriptions?.[0]?.status === 'Active' || member.subscription_status === 'Active';
    };

    const filteredMembers = useMemo(() => {
        let list = [...membersData];
        if (filterType === "active") {
            list = list.filter((m) => isMemberActive(m));
        }
        list.sort((a, b) => getDaysUntilBirthday(a.dob) - getDaysUntilBirthday(b.dob));
        return list;
    }, [membersData, filterType, today]);

    const todayBirthdays = useMemo(() => {
        // STRICT CONSTRAINT: Inactive members NEVER in Top Section
        return filteredMembers.filter(m => getDaysUntilBirthday(m.dob) === 0 && isMemberActive(m));
    }, [filteredMembers, today]);

    const upcomingBirthdays = useMemo(() => {
        return filteredMembers.filter(m => !todayBirthdays.includes(m));
    }, [filteredMembers, todayBirthdays]);

    const totalPages = Math.max(1, Math.ceil(upcomingBirthdays.length / pageSize) || 1);
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedMembers = upcomingBirthdays.slice(startIndex, startIndex + pageSize);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    const getBirthdayList = async () => {
        setIsBirthdayLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/get-birthdays`, { withCredentials: true });
            const data = response?.data;
            const list = Array.isArray(data) ? data : Array.isArray(data?.birthdayMembers) ? data.birthdayMembers : [];
            const normalized = Array.isArray(list) ? list.map((m) => ({ name: m.name, dob: m.dob, ...m })) : [];
            setMembersData(normalized);
            setPage(1);
        } catch (error) {
            console.error("Error fetching birthday list:", error);
            setMembersData([]);
        } finally {
            setIsBirthdayLoading(false);
        }
    };

    useEffect(() => {
        getBirthdayList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // --- LOGIC END ---

    // Array of vibrant background colors for hero cards
    const heroColors = ["bg-[#fcd34d]", "bg-[#67e8f9]", "bg-[#f9a8d4]", "bg-[#bef264]"];

    return (
        <div className="w-full overflow-x-hidden relative z-10 px-6 py-4 sm:p-8">
            <div className="w-full max-w-5xl mx-auto">
                <ShowMemberModal
                    isOpen={showMemberModal}
                    onClose={() => setShowMemberModal(false)}
                    member={selectedMember}
                    onSave={() => getBirthdayList()}
                />

                {/* Header Section */}
                <div className="mb-6 sm:mb-8 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 relative z-10">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer z-30 relative"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>

                        {/* Centered Heading */}
                        <div className="w-full sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 z-10 pointer-events-none text-left sm:text-center">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Birthdays</h1>
                            <p className="text-gray-500 text-sm mt-1 hidden sm:block">Track and celebrate member birthdays</p>
                        </div>

                        {/* Filter */}
                        <div className="flex flex-col gap-1.5 items-start sm:items-end w-full sm:w-auto z-30 relative">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filter</label>
                            <select
                                value={filterType}
                                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto min-w-[160px] cursor-pointer transition-colors hover:bg-gray-100"
                            >
                                <option value="active" className="text-sm">Active Members Only</option>
                                <option value="all" className="text-sm">Show All Members</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isBirthdayLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Spinner size="lg" />
                        <p className="text-gray-500 mt-4 animate-pulse font-medium">Loading celebrations...</p>
                    </div>
                ) : (
                    <>
                        {/* Top Section (Today's Birthdays) */}
                        {todayBirthdays.length > 0 && (
                            <div className="flex flex-col gap-4 mb-8">
                                {todayBirthdays.map((member, index) => {
                                    const bgColor = heroColors[index % heroColors.length];
                                    return (
                                        <div
                                            key={member._id || index}
                                            onClick={() => { setSelectedMember(member); setShowMemberModal(true); }}
                                            className={`${bgColor} border-2 border-black rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:opacity-90 transition-opacity gap-4`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden bg-white shrink-0">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xl font-black text-black">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-black leading-tight">{member.name}</h2>
                                                    <p className="font-bold text-black/70">{member.subscriptions?.[0]?.plan || "No Plan"}</p>
                                                </div>
                                            </div>
                                            <div className="bg-black text-white px-5 py-2 font-black rounded-xl uppercase tracking-widest text-sm border-2 border-transparent shrink-0">
                                                TODAY!
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Main List (Upcoming Birthdays) */}
                        {upcomingBirthdays.length === 0 && todayBirthdays.length === 0 ? (
                            <div className="bg-white border border-gray-500 rounded-2xl p-8 sm:p-12 text-center mt-6">
                                <div className="w-20 h-20 bg-gray-50 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Gift className="w-10 h-10 text-black" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-black mb-2">No birthdays found</h3>
                                <p className="text-sm sm:text-base text-gray-600 font-medium">Try adjusting your filter settings.</p>
                            </div>
                        ) : (
                            <>
                                {upcomingBirthdays.length > 0 && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {paginatedMembers.map((member, index) => {
                                                const isActive = isMemberActive(member);
                                                return (
                                                    <div
                                                        key={member._id || index}
                                                        onClick={() => { setSelectedMember(member); setShowMemberModal(true); }}
                                                        className={`${isActive ? 'bg-white border-gray-500/50 hover:bg-gray-50' : 'bg-gray-200 border-gray-400 hover:bg-gray-300'} border rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer gap-3`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-10 h-10 rounded-full border border-gray-500/50 overflow-hidden bg-gray-100 shrink-0">
                                                                {member.image ? (
                                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center font-bold text-black text-sm">
                                                                        {member.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="text-base font-bold text-black truncate" title={member.name}>{member.name}</h3>
                                                                <p className="text-xs font-semibold text-gray-500 truncate">{member.subscriptions?.[0]?.plan || "No Plan"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-bold border border-gray-500/30 bg-gray-50 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                                                            {getDayStatus(member.dob)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center mt-8 gap-4">
                                                <button
                                                    onClick={handlePrev}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm font-bold text-black">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    onClick={handleNext}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

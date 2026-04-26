import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Cake, ArrowLeft, Calendar, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { createPortal } from "react-dom";
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

    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const [dropdownPos, setDropdownPos] = useState(null);
    const [filterType, setFilterType] = useState("all"); // 'all' | 'week'
    const [membersData, setMembersData] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10; // More items per page for compact view
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isBirthdayLoading, setIsBirthdayLoading] = useState(false);

    // Vibrant festive gradients
    const gradients = [
        "from-rose-400 to-orange-300",
        "from-violet-400 to-fuchsia-300",
        "from-cyan-400 to-blue-300",
        "from-emerald-400 to-teal-300",
        "from-amber-400 to-yellow-300",
        "from-pink-400 to-rose-300",
    ];

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

    const searchedMembers = useMemo(() => {
        return membersData.filter((m) =>
            (m.name || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [search, membersData]);

    const filteredMembers = useMemo(() => {
        let list = [...searchedMembers];
        if (filterType === "week") {
            list = list.filter((m) => {
                const diff = getDaysUntilBirthday(m.dob);
                return diff >= 0 && diff <= 7;
            });
        }
        list.sort((a, b) => getDaysUntilBirthday(a.dob) - getDaysUntilBirthday(b.dob));
        return list;
    }, [searchedMembers, filterType, today]);

    const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize) || 1);
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + pageSize);

    const handleFilterSelect = (type) => {
        setFilterType(type);
        setShowFilter(false);
        setPage(1);
    };

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

    // Position the dropdown when opened and keep it updated on resize/scroll
    useEffect(() => {
        if (!showFilter) return;
        const update = () => {
            const el = filterRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const menuWidth = 192; // Tailwind w-48 == 12rem == 192px
            const top = Math.max(8, rect.bottom + window.scrollY + 8);
            const left = Math.max(8, rect.right - menuWidth + window.scrollX);
            setDropdownPos({ top, left });
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, { passive: true });
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, [showFilter]);
    // --- LOGIC END ---

    return (
        <div className="min-h-screen bg-[#FDF8F6] font-sans relative overflow-x-hidden">
            {/* Background Confetti Pattern (CSS-based dots) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px), radial-gradient(#EC4899 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 20px 20px'
                }}
            />

            <ShowMemberModal
                isOpen={showMemberModal}
                onClose={() => setShowMemberModal(false)}
                member={selectedMember}
                onSave={() => getBirthdayList()}
            />

            {/* Hero Section */}
            <div className="relative bg-white/50 backdrop-blur-xl border-b border-white/60 pt-6 pb-12 px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="max-w-7xl mx-auto relative">
                    {/* Back Button - Top Left */}
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="absolute left-0 top-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm z-10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    <div className="flex flex-col items-center text-center mt-8 sm:mt-4 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold animate-fade-in-up">
                            <Cake className="w-4 h-4" />
                            <span>Celebrate your people</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Birthdays</span>
                        </h1>

                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            Don't miss a chance to make someone's day special.
                        </p>

                        {/* Search & Filter Bar - Centered in Hero */}
                        <div className="w-full max-w-2xl mt-6 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all shadow-sm hover:shadow-md"
                                />
                            </div>

                            <div className="relative">
                                <button
                                    ref={filterRef}
                                    onClick={() => setShowFilter(!showFilter)}
                                    className={`h-full w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border font-semibold transition-all shadow-sm hover:shadow-md ${filterType === 'week'
                                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Filter className="w-5 h-5" />
                                    <span className="whitespace-nowrap">{filterType === 'week' ? 'This Week' : 'All Upcoming'}</span>
                                </button>

                                {showFilter && dropdownPos && createPortal(
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)} />
                                        <div
                                            style={{ top: dropdownPos.top, left: dropdownPos.left, position: 'absolute' }}
                                            className="fixed w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                                        >
                                            <button
                                                onClick={() => handleFilterSelect("all")}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${filterType === 'all' ? 'text-rose-600 bg-rose-50/50' : 'text-gray-700'}`}
                                            >
                                                All Upcoming
                                            </button>
                                            <button
                                                onClick={() => handleFilterSelect("week")}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${filterType === 'week' ? 'text-rose-600 bg-rose-50/50' : 'text-gray-700'}`}
                                            >
                                                This Week
                                            </button>
                                        </div>
                                    </>,
                                    document.body
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isBirthdayLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Spinner size="lg" />
                        <p className="text-gray-400 mt-4 animate-pulse font-medium">Loading celebrations...</p>
                    </div>
                ) : paginatedMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-white shadow-sm text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
                            <Gift className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No birthdays found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {paginatedMembers.map((member, index) => {
                            const status = getDayStatus(member.dob);
                            const isToday = status === "Today";
                            const isTomorrow = status === "Tomorrow";
                            const dobDate = new Date(member.dob);
                            const nextBirthday = getNextBirthdayDate(member.dob);
                            const turns = nextBirthday.getFullYear() - dobDate.getFullYear();
                            const gradient = gradients[index % gradients.length];

                            return (
                                <div
                                    key={member._id || index}
                                    onClick={() => { setSelectedMember(member); setShowMemberModal(true); }}
                                    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-5 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center text-center"
                                >
                                    {/* Gradient Header Background */}
                                    <div className={`absolute top-0 inset-x-0 h-20 bg-gradient-to-br ${gradient} opacity-10`} />

                                    {/* Avatar */}
                                    <div className="relative mb-3">
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-white">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className={`text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${gradient}`}>
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Age Badge */}
                                        <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded-full shadow-md border border-gray-100 flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-gray-600">{turns}th</span>
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 w-full px-2" title={member.name}>
                                        {member.name}
                                    </h3>

                                    {/* Date & Status */}
                                    <div className="mt-3 w-full space-y-2">
                                        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {dobDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </div>

                                        <div className={`w-full py-1.5 rounded-xl text-xs font-bold transition-colors ${isToday ? "bg-rose-500 text-white shadow-rose-200 shadow-lg" :
                                                isTomorrow ? "bg-blue-500 text-white shadow-blue-200 shadow-lg" :
                                                    "bg-gray-100 text-gray-600"
                                            }`}>
                                            {status}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {filteredMembers.length > 0 && (
                    <div className="flex items-center justify-center mt-10 gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

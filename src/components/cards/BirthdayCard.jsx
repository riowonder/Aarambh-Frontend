import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
// import { Cake } from "lucide-react";


export default function BirthdayCard() {
    const navigate = useNavigate();

    //BIRTHDAY HELPER LOGIC
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


    //API  QUERY   
    const { data: birthdayList = [], isLoading: isBirthdayLoading } = useQuery({
        queryKey: ['dashboard', 'birthdays'],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/get-birthdays`, { withCredentials: true 
            });

            return response.data.birthdayMembers || [];
        }
    });

    return (
    <>
        {/* CARD 3: MEMBERS BIRTHDAY - Upcoming member birthdays */}
        <div className="bg-[#c1ebf1] p-5 sm:p-6 rounded-2xl border border-gray-300 flex flex-col justify-between transition-shadow hover:shadow-sm min-h-[180px]">
            <div className="rounded-lg flex flex-col flex-1">
                <h2 className="font-bold text-[1.3rem] mb-4 text-start font-montserrat text-gray-800">MEMBERS BIRTHDAY 🎂</h2>
                {isBirthdayLoading ? (
                    <div className="animate-pulse flex flex-col gap-3 mt-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="h-4 bg-black/10 rounded w-1/2"></div>
                                <div className="h-4 bg-black/10 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : birthdayList.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-center text-gray-500">
                        <p className="text-xs sm:text-sm">No upcoming birthdays</p>
                    </div>
                ) : (
                    <ul className="mb-2 px-2 sm:px-3">
                        {birthdayList.slice(0, 4).map((item, idx) => {
                            const status = getDayStatus(item.dob);
                            // const days = getDaysUntilBirthday(item.dob);
                            const isToday = status === "Today";
                            const isTomorrow = status === "Tomorrow";

                            return (
                                <li key={idx} className="flex justify-between text-sm  sm:text-base font-medium text-gray-800">
                                    <span className="min-w-0 truncate mr-2 whitespace-nowrap">
                                        {item.name}
                                        <span className="text-xs text-gray-600 font-medium">
                                            {" "}({item.subscriptions?.[0]?.plan || "N/A"})
                                        </span>
                                    </span>



                                    <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded ${isToday
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
            {birthdayList.length > 1 && (
                <button
                    className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800 hover:underline mt-auto ml-auto block"
                    onClick={() => navigate('/admin/birthdays')}
                >
                    Show all →
                </button>
            )}
        </div>

    </>
)
}
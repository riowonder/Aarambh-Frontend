import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { 
  Menu, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Hash 
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function UserDashboard() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const userMail = user?.email;
    if (!userMail) return;

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        setLoadingProfile(true);
        setProfileError(null);
        const res = await fetch(`http://localhost:3000/user/profile`, {
          method: 'POST',
          credentials: 'include',
          signal,
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userMail })
        });
        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setProfileError(err.message || 'Failed to load profile');
        }
      } finally {
        setLoadingProfile(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
            <h1 className="text-3xl sm:text-5xl text-gray-700 font-extrabold tracking-tight font-montserrat">
              Welcome, {user?.name || "User"}
            </h1>
            <span className="bg-black text-white px-2 sm:px-3 py-1 rounded font-semibold text-xs sm:text-md sm:mb-1 font-poppins">
              DASHBOARD
            </span>
          </div>
          
          {/* Hamburger Menu */}
          <button 
            onClick={toggleSidebar}
            className="bg-white font-bold text-2xl text-black p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* --- New Dashboard Content --- */}
        <div className="max-w-4xl mx-auto">
          
          {/* Subscription Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col items-center text-center">
              {loadingProfile ? (
                <div className="py-12">Loading subscription...</div>
              ) : profileError ? (
                <div className="py-12 text-red-600">{profileError}</div>
              ) : (() => {
                const subscription = profile?.subscription ?? null;
                // Treat empty array as no subscription
                const noSub = !subscription || (Array.isArray(subscription) && subscription.length === 0);
                if (noSub) {
                  return <div className="py-12 text-gray-600 font-medium">No Current ongoing subscription</div>;
                }

                // subscription can be an object
                const start = subscription?.start_date ? new Date(subscription.start_date) : null;
                const end = subscription?.end_date ? new Date(subscription.end_date) : null;
                const now = new Date();
                let totalDays = 0;
                let elapsed = 0;
                if (start && end) {
                  totalDays = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
                  elapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
                  elapsed = Math.max(0, Math.min(elapsed, totalDays));
                }
                const percent = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 100;
                const daysLeft = typeof subscription?.days_left === 'number'
                  ? Math.max(0, subscription.days_left)
                  : end ? Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24))) : 0;

                const startedLabel = start ? start.toLocaleDateString() : 'N/A';
                const endLabel = end ? end.toLocaleDateString() : 'N/A';

                return (
                  <>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm tracking-wide uppercase">
                      <Calendar className="w-4 h-4" />
                      Subscription Active
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <Clock className="w-8 h-8 text-green-500" />
                      <h2 className="text-4xl font-extrabold text-gray-900">Days Left: {daysLeft} Days</h2>
                    </div>

                    <p className="text-gray-500 font-medium mt-1">{subscription?.plan || 'Plan'}</p>

                    {/* Progress Bar */}
                    <div className="w-full mt-6">
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">
                        <span>Started {startedLabel}</span>
                        <span>Expires {endLabel}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* User Details */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              Verified Account
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={<UserIcon className="w-5 h-5 text-gray-400" />} label="Full Name" value={profile?.user?.name || user?.name || "Jonathan Miller"} />
            <DetailItem icon={<Mail className="w-5 h-5 text-gray-400" />} label="Email Address" value={profile?.user?.email || user?.email || "j.miller@performance.io"} />
            <DetailItem icon={<Phone className="w-5 h-5 text-gray-400" />} label="Phone Number" value={profile?.user?.phone_number || user?.phone_number || "+1 (555) 012-3456"} />
            <DetailItem icon={<Mail className="w-5 h-5 text-gray-400" />} label="Address" value={profile?.user?.address || user?.address || "Not provided"} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Details
function DetailItem({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-gray-800 font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
}
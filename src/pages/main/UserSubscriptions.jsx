import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Menu } from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function UserSubscriptions() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchSubs = async () => {
      const userMail = user?.email;
      console.log(userMail);
      if (!userMail) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:3000/user/subscriptions', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userMail })
        });
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const data = await res.json();
        let subs = Array.isArray(data.subscriptions) ? data.subscriptions : [];
        // sort by start_date descending (recent first)
        subs.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setSubscriptions(subs);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, [user]);

  return (
    <div className="min-h-screen border-gray-200">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
            <h1 className="text-3xl sm:text-5xl text-gray-700 font-extrabold tracking-tight font-montserrat">Welcome, {user?.name || "User"}</h1>
            <span className="bg-black text-white px-2 sm:px-3 py-1 rounded font-semibold text-xs sm:text-md sm:mb-1 font-poppins">SUBSCRIPTIONS</span>
          </div>
          
          {/* Hamburger Menu */}
          <button 
            onClick={toggleSidebar}
            className="bg-white font-bold text-2xl text-black p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Members Table Like Structure */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold tracking-tight bg-[#d6f6ff] px-3 py-1 rounded font-montserrat">MY SUBSCRIPTIONS</h2>
          </div>

          <div className="w-full overflow-x-auto py-2">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading subscriptions...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : subscriptions.length === 0 ? (
              <div className="w-full overflow-x-auto text-center py-8 text-gray-500">
                <p className="text-lg font-medium">No Subscriptions Found</p>
                <p className="text-sm">You do not have any active subscriptions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((s) => {
                  const start = s.start_date ? new Date(s.start_date) : null;
                  const end = s.end_date ? new Date(s.end_date) : null;
                  const daysLeft = typeof s.days_left === 'number' ? s.days_left : (end ? Math.max(0, Math.ceil((end - new Date()) / (1000*60*60*24))) : 0);
                  const status = s.status || 'Unknown';
                  return (
                    <div key={s._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{s.plan}</h3>
                          <p className="text-sm text-gray-500 mt-1">Amount: ₹{s.amount}</p>
                          <p className="text-sm text-gray-500">{start ? `Started: ${start.toLocaleDateString()}` : 'Start: N/A'}</p>
                          <p className="text-sm text-gray-500">{end ? `Ends: ${end.toLocaleDateString()}` : 'End: N/A'}</p>
                        </div>

                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${status === 'Active' ? 'bg-green-100 text-green-700' : status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {status}
                          </div>
                          <div className="text-sm font-bold text-gray-800 mt-3">{daysLeft} days</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-4">
                        {start && end ? (
                          <div className="bg-green-500 h-full" style={{ width: `${Math.min(100, Math.round(((new Date() - start) / (end - start)) * 100))}%` }}></div>
                        ) : (
                          <div className="bg-gray-300 h-full w-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

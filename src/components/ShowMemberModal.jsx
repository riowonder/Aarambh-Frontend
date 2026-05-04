import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditMemberModal from './EditMemberModal';
import SubscriptionModal from './SubscriptionModal';

export default function ShowMemberModal({ isOpen, onClose, member, onSave }) {
  const [details, setDetails] = useState(member || {});
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    if (isOpen && member && member._id) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/member/${member._id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setDetails(response.data.member);
        })
        .catch(() => {
          setDetails(member);
        })
        .finally(() => setLoading(false));
    } else if (member) {
      setDetails(member);
    }
  }, [isOpen, member && member._id]);

  if (!isOpen || !member) return null;

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4">
        <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden animate-pulse">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Profile Image Skeleton */}
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 border-4 border-white shadow-md"></div>
            </div>

            {/* Basic Info Skeleton */}
            <div className="mb-6 border-b pb-4">
              <div className="h-8 w-40 bg-gray-200 rounded-lg mb-5"></div>
              <div className="flex flex-col gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-baseline gap-4">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Details Skeleton */}
            <div className="mb-4 pb-4">
               <div className="h-8 w-40 bg-gray-200 rounded-lg mb-5"></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="flex items-baseline gap-4">
                     <div className="h-5 bg-gray-200 rounded w-16"></div>
                     <div className="h-5 bg-gray-200 rounded w-16"></div>
                   </div>
                 ))}
               </div>
               <div className="mt-4 flex items-baseline gap-4">
                 <div className="h-5 bg-gray-200 rounded w-20"></div>
                 <div className="h-5 bg-gray-200 rounded w-2/3"></div>
               </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="p-6 border-t border-[#ddd] flex flex-wrap justify-end gap-4 shrink-0 bg-white">
            <div className="h-10 bg-gray-200 rounded-[5px] w-32"></div>
            <div className="h-10 bg-gray-200 rounded-[5px] w-24"></div>
            <div className="h-10 bg-gray-200 rounded-[5px] w-24"></div>
          </div>
        </div>
      </div>
    );

  const handleEdit = () => setShowEdit(true);
  const handleEditClose = () => setShowEdit(false);
  const handleEditSave = (updatedMember) => {
    setDetails(updatedMember);
    setShowEdit(false);
    if (onSave) onSave(updatedMember);
  };

  const latestSub = details.latest_subscription || (details.subscriptions && details.subscriptions[0]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4">
        <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
            <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Member Details</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer transition"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Scrollable content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                {details.image ? (
                  <img
                    src={details.image}
                    alt="Member"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg inline-flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h4" />
                  </svg>
                  Basic Information
                </span>
              </h3>
                <div className="flex flex-col gap-3 sm:gap-4">
                  {(() => {
                    const format = (val, key) => {
                      if (val === null || val === undefined || val === "") return "N/A";
                      const isDateKey = /date|dob|joined|created|updated|expiry|expiry_date/i.test(key);
                      const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/;
                      if (isDateKey || (typeof val === "string" && isoDateRegex.test(val))) {
                        const d = new Date(val);
                        if (!isNaN(d)) return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                      }
                      return String(val);
                    };

                    return (
                      <>
                        <div className="flex items-baseline gap-2 text-sm sm:text-base">
                          <span className="font-semibold capitalize text-gray-700 min-w-fit">Serial no:</span>
                          <span className="text-gray-900 break-words">{format(details.serial_no, 'serial_no')}</span>
                        </div>
                        <div className="flex items-baseline gap-2 text-sm sm:text-base">
                          <span className="font-semibold capitalize text-gray-700 min-w-fit">Name:</span>
                          <span className="text-gray-900 break-words">{format(details.name, 'name')}</span>
                        </div>
                        <div className="flex items-baseline gap-2 text-sm sm:text-base">
                          <span className="font-semibold capitalize text-gray-700 min-w-fit">Email:</span>
                          <span className="text-gray-900 break-words">{format(details.email, 'email')}</span>
                        </div>
                        <div className="flex items-baseline gap-2 text-sm sm:text-base">
                          <span className="font-semibold capitalize text-gray-700 min-w-fit">Phone number:</span>
                          <span className="text-gray-900 break-words">{format(details.phone_number, 'phone_number')}</span>
                        </div>
                        <div className="flex items-baseline gap-2 text-sm sm:text-base">
                          <span className="font-semibold capitalize text-gray-700 min-w-fit">DOB:</span>
                          <span className="text-gray-900 break-words">{format(details.dob, 'dob')}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
            </div>

            {/* Personal Details */}
            <div className="mb-4 border-b pb-4">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg inline-flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Details
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Gender:</span>
                  <span className="text-gray-900 text-sm sm:text-base">{details.gender || "N/A"}</span>
                </div>
                {/* <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Height:</span>
                  <span className="text-gray-900 text-sm sm:text-base">
                    {details.height ? `${details.height} cm` : "N/A"}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Weight:</span>
                  <span className="text-gray-900 text-sm sm:text-base">
                    {details.weight ? `${details.weight} kg` : "N/A"}
                  </span>
                </div> */}
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Address:</span>
                  <span className="text-gray-900 text-sm sm:text-base break-words">
                    {details.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Sticky Bottom */}
          <div className="p-6 border-t border-[#ddd] flex flex-wrap justify-end gap-4 shrink-0 bg-white">
            <button
              type="button"
              className="py-2 px-6 bg-black text-white rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-800"
              onClick={() => setShowSubscription(true)}
            >
              Subscriptions
            </button>
            <button
              type="button"
              className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-200"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="py-2 px-6 border border-gray-300 text-gray-700 rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscription && (
        <SubscriptionModal
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          memberId={details._id}
          onSuccess={onSave}
        />
      )}

      {/* Edit Member Modal */}
      {showEdit && (
        <EditMemberModal
          isOpen={showEdit}
          onClose={handleEditClose}
          member={details}
          onSave={handleEditSave}
        />
      )}

      {/* Scrollbar Styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 4px;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #e5e7eb #fff;
          }
        `}
      </style>
    </>
  );
}

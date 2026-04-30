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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
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
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-5xl text-gray-400">
                    <span role="img" aria-label="User">👤</span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg">📋 Basic Information</span>
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                {Object.keys(details)
                  .filter(
                    (key) =>
                      typeof details[key] !== 'object' &&
                      key !== "_id" &&
                      key !== "__v" &&
                      key !== "image" &&
                      key !== "createdAt" &&
                      key !== "updatedAt" &&
                      key !== "gym_id" &&
                      key !== "subscriptions" &&
                      key !== "latest_subscription" &&
                      !['height', 'weight', 'gender', 'address'].includes(key)
                  )
                  .sort((a, b) => {
                    const order = ["name", "roll_no", "phone_number", "dob"];
                    const aIdx = order.indexOf(a);
                    const bIdx = order.indexOf(b);
                    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                    if (aIdx !== -1) return -1;
                    if (bIdx !== -1) return 1;
                    return a.localeCompare(b);
                  })
                  .map((key) => {
                    let value = details[key];
                    if (key.toLowerCase().includes("date") && value)
                      value = value.slice(0, 10);
                    return (
                      <div key={key} className="flex items-baseline gap-2 text-sm sm:text-base">
                      <span className="font-semibold capitalize text-gray-700 min-w-fit">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="text-gray-900 break-words">
                        {(() => {
                        if (value === null || value === undefined || value === "") return "N/A";

                        // heuristics: key contains 'date' or value looks like an ISO date
                        const isDateKey = /date|dob|joined|created|updated|expiry|expiry_date/i.test(key);
                        const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/;

                        if (isDateKey || (typeof value === "string" && isoDateRegex.test(value))) {
                          const d = new Date(value);
                          if (!isNaN(d)) {
                          return d.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                          }
                        }

                        return String(value);
                        })()}
                      </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Personal Details */}
            <div className="mb-4 border-b pb-4">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg">📋 Personal Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Gender:</span>
                  <span className="text-gray-900 text-sm sm:text-base">{details.gender || "N/A"}</span>
                </div>
                <div className="flex items-baseline gap-2">
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
                </div>
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

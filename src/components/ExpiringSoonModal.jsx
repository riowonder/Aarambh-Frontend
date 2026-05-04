import React, { useState } from 'react';
import { X } from 'lucide-react';
import ShowMemberModal from './ShowMemberModal';
import MemberCard from './MemberCard';

const ExpiringSoonModal = ({ isOpen, onClose, expiringSoon }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleCloseMemberModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  if (!isOpen) return null;

  const getDaysLeftColor = (daysLeft) => {
    if (daysLeft === 0) return 'text-red-600 font-bold';
    if (daysLeft <= 4) return 'text-red-500 font-bold';
    if (daysLeft <= 7) return 'text-orange-600 font-bold';
    return 'text-yellow-700 font-bold';
  };

  const getDaysLeftBgColor = (daysLeft) => {
    if (daysLeft === 0) return 'bg-red-100 text-red-800';
    if (daysLeft <= 4) return 'bg-red-100 text-red-800';
    if (daysLeft <= 7) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4">
      <div className="bg-white rounded-[10px] w-[90%] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Expiring Soon (Next 10 Days)</h2>
            <p className="text-sm text-gray-600 mt-1 text-left">
              {expiringSoon?.length || 0} member{expiringSoon?.length !== 1 ? 's' : ''} with expiring subscriptions
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!expiringSoon || expiringSoon.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-2">No expiring soon subscriptions</p>
              <p className="text-sm text-gray-500">All members have active subscriptions with more than 10 days remaining</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Member</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Roll No</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Plan</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Days Left</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expiringSoon.map((member, idx) => (
                        <tr
                          key={member._id || idx}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewMember(member)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {member.image ? (
                                <img src={member.image} alt={member.name} className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-gray-500">
                                    {member.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"}
                                  </span>
                                </div>
                              )}
                              <span className="text-gray-900 font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{member.roll_no}</td>
                          <td className="px-4 py-3 text-gray-700">{member.subscriptions?.[0]?.plan || member.subscription_plan || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDaysLeftBgColor(member.days_left)}`}>
                              {member.days_left} {member.days_left === 1 ? 'Day' : 'Days'} left
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{member.phone_number || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.days_left === 0 ? 'bg-red-100 text-red-800' :
                              member.days_left <= 2 ? 'bg-red-100 text-red-800' :
                              member.days_left <= 5 ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.days_left === 0 ? 'Expires Today' :
                               member.days_left <= 2 ? 'Critical' :
                               member.days_left <= 5 ? 'Warning' : 'Notice'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-2">
                {expiringSoon.map((member, idx) => (
                  <MemberCard
                    key={member._id || idx}
                    member={member}
                    onClick={() => handleViewMember(member)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* ShowMemberModal for selected member */}
      <ShowMemberModal
        isOpen={showMemberModal}
        onClose={handleCloseMemberModal}
        member={selectedMember}
      />
    </div>
  );
};

export default ExpiringSoonModal; 
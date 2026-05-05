import React, { useState } from 'react';
import { X } from 'lucide-react';
import ShowMemberModal from './ShowMemberModal';

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const daysExpiredCount = (endDate) => {
  if (!endDate) return 0;
  return Math.ceil((new Date() - new Date(endDate)) / (1000 * 60 * 60 * 24));
};

const expiredBadge = (days) => {
  if (days <= 7)  return 'bg-red-100 text-red-700';
  if (days <= 30) return 'bg-orange-100 text-orange-700';
  return 'bg-gray-100 text-gray-600';
};

// ─── sub-components ─────────────────────────────────────────────────────────

const Avatar = ({ image, name }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
      />
    );
  }
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-gray-500">{initials}</span>
    </div>
  );
};

const MemberRow = ({ member, onClick }) => {
  const endDate   = member.subscriptions?.[0]?.end_date;
  const plan      = member.subscriptions?.[0]?.plan || 'N/A';
  const days      = daysExpiredCount(endDate);

  return (
    <button
      onClick={() => onClick(member)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0"
    >
      <Avatar image={member.image} name={member.name} />

      {/* name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm truncate">{member.name}</span>
          {member.serial_no && (
            <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">#{member.serial_no}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-gray-500">{plan}</span>
          {member.phone_number && (
            <>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-500">{member.phone_number}</span>
            </>
          )}
          {endDate && (
            <>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-400">Expired {formatDate(endDate)}</span>
            </>
          )}
        </div>
      </div>

      {/* days expired badge */}
      <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${expiredBadge(days)}`}>
        {days}d ago
      </span>
    </button>
  );
};

// ─── main component ──────────────────────────────────────────────────────────

const ExpiredSubscriptionsModal = ({ isOpen, onClose, expiredSubscriptions }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  if (!isOpen) return null;

  const handleView = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleCloseMember = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  const count = expiredSubscriptions?.length || 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[1002] p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-xl">

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Expired Subscriptions</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {count} member{count !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <p className="text-gray-600 font-medium">No expired subscriptions</p>
                <p className="text-sm text-gray-400 mt-1">All members have active subscriptions</p>
              </div>
            ) : (
              expiredSubscriptions.map((member, idx) => (
                <MemberRow key={member._id || idx} member={member} onClick={handleView} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      <ShowMemberModal
        isOpen={showMemberModal}
        onClose={handleCloseMember}
        member={selectedMember}
      />
    </>
  );
};

export default ExpiredSubscriptionsModal;

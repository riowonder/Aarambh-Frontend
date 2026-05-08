/**
 * MemberCard — Bordered Media Object Card (mobile only)
 *
 * Props:
 *   member  — member object from API
 *   onClick — fires when the card is clicked
 *   label   — optional string shown on the right instead of days_left
 *             (e.g. "12d ago" for expired members)
 */

const Avatar = ({ image, name }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-200"
      />
    );
  }
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-gray-500">{initials}</span>
    </div>
  );
};

import { computeDaysLeft } from '../utils/dates';

const fmtDays = (d) => {
  if (typeof d === "string") return d;
  if (typeof d === "number") return `${d}d left`;
  return "—";
};

export default function MemberCard({ member, onClick, label }) {
  const plan = member.subscriptions?.[0]?.plan;
  const sub = member.subscriptions?.[0] || null;
  const days = sub ? computeDaysLeft(sub.start_date, sub.end_date) : null;
  const rightText = label ?? fmtDays(days);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer active:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      <Avatar image={member.image} name={member.name} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-semibold text-gray-900 text-sm truncate leading-tight">
            {member.name}
          </span>
          {member.serial_no && (
            <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">
              #{member.serial_no}
            </span>
          )}
        </div>
        <div className="mt-0.5">
          {plan ? (
            <span className="text-xs text-gray-500">{plan}</span>
          ) : (
            <span className="text-xs text-gray-400 italic">No active plan</span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-bold text-gray-700 tabular-nums whitespace-nowrap">
          {rightText}
        </span>
      </div>
    </div>
  );
}

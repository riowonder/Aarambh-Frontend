export function computeDaysLeft(startDateStr, endDateStr) {
  // If neither date is provided, return null to indicate unknown
  if (!startDateStr && !endDateStr) return null;
  const now = new Date();

  // Prefer endDate if available; if only startDate is available, compute from now to startDate (negative means not started)
  const endDate = endDateStr ? new Date(endDateStr) : null;
  const startDate = startDateStr ? new Date(startDateStr) : null;

  // If endDate provided, compute days between now and endDate
  if (endDate) {
    // floor difference in full days
    const diffMs = endDate.setHours(0,0,0,0) - now.setHours(0,0,0,0);
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  // If only startDate provided, compute days from now to startDate (negative means starts in future)
  if (startDate) {
    const diffMs = startDate.setHours(0,0,0,0) - now.setHours(0,0,0,0);
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days; // may be negative if in past
  }

  return null;
}

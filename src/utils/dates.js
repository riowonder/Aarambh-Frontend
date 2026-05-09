export function computeDaysLeft(startDateStr, endDateStr) {
  // If neither date is provided, return null to indicate unknown
  if (!startDateStr && !endDateStr) return null;
  const now = new Date();

  // Prefer endDate if available; if only startDate is available, compute from now to startDate (negative means not started)
  const endDate = endDateStr ? new Date(endDateStr) : null;
  const startDate = startDateStr ? new Date(startDateStr) : null;

  // If endDate provided, compute days between now and endDate
  if (endDate) {
    // If we have a startDate, prefer measuring remaining days from the later of (now or startDate).
    // This lets callers compute the full plan length when the start is in the future,
    // while still returning remaining days after the plan has started.
    const dayMs = 1000 * 60 * 60 * 24;
    const endMid = new Date(endDate);
    const nowMid = new Date(now);
    endMid.setHours(0,0,0,0);
    nowMid.setHours(0,0,0,0);

    if (startDate) {
      const startMid = new Date(startDate);
      startMid.setHours(0,0,0,0);
      // If start is in future, return total days between end and start (full duration)
      if (nowMid < startMid) {
        // inclusive: count both start and end days
        const totalDays = Math.ceil((endMid - startMid) / dayMs) + 1;
        return Math.max(0, totalDays);
      }
      // Otherwise compute days left from now to end
      const diffMs = endMid - nowMid;
      const days = Math.ceil(diffMs / dayMs) + 1; // inclusive of today
      return Math.max(0, days);
    }

    // No startDate: compute days between now and endDate
  const diffMs = endMid - nowMid;
  const days = Math.ceil(diffMs / dayMs) + 1; // inclusive of today
  return Math.max(0, days);
  }

  // If only startDate provided, compute days from now to startDate (negative means starts in future)
  if (startDate) {
  const startMid = new Date(startDate);
  const nowMid = new Date(now);
  startMid.setHours(0,0,0,0);
  nowMid.setHours(0,0,0,0);
  const dayMs = 1000 * 60 * 60 * 24;
  const diffMs = startMid - nowMid;
  const days = Math.ceil(diffMs / dayMs);
  return days; // may be negative if in past
  }

  return null;
}

export function isYetToStart(startDateStr) {
  if (!startDateStr) return false;
  const nowMid = new Date();
  const startMid = new Date(startDateStr);
  nowMid.setHours(0,0,0,0);
  startMid.setHours(0,0,0,0);
  return nowMid < startMid;
}

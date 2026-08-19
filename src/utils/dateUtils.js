/**
 * Format a date string into readable format (e.g. 10 Aug 2026)
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Calculate remaining days until target date
 */
export function getDaysRemaining(targetDateString) {
  if (!targetDateString) return 0;
  const target = new Date(targetDateString);
  const today = new Date();
  // Strip time portion
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate Insurance status based on expiry date
 */
export function getInsuranceStatus(expiryDateString) {
  const days = getDaysRemaining(expiryDateString);
  if (days < 0) return { status: 'Expired', badgeClass: 'bg-red-100 text-red-700 border-red-200', days };
  if (days <= 30) return { status: 'Expiring Soon', badgeClass: 'bg-amber-100 text-amber-700 border-amber-200', days };
  return { status: 'Active', badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200', days };
}

/**
 * Calculate Maintenance status based on due date
 */
export function getMaintenanceStatus(dueDateString, isCompleted = false) {
  if (isCompleted) {
    return { status: 'Completed', badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  }
  const days = getDaysRemaining(dueDateString);
  if (days < 0) return { status: 'Overdue', badgeClass: 'bg-red-100 text-red-700 border-red-200', days };
  if (days <= 7) return { status: 'Due Soon', badgeClass: 'bg-amber-100 text-amber-700 border-amber-200', days };
  return { status: 'Upcoming', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200', days };
}

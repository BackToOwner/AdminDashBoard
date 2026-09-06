/**
 * Formatting helpers used to turn raw API timestamps/numbers into the
 * display strings the existing UI components expect (e.g. ReportModel's
 * `timeAgo` / `date`, StatsModel's `totalRewardsPaid`).
 */

/**
 * SQLite stores timestamps as "YYYY-MM-DD HH:MM:SS" UTC (no timezone suffix).
 * new Date() on that string parses inconsistently across browsers, so we
 * normalize it to ISO-8601 with a trailing "Z" first.
 */
function toDate(value) {
  if (!value) return null;
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatTimeAgo(value) {
  const d = toDate(value);
  if (!d) return 'Just now';

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(days / 365)}y ago`;
}

export function formatDate(value) {
  const d = toDate(value);
  if (!d) return '';
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

export function formatMoney(value) {
  const num = Number(value) || 0;
  return `$${num.toLocaleString()}`;
}

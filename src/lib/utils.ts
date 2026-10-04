// Utility to merge Tailwind classes safely
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  principal: "Principal / HOD",
  teacher: "Teacher",
  student: "Student",
  watchman: "Watchman",
  staff: "Non-Teaching Staff",
};

export const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  principal: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  teacher: "bg-[#e8f0fe] text-[#065fd4] dark:bg-[#e8f0fe]/10 dark:text-[#8ab4f8]",
  student: "bg-[#e6f4ea] text-[#0f7b44] dark:bg-[#e6f4ea]/10 dark:text-[#81c995]",
  watchman: "bg-[#fef7e0] text-[#b06000] dark:bg-[#fef7e0]/10 dark:text-[#fdd663]",
  staff: "bg-[#f2f2f2] text-[#606060] dark:bg-[#272727] dark:text-[#aaaaaa]",
};

export const STATUS_COLORS: Record<string, string> = {
  Pending: "badge-pending",
  Forwarded: "badge-progress",
  Approved: "badge-approved",
  Rejected: "badge-rejected",
  "In Progress": "badge-progress",
  Resolved: "badge-resolved",
};

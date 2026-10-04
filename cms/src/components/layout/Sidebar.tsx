"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/session-context";
import { cn, ROLE_LABELS } from "@/lib/utils";
import { Role } from "@/lib/types";
import {
  LayoutDashboard,
  Users,
  Bell,
  BarChart2,
  ClipboardList,
  CheckSquare,
  ArrowUpCircle,
  DoorOpen,
  UserCheck,
  Search,
  Key,
  AlertTriangle,
  FileText,
  LogOut,
  GraduationCap,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const ROLE_NAV: Record<Role, NavItem[]> = {
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/admin/users", label: "User Management", icon: <Users size={16} /> },
    { href: "/dashboard/admin/notices", label: "Notice Board", icon: <Bell size={16} /> },
    { href: "/dashboard/admin/reports", label: "Reports", icon: <BarChart2 size={16} /> },
    { href: "/dashboard/admin/audit", label: "Audit Trail", icon: <ClipboardList size={16} /> },
  ],
  principal: [
    { href: "/dashboard/principal", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/principal/escalations", label: "Escalations", icon: <AlertTriangle size={16} /> },
    { href: "/dashboard/principal/recheck", label: "Recheck Requests", icon: <CheckSquare size={16} /> },
    { href: "/dashboard/principal/notices", label: "Post Notice", icon: <Bell size={16} /> },
    { href: "/dashboard/principal/analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
  ],
  teacher: [
    { href: "/dashboard/teacher", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/teacher/attendance", label: "Mark Attendance", icon: <CheckSquare size={16} /> },
    { href: "/dashboard/teacher/recheck", label: "Recheck Requests", icon: <AlertTriangle size={16} /> },
    { href: "/dashboard/teacher/escalate", label: "Raise Escalation", icon: <ArrowUpCircle size={16} /> },
    { href: "/dashboard/teacher/notices", label: "Notices", icon: <Bell size={16} /> },
  ],
  student: [
    { href: "/dashboard/student", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/student/attendance", label: "My Attendance", icon: <CheckSquare size={16} /> },
    { href: "/dashboard/student/recheck", label: "Recheck Request", icon: <AlertTriangle size={16} /> },
    { href: "/dashboard/student/notices", label: "Notices", icon: <Bell size={16} /> },
  ],
  watchman: [
    { href: "/dashboard/watchman", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/watchman/gate", label: "Gate Register", icon: <DoorOpen size={16} /> },
    { href: "/dashboard/watchman/visitor", label: "Visitor Register", icon: <UserCheck size={16} /> },
    { href: "/dashboard/watchman/lostfound", label: "Lost & Found", icon: <Search size={16} /> },
    { href: "/dashboard/watchman/keys", label: "Key Register", icon: <Key size={16} /> },
  ],
  staff: [
    { href: "/dashboard/staff", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/staff/report", label: "Report Issue", icon: <AlertTriangle size={16} /> },
    { href: "/dashboard/staff/issues", label: "My Reports", icon: <FileText size={16} /> },
    { href: "/dashboard/staff/notices", label: "Notices", icon: <Bell size={16} /> },
  ],
};

const ROLE_ACCENT: Record<Role, string> = {
  admin:     "bg-violet-600 dark:bg-violet-500",
  principal: "bg-indigo-600 dark:bg-indigo-500",
  teacher:   "bg-[#065fd4] dark:bg-[#3ea6ff]",
  student:   "bg-emerald-600 dark:bg-emerald-500",
  watchman:  "bg-amber-600 dark:bg-amber-500",
  staff:     "bg-slate-600 dark:bg-slate-500",
};

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useSession();
  const pathname = usePathname();
  if (!user) return null;

  const navItems = ROLE_NAV[user.role] || [];
  const accent   = ROLE_ACCENT[user.role];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-30 flex flex-col",
          "bg-white dark:bg-[#0f0f0f] border-r border-slate-200 dark:border-[#272727]",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-[#272727] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#ff0000] flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap size={16} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-[#f1f1f1] leading-tight">College MS</p>
            <p className="text-[11px] text-slate-500 dark:text-[#aaaaaa]">Management System</p>
          </div>
        </div>

        {/* Account card */}
        <div className="px-3 py-3 border-b border-slate-200 dark:border-[#272727]">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[#f2f2f2] dark:bg-[#212121]">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm",
              accent
            )}>
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1] truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-[#aaaaaa] truncate">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-100",
                  isActive
                    ? "bg-[#f2f2f2] text-[#0f0f0f] dark:bg-[#272727] dark:text-[#f1f1f1]"
                    : "text-[#606060] hover:bg-[#f2f2f2] hover:text-[#0f0f0f] dark:text-[#aaaaaa] dark:hover:bg-[#272727] dark:hover:text-[#f1f1f1]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={cn("shrink-0", isActive ? "text-[#0f0f0f] dark:text-[#f1f1f1]" : "text-[#909090] dark:text-[#717171]")}>
                  {item.icon}
                </span>
                <span className="flex-1 text-sm">{item.label}</span>
                {isActive && (
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", accent)} aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-slate-200 dark:border-[#272727]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-[#aaaaaa] hover:bg-[#fce8e6] hover:text-[#c5221f] dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut size={16} className="shrink-0 text-slate-400 dark:text-[#717171]" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

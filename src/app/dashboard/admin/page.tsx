"use client";
import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_USERS, MOCK_NOTICES, MOCK_ESCALATIONS, MOCK_RECHECK_REQUESTS } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { Users, Bell, AlertTriangle, RefreshCw, MoreHorizontal } from "lucide-react";

export default function AdminDashboard() {
  const pendingEscalations = MOCK_ESCALATIONS.filter((e) => e.status === "Pending").length;
  const pendingRecheck = MOCK_RECHECK_REQUESTS.filter((r) => r.status === "Pending").length;

  const stats = [
    { label: "Total Users", value: MOCK_USERS.length, icon: Users, color: "text-[#065fd4] dark:text-[#3ea6ff]", bg: "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10" },
    { label: "Active Notices", value: MOCK_NOTICES.length, icon: Bell, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { label: "Pending Escalations", value: pendingEscalations, icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Recheck Requests", value: pendingRecheck, icon: RefreshCw, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  ];

  const roleDistribution = [
    { role: "Students", count: 3000, percent: 88, color: "bg-sky-500" },
    { role: "Teachers", count: 80, percent: 60, color: "bg-indigo-500" },
    { role: "Non-Teaching Staff", count: 45, percent: 40, color: "bg-slate-500" },
    { role: "Watchmen", count: 10, percent: 30, color: "bg-amber-500" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-hover">
              <CardContent className="pt-5 pb-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-[#f1f1f1]">{stat.value}</p>
                  <p className="text-sm text-slate-500 dark:text-[#aaaaaa] mt-1 font-medium">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Link href="/dashboard/admin/users" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {MOCK_USERS.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 px-6 py-3 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#383838] flex items-center justify-center text-slate-600 dark:text-[#aaaaaa] text-sm font-semibold shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-[#f1f1f1] truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-[#aaaaaa] truncate">{user.email}</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa]">
                      {user.role}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:text-[#717171] dark:hover:text-[#aaaaaa] rounded cursor-pointer">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role distribution */}
          <Card>
            <CardHeader><CardTitle>Institution Overview</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-2">
              {roleDistribution.map((item) => (
                <div key={item.role}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700 dark:text-[#cccccc]">{item.role}</span>
                    <span className="text-slate-500 dark:text-[#aaaaaa] font-medium">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-[#272727] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#272727] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-[#aaaaaa] font-medium mb-1">System Uptime</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-[#f1f1f1]">99.2%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-[#aaaaaa] font-medium mb-1">Avg. Resolution</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-[#f1f1f1]">4.2h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Notices</CardTitle>
              <Link href="/dashboard/admin/notices" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">Manage</Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {MOCK_NOTICES.map((notice) => (
                <div key={notice.id} className="flex items-start gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.isUrgent ? "bg-[#ff0000]" : "bg-slate-300 dark:bg-[#717171]"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-[#f1f1f1]">{notice.title}</p>
                      {notice.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#aaaaaa]">
                      <span>{formatDateTime(notice.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#717171]"></span>
                      <span>By {notice.postedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

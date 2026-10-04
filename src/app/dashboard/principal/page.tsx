"use client";
import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { formatDateTime, STATUS_COLORS } from "@/lib/utils";
import { AlertTriangle, RefreshCw, Wrench, Bell, ArrowUpRight, Check, X } from "lucide-react";

export default function PrincipalDashboard() {
  const { user } = useSession();
  const {
    escalations,
    labIssues,
    recheckRequests,
    notices,
    updateRecheckStatus,
  } = useCMSData();

  const pendingEscalations = escalations.filter((e) => e.status !== "Resolved");
  const pendingRecheck = recheckRequests.filter((r) => r.status === "Forwarded");
  const pendingIssues = labIssues.filter((l) => l.status !== "Resolved");

  return (
    <DashboardLayout title="Principal Dashboard">
      <div className="space-y-6">
        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending Escalations", value: pendingEscalations.length, icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", href: "/dashboard/principal/escalations" },
            { label: "Recheck Awaiting", value: pendingRecheck.length, icon: RefreshCw, color: "text-[#065fd4] dark:text-[#3ea6ff]", bg: "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10", href: "/dashboard/principal/recheck" },
            { label: "Lab Issues Open", value: pendingIssues.length, icon: Wrench, color: "text-[#ff0000] dark:text-[#f28b82]", bg: "bg-red-50 dark:bg-red-950/30", href: "/dashboard/principal/escalations" },
            { label: "Active Circulars", value: notices.length, icon: Bell, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", href: "/dashboard/principal/notices" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="card-hover">
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
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recheck Requests Awaiting HOD Approval */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Disputes Forwarded for Approval</CardTitle>
                </div>
                <Link href="/dashboard/principal/recheck" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                  Manage all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingRecheck.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-[#aaaaaa] px-6 py-8 text-center">No forwarded requests awaiting action.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {pendingRecheck.map((req) => (
                    <div key={req.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{req.studentName}</p>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">{req.subject} &middot; {req.date}</p>
                          <p className="text-sm text-slate-700 dark:text-[#cccccc] mt-2 line-clamp-2">"{req.reason}"</p>
                          {req.teacherComment && (
                            <div className="mt-3 bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 px-3 py-2 rounded text-xs text-[#065fd4] dark:text-[#8ab4f8]">
                              <span className="font-semibold">Faculty:</span> {req.teacherComment}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            className="p-1.5 bg-[#e6f4ea] text-[#0f7b44] hover:bg-emerald-100 dark:bg-[#e6f4ea]/10 dark:text-[#81c995] dark:hover:bg-[#e6f4ea]/20 rounded transition-colors cursor-pointer"
                            onClick={() =>
                              updateRecheckStatus(req.id, "Approved", "Approved by HOD on dashboard.", user?.name || "Dr. Priya Mehta", "principal")
                            }
                            aria-label="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="p-1.5 bg-[#fce8e6] text-[#c5221f] hover:bg-red-100 dark:bg-[#fce8e6]/10 dark:text-[#f28b82] dark:hover:bg-[#fce8e6]/20 rounded transition-colors cursor-pointer"
                            onClick={() =>
                              updateRecheckStatus(req.id, "Rejected", "Rejected by HOD.", user?.name || "Dr. Priya Mehta", "principal")
                            }
                            aria-label="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Escalations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Faculty Escalations</CardTitle>
                </div>
                <Link href="/dashboard/principal/escalations" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                  Review queue
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {pendingEscalations.slice(0, 3).map((esc) => (
                  <div key={esc.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="gap-2 mb-2 flex items-center">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[esc.status]}`}>
                        {esc.status}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-[#aaaaaa] font-medium">{esc.category}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-[#f1f1f1] line-clamp-2">{esc.description}</p>
                    <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-2">By {esc.raisedBy} &middot; {formatDateTime(esc.createdAt)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lab / Facility Issues Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Facility Maintenance</CardTitle>
              </div>
              <Link href="/dashboard/principal/escalations" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                Open Desk
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {labIssues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    issue.status === "Pending" ? "bg-amber-500" :
                    issue.status === "In Progress" ? "bg-[#065fd4] dark:bg-[#3ea6ff]" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="w-32 shrink-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1] truncate">{issue.lab}</p>
                      <p className="text-xs text-slate-500 dark:text-[#aaaaaa] uppercase tracking-wider">{issue.category}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-[#aaaaaa] truncate flex-1">{issue.description}</p>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[issue.status]} shrink-0`}>
                      {issue.status}
                    </span>
                  </div>
                  <Link href="/dashboard/principal/escalations" className="p-1.5 text-slate-400 hover:bg-[#f2f2f2] hover:text-slate-600 dark:text-[#717171] dark:hover:bg-[#272727] dark:hover:text-[#aaaaaa] rounded">
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

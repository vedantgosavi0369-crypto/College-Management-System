"use client";
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ATTENDANCE_SUMMARY } from "@/lib/mock-data";
import { useCMSData } from "@/lib/store";
import { TrendingUp, AlertCircle, Clock, BarChart3 } from "lucide-react";

export default function PrincipalAnalyticsPage() {
  const { escalations, labIssues, recheckRequests } = useCMSData();

  const totalEscalations = escalations.length + labIssues.length;
  const resolvedEscalations =
    escalations.filter((e) => e.status === "Resolved").length +
    labIssues.filter((l) => l.status === "Resolved").length;
  const resolutionRate = totalEscalations > 0 ? ((resolvedEscalations / totalEscalations) * 100).toFixed(0) : "100";

  return (
    <DashboardLayout title="Department Analytics">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#272727] text-[#aaaaaa] uppercase tracking-wider">
                Computer Science & Engineering
              </span>
              <h2 className="text-xl font-bold mt-2">Department Academic & Operational Metrics</h2>
              <p className="text-[#aaaaaa] text-xs mt-1">
                Semester V &middot; Academic Year 2026-27 &middot; Department Scope
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#272727]/80 px-4 py-3 rounded-xl border border-[#383838] text-center">
                <p className="text-2xl font-bold text-[#f1f1f1]">60</p>
                <p className="text-[11px] text-[#aaaaaa] uppercase font-medium mt-0.5">Enrolled</p>
              </div>
              <div className="bg-[#272727]/80 px-4 py-3 rounded-xl border border-[#383838] text-center">
                <p className="text-2xl font-bold text-emerald-400">{resolutionRate}%</p>
                <p className="text-[11px] text-[#aaaaaa] uppercase font-medium mt-0.5">Grievance SLA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#aaaaaa] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg. Attendance</span>
                <TrendingUp size={16} className="text-[#065fd4] dark:text-[#3ea6ff]" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-[#f1f1f1]">76.1%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
                +2.4% vs last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#aaaaaa] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Defaulter Rate</span>
                <AlertCircle size={16} className="text-[#ff0000] dark:text-[#f28b82]" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-[#f1f1f1]">16.7%</p>
              <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-2">10 of 60 students flagged</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#aaaaaa] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Resolution Time</span>
                <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-[#f1f1f1]">18 hrs</p>
              <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-2">Within 48h SLA</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#aaaaaa] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Open Issues</span>
                <BarChart3 size={16} className="text-amber-500 dark:text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-[#f1f1f1]">
                {totalEscalations - resolvedEscalations}
              </p>
              <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-2">Pending maintenance / review</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Breakdown & Defaulter Analysis */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Attendance Performance (13 Courses)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 max-h-[480px] overflow-y-auto pr-2">
              {ATTENDANCE_SUMMARY.map((sub) => {
                const isShort = sub.percentage < 75;
                return (
                  <div key={sub.subject} className="p-2.5 rounded-lg bg-[#f9f9f9]/50 dark:bg-[#181818]/50 border border-slate-100 dark:border-[#272727] space-y-1.5">
                    <div className="flex justify-between items-start text-xs gap-2">
                      <div className="flex items-start gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 mt-0.5 ${
                          sub.type === "TH"
                            ? "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 text-[#065fd4] dark:text-[#8ab4f8]"
                            : sub.type === "PR"
                            ? "bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995]"
                            : "bg-[#fef7e0] dark:bg-[#fef7e0]/10 text-[#b06000] dark:text-[#fdd663]"
                        }`}>
                          {sub.type}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-[#cccccc] leading-tight">{sub.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-400 dark:text-[#717171] text-[11px]">{sub.attended}/{sub.total}</span>
                        <span className={`font-bold ${isShort ? "text-[#c5221f] dark:text-[#f28b82]" : "text-[#0f7b44] dark:text-[#81c995]"}`}>
                          {sub.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#f2f2f2] dark:bg-[#272727] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isShort ? "bg-[#ff0000]" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Grievance & Escalation Resolution Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Escalation Pipeline Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#f9f9f9] dark:bg-[#181818] rounded-xl space-y-3 border border-slate-100 dark:border-[#272727]">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-900 dark:text-[#f1f1f1]">Student Attendance Disputes</span>
                  <span className="text-slate-500 dark:text-[#aaaaaa] font-medium">{recheckRequests.length} Total</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-slate-900 dark:text-[#f1f1f1]">
                      {recheckRequests.filter((r) => r.status === "Pending").length}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">Pending</div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-[#065fd4] dark:text-[#3ea6ff]">
                      {recheckRequests.filter((r) => r.status === "Forwarded").length}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">Forwarded</div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-[#0f7b44] dark:text-[#81c995]">
                      {recheckRequests.filter((r) => r.status === "Approved").length}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">Approved</div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-[#c5221f] dark:text-[#f28b82]">
                      {recheckRequests.filter((r) => r.status === "Rejected").length}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">Rejected</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#f9f9f9] dark:bg-[#181818] rounded-xl space-y-3 border border-slate-100 dark:border-[#272727]">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-900 dark:text-[#f1f1f1]">Faculty Concerns & Facility Issues</span>
                  <span className="text-slate-500 dark:text-[#aaaaaa] font-medium">{totalEscalations} Total</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-slate-900 dark:text-[#f1f1f1]">
                      {escalations.filter((e) => e.status === "Pending").length +
                        labIssues.filter((l) => l.status === "Pending").length}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">New</div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-amber-600 dark:text-amber-400">
                      {escalations.filter((e) => e.status === "In Progress").length +
                        labIssues.filter((l) => l.status === "In Progress").length}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">In Progress</div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] p-2 rounded-lg border border-slate-200 dark:border-[#272727]">
                    <div className="font-bold text-[#0f7b44] dark:text-[#81c995]">
                      {resolvedEscalations}
                    </div>
                    <div className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">Resolved</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

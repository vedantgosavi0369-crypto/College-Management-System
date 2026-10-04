"use client";
import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ATTENDANCE_SUMMARY } from "@/lib/mock-data";
import { STATUS_COLORS } from "@/lib/utils";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { AlertTriangle, CheckCircle2, ChevronRight, FileText, Bell } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useSession();
  const { recheckRequests, notices } = useCMSData();

  const overallAttendance = (
    ATTENDANCE_SUMMARY.reduce((sum, s) => sum + s.attended, 0) /
    ATTENDANCE_SUMMARY.reduce((sum, s) => sum + s.total, 0) * 100
  ).toFixed(1);

  const belowThreshold = ATTENDANCE_SUMMARY.filter((s) => s.percentage < 75);
  const myRecheck = recheckRequests.filter((r) => r.studentId === (user?.id || "u4"));
  const studentNotices = notices.filter((n) => n.targetRoles.includes("student"));

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        {/* Attendance overview hero */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-8 relative overflow-hidden shadow-sm border border-[#272727]">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CheckCircle2 size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-[#aaaaaa] text-xs font-semibold uppercase tracking-wider">Overall Attendance</p>
            <div className="flex items-end gap-5 mt-3 mb-6">
              <p className="text-6xl font-bold tracking-tight text-white dark:text-[#f1f1f1]">{overallAttendance}%</p>
              <div className="mb-2">
                <p className="text-slate-400 dark:text-[#aaaaaa] text-xs">Minimum required: 75%</p>
                {parseFloat(overallAttendance) >= 75 ? (
                  <p className="text-emerald-400 text-xs font-semibold mt-1 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> On track
                  </p>
                ) : (
                  <p className="text-[#ff0000] dark:text-[#f28b82] text-xs font-semibold mt-1 flex items-center gap-1.5">
                    <AlertTriangle size={16} /> Below threshold
                  </p>
                )}
              </div>
            </div>
            {/* Progress bar */}
            <div className="bg-[#272727] dark:bg-[#121212] rounded-full h-3 w-full max-w-lg overflow-hidden border border-[#272727]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  parseFloat(overallAttendance) >= 75 ? "bg-emerald-500" : "bg-[#ff0000]"
                }`}
                style={{ width: `${Math.min(parseFloat(overallAttendance), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {belowThreshold.length > 0 && (
          <div className="bg-[#fce8e6] dark:bg-[#fce8e6]/10 border border-[#fce8e6] dark:border-[#fce8e6]/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-[#c5221f] dark:text-[#f28b82] mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-[#c5221f] dark:text-[#f28b82] text-xs">Low attendance warning</p>
              <p className="text-xs text-[#c5221f] dark:text-[#f28b82] mt-1">
                You are below 75% in: <span className="font-semibold px-1">{belowThreshold.map((s) => s.subject).join(", ")}</span>
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject-wise attendance */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Subject-wise Attendance</CardTitle>
                <Link href="/dashboard/student/attendance" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                  Details
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {ATTENDANCE_SUMMARY.map((sub) => (
                <div key={sub.subject} className="p-3 rounded-xl bg-[#f9f9f9]/50 dark:bg-[#181818]/50 border border-slate-100 dark:border-[#272727]">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 mt-0.5 ${
                        sub.type === "TH"
                          ? "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 text-[#065fd4] dark:text-[#8ab4f8]"
                          : sub.type === "PR"
                          ? "bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995]"
                          : "bg-[#fef7e0] dark:bg-[#fef7e0]/10 text-[#b06000] dark:text-[#fdd663]"
                      }`}>
                        {sub.type}
                      </span>
                      <span className="text-xs font-medium text-slate-900 dark:text-[#f1f1f1] leading-tight">{sub.subject}</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs text-slate-500 dark:text-[#aaaaaa] font-medium">{sub.attended}/{sub.total}</span>
                      <span className={`text-xs font-bold w-12 text-right ${sub.percentage >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-[#ff0000] dark:text-[#f28b82]"}`}>
                        {sub.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#f2f2f2] dark:bg-[#272727] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sub.percentage >= 75 ? "bg-emerald-500" : "bg-[#ff0000]"
                      }`}
                      style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                    />
                  </div>
                  {sub.percentage < 75 && (
                    <p className="text-[11px] text-[#c5221f] dark:text-[#f28b82] mt-1.5 font-medium">
                      Need {Math.ceil((0.75 * sub.total - sub.attended) / (1 - 0.75))} more classes to reach 75%
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recheck requests */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>My Recheck Requests</CardTitle>
                <Link href="/dashboard/student/recheck" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                  Raise new
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {myRecheck.length === 0 ? (
                <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                  <FileText className="text-slate-300 dark:text-[#717171] mb-3" size={32} />
                  <p className="text-sm font-medium text-slate-900 dark:text-[#f1f1f1]">No requests submitted</p>
                  <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1 max-w-xs">If you believe there is an error in your attendance, you can raise a recheck request.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {myRecheck.map((req) => (
                    <div key={req.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[req.status]}`}>
                              {req.status}
                            </span>
                            <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{req.subject}</p>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mb-2">{req.date}</p>

                          {req.hodComment ? (
                            <div className="bg-[#f9f9f9] dark:bg-[#181818] rounded p-2.5 mt-2 border border-slate-100 dark:border-[#272727]">
                              <p className="text-xs text-slate-900 dark:text-[#f1f1f1] font-medium whitespace-pre-wrap"><span className="text-slate-500 dark:text-[#aaaaaa] font-normal">HOD replied:</span> {req.hodComment}</p>
                            </div>
                          ) : req.teacherComment ? (
                            <div className="bg-[#f9f9f9] dark:bg-[#181818] rounded p-2.5 mt-2 border border-slate-100 dark:border-[#272727]">
                              <p className="text-xs text-slate-900 dark:text-[#f1f1f1] font-medium whitespace-pre-wrap"><span className="text-slate-500 dark:text-[#aaaaaa] font-normal">Teacher replied:</span> {req.teacherComment}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-[#272727] bg-[#f9f9f9]/50 dark:bg-[#181818]/50">
                <Link href="/dashboard/student/recheck">
                  <Button size="sm" className="w-full" variant="outline">
                    Raise Recheck Request
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notices</CardTitle>
              <Link href="/dashboard/student/notices" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {studentNotices.slice(0, 4).map((notice) => (
                <Link href="/dashboard/student/notices" key={notice.id} className="group flex gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center shrink-0">
                    <Bell size={18} className="text-slate-500 dark:text-[#aaaaaa]" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{notice.title}</p>
                      {notice.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#aaaaaa] line-clamp-1">{notice.body}</p>
                    <p className="text-[11px] text-slate-400 dark:text-[#717171] mt-1.5 flex items-center gap-2">
                       By {notice.postedBy}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <ChevronRight className="text-slate-300 dark:text-[#717171] group-hover:text-slate-500 dark:group-hover:text-[#aaaaaa]" size={18} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

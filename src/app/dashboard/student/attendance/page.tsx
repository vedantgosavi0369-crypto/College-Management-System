"use client";
import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ATTENDANCE_SUMMARY } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, ArrowUpRight } from "lucide-react";

interface ClassSession {
  id: string;
  date: string;
  subject: string;
  slot: string;
  teacher: string;
  status: "present" | "absent" | "late";
}

const MOCK_STUDENT_SESSIONS: ClassSession[] = [
  { id: "s-1", date: "2026-09-21", subject: "Data Structures and Applications", slot: "09:00 - 10:00 AM", teacher: "Prof. Arun Kumar", status: "present" },
  { id: "s-2", date: "2026-09-21", subject: "Computer Network Technology", slot: "10:15 - 11:15 AM", teacher: "Dr. Priya Mehta", status: "present" },
  { id: "s-3", date: "2026-09-20", subject: "Programming Concepts and Practices", slot: "11:30 - 12:30 PM", teacher: "Prof. Arun Kumar", status: "present" },
  { id: "s-4", date: "2026-09-20", subject: "Data Structures and Applications Laboratory", slot: "01:30 - 03:30 PM", teacher: "Prof. Arun Kumar", status: "absent" },
  { id: "s-5", date: "2026-09-19", subject: "Entrepreneurial Software Development and Management", slot: "09:00 - 10:00 AM", teacher: "Prof. R. Sen", status: "present" },
  { id: "s-6", date: "2026-09-19", subject: "Universal Human Values", slot: "10:15 - 11:15 AM", teacher: "Dr. Priya Mehta", status: "present" },
  { id: "s-7", date: "2026-09-18", subject: "Fundamentals of Financial Management", slot: "11:30 - 12:30 PM", teacher: "Prof. S. Joshi", status: "present" },
  { id: "s-8", date: "2026-09-17", subject: "Foreign Language Studies - German", slot: "01:30 - 02:30 PM", teacher: "Ms. Mueller", status: "present" },
  { id: "s-9", date: "2026-09-16", subject: "Essential Skills Development Lab", slot: "02:30 - 04:30 PM", teacher: "Prof. Arun Kumar", status: "late" },
  { id: "s-10", date: "2026-09-15", subject: "Data Structures and Applications Laboratory", slot: "01:30 - 03:30 PM", teacher: "Prof. Arun Kumar", status: "absent" },
];

export default function StudentAttendancePage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredSessions = MOCK_STUDENT_SESSIONS.filter((item) => {
    if (selectedSubject !== "all" && item.subject !== selectedSubject) return false;
    if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
    return true;
  });

  const totalClasses = ATTENDANCE_SUMMARY.reduce((a, b) => a + b.total, 0);
  const attendedClasses = ATTENDANCE_SUMMARY.reduce((a, b) => a + b.attended, 0);
  const overallPercent = ((attendedClasses / totalClasses) * 100).toFixed(1);
  const defaulters = ATTENDANCE_SUMMARY.filter((s) => s.percentage < 75);

  return (
    <DashboardLayout title="My Attendance Record">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] border border-[#272727]">
            <CardContent className="p-5">
              <p className="text-[#aaaaaa] text-xs font-semibold uppercase tracking-wider">Overall Attendance</p>
              <p className="text-3xl font-bold mt-1 text-white dark:text-[#f1f1f1]">{overallPercent}%</p>
              <p className="text-[#aaaaaa] text-xs mt-2">{attendedClasses} attended of {totalClasses} classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-slate-500 dark:text-[#aaaaaa] text-xs font-semibold uppercase tracking-wider">Safe Subjects (&ge; 75%)</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-[#f1f1f1] mt-1">
                {ATTENDANCE_SUMMARY.filter((s) => s.percentage >= 75).length} / {ATTENDANCE_SUMMARY.length}
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 font-medium">Meeting institutional threshold</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-slate-500 dark:text-[#aaaaaa] text-xs font-semibold uppercase tracking-wider">Defaulter Risk (&lt; 75%)</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-[#f1f1f1] mt-1">
                {defaulters.length}
              </p>
              <p className={`text-xs mt-2 font-medium ${defaulters.length === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-[#ff0000] dark:text-[#f28b82]"}`}>
                {defaulters.length === 0 ? "All 13 subjects in good standing" : defaulters.map((d) => `${d.subject} (${d.percentage.toFixed(0)}%)`).join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subject-Wise Performance Breakdown */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
            <CardTitle className="text-sm font-semibold">Subject-Wise Attendance Metrics (13 Courses)</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ATTENDANCE_SUMMARY.map((sub) => {
                const isShort = sub.percentage < 75;
                const classesNeeded = isShort
                  ? Math.ceil((0.75 * sub.total - sub.attended) / (1 - 0.75))
                  : 0;
                return (
                  <div
                    key={sub.subject}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isShort
                        ? "border-[#fce8e6] dark:border-[#fce8e6]/20 bg-[#fce8e6]/30 dark:bg-[#fce8e6]/5"
                        : "border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 mt-0.5 ${
                            sub.type === "TH"
                              ? "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 text-[#065fd4] dark:text-[#8ab4f8]"
                              : sub.type === "PR"
                              ? "bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995]"
                              : "bg-[#fef7e0] dark:bg-[#fef7e0]/10 text-[#b06000] dark:text-[#fdd663]"
                          }`}>
                            {sub.type}
                          </span>
                          <h4 className="font-semibold text-slate-800 dark:text-[#f1f1f1] text-xs leading-tight">{sub.subject}</h4>
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${isShort ? "text-[#ff0000] dark:text-[#f28b82]" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {sub.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-2 ml-7">{sub.attended} / {sub.total} sessions</p>

                      <div className="w-full bg-[#f2f2f2] dark:bg-[#272727] rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isShort ? "bg-[#ff0000]" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-xs pt-2 border-t border-slate-100 dark:border-[#272727]/60">
                      {isShort ? (
                        <p className="text-[#c5221f] dark:text-[#f28b82] font-medium flex items-center gap-1">
                          <AlertTriangle size={12} className="shrink-0" />
                          <span>Attend next <strong className="underline">{classesNeeded} classes</strong></span>
                        </p>
                      ) : (
                        <p className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                          <CheckCircle2 size={12} className="shrink-0" />
                          <span>Attendance satisfied</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Date-Wise Session Log & Dispute Trigger */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">Session Attendance Log</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Filter by subject or attendance status. Raise a dispute if mistakenly marked absent.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="text-xs rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] max-w-[200px]"
                >
                  <option value="all" className="bg-white dark:bg-[#1e1e1e]">All Subjects</option>
                  {ATTENDANCE_SUMMARY.map((s) => (
                    <option key={s.subject} value={s.subject} className="bg-white dark:bg-[#1e1e1e]">
                      {s.subject}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                >
                  <option value="all" className="bg-white dark:bg-[#1e1e1e]">All Status</option>
                  <option value="present" className="bg-white dark:bg-[#1e1e1e]">Present</option>
                  <option value="absent" className="bg-white dark:bg-[#1e1e1e]">Absent</option>
                  <option value="late" className="bg-white dark:bg-[#1e1e1e]">Late</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#272727] bg-[#f9f9f9] dark:bg-[#181818] text-slate-600 dark:text-[#aaaaaa] font-semibold">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4">Slot</th>
                    <th className="py-2.5 px-4">Faculty</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-[#f1f1f1]">{session.date}</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-[#cccccc] font-semibold">{session.subject}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-[#aaaaaa]">{session.slot}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-[#cccccc]">{session.teacher}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            session.status === "present"
                              ? "bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995]"
                              : session.status === "absent"
                              ? "bg-[#fce8e6] dark:bg-[#fce8e6]/10 text-[#c5221f] dark:text-[#f28b82]"
                              : "bg-[#fef7e0] dark:bg-[#fef7e0]/10 text-[#b06000] dark:text-[#fdd663]"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {session.status === "absent" ? (
                          <Link
                            href={`/dashboard/student/recheck?subject=${encodeURIComponent(session.subject)}&date=${session.date}`}
                          >
                            <Button size="sm" variant="outline" className="text-xs">
                              Dispute <ArrowUpRight size={12} className="ml-0.5" />
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-[#717171]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

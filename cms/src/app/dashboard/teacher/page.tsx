"use client";
import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { STATUS_COLORS } from "@/lib/utils";
import { BookOpen, Users, AlertCircle, RefreshCw, ArrowUpRight, Check, X, Clock } from "lucide-react";

const SUBJECTS = ["CS-301 DBMS", "CS-302 OS", "CS-303 CN"];
const SAMPLE_STUDENTS = [
  { id: "s1", name: "Riya Sharma", rollNo: "CS001" },
  { id: "s2", name: "Aarav Patel", rollNo: "CS002" },
  { id: "s3", name: "Sneha Rao", rollNo: "CS003" },
  { id: "s4", name: "Kiran Das", rollNo: "CS004" },
  { id: "s5", name: "Meera Nair", rollNo: "CS005" },
  { id: "s6", name: "Rahul Gupta", rollNo: "CS006" },
];

export default function TeacherDashboard() {
  const { user } = useSession();
  const { recheckRequests, escalations, notices, updateRecheckStatus, addAudit } = useCMSData();

  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({
    s1: "present",
    s2: "present",
    s3: "absent",
    s4: "present",
    s5: "late",
    s6: "present",
  });
  const [selectedSubject, setSelectedSubject] = useState("CS-301 DBMS");
  const [submitted, setSubmitted] = useState(false);

  const toggleAttendance = (id: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    addAudit(
      user?.name || "Prof. Arun Kumar",
      "teacher",
      "Quick Attendance Saved",
      "Attendance",
      `${selectedSubject}: 5 Present, 1 Absent`
    );
    setTimeout(() => setSubmitted(false), 3000);
  };

  const pendingRecheck = recheckRequests.filter((r) => r.status === "Pending");
  const myEscalations = escalations.filter((e) => e.raisedByRole === "teacher");
  const teacherNotices = notices.filter((n) => n.targetRoles.includes("teacher") || n.postedByRole === "teacher");

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Assigned Classes", value: "3 Batches", icon: BookOpen, color: "text-[#065fd4] dark:text-[#3ea6ff]", bg: "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10", href: "/dashboard/teacher/attendance" },
            { label: "Students Enrolled", value: "60 Total", icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", href: "/dashboard/teacher/attendance" },
            { label: "Pending Disputes", value: pendingRecheck.length, icon: RefreshCw, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", href: "/dashboard/teacher/recheck" },
            { label: "Active Escalations", value: myEscalations.length, icon: AlertCircle, color: "text-[#ff0000] dark:text-[#f28b82]", bg: "bg-red-50 dark:bg-red-950/30", href: "/dashboard/teacher/escalate" },
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
          {/* Quick Attendance Widget */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Take Attendance</CardTitle>
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-[#272727] rounded-lg px-2.5 py-1.5 bg-white dark:bg-[#121212] text-slate-700 dark:text-[#cccccc] font-medium focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                >
                  {SUBJECTS.map((s) => <option key={s} value={s} className="bg-white dark:bg-[#1e1e1e] text-slate-900 dark:text-[#f1f1f1]">{s}</option>)}
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {SAMPLE_STUDENTS.map((student) => {
                  const status = attendance[student.id];
                  return (
                    <div key={student.id} className="flex items-center gap-3 px-6 py-3 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center text-slate-600 dark:text-[#aaaaaa] text-xs font-semibold shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1] truncate">{student.name}</p>
                        <p className="text-xs text-slate-400 dark:text-[#717171] font-mono">{student.rollNo}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleAttendance(student.id, "present")}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            status === "present"
                              ? "bg-emerald-600 text-white"
                              : "bg-[#f2f2f2] dark:bg-[#272727] text-slate-500 dark:text-[#aaaaaa] hover:bg-[#e5e5e5] dark:hover:bg-[#383838]"
                          }`}
                          aria-label="Present"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => toggleAttendance(student.id, "late")}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            status === "late"
                              ? "bg-amber-500 text-white"
                              : "bg-[#f2f2f2] dark:bg-[#272727] text-slate-500 dark:text-[#aaaaaa] hover:bg-[#e5e5e5] dark:hover:bg-[#383838]"
                          }`}
                          aria-label="Late"
                        >
                          <Clock size={14} />
                        </button>
                        <button
                          onClick={() => toggleAttendance(student.id, "absent")}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            status === "absent"
                              ? "bg-[#cc0000] text-white"
                              : "bg-[#f2f2f2] dark:bg-[#272727] text-slate-500 dark:text-[#aaaaaa] hover:bg-[#e5e5e5] dark:hover:bg-[#383838]"
                          }`}
                          aria-label="Absent"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 bg-[#f9f9f9] dark:bg-[#181818] border-t border-slate-100 dark:border-[#272727] flex items-center justify-between">
                <Link href="/dashboard/teacher/attendance" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                  Full 60-Student Roster &rarr;
                </Link>
                <Button onClick={handleSubmit} size="sm" isLoading={submitted}>
                  {submitted ? "Saved" : "Save Attendance"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recheck requests queue */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Recheck Queue</CardTitle>
                </div>
                <Link href="/dashboard/teacher/recheck" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                  Manage queue
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recheckRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">No recheck requests</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {recheckRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[req.status]}`}>
                              {req.status}
                            </span>
                            <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{req.studentName}</p>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mb-2">{req.subject} &middot; {req.date}</p>
                          <p className="text-xs text-slate-600 dark:text-[#cccccc] line-clamp-1">"{req.reason}"</p>
                        </div>
                        {req.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 text-xs"
                            onClick={() => updateRecheckStatus(req.id, "Forwarded", "Forwarded by faculty", user?.name || "Prof. Arun Kumar", "teacher")}
                          >
                            Forward <ArrowUpRight size={14} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 border-t border-slate-100 dark:border-[#272727] bg-[#f9f9f9]/50 dark:bg-[#181818]/50 text-center">
                <Link href="/dashboard/teacher/recheck">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View and Process All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Announcements</CardTitle>
              <Link href="/dashboard/teacher/notices" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                Post announcement
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {teacherNotices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="flex gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.isUrgent ? "bg-[#ff0000]" : "bg-slate-300 dark:bg-[#717171]"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-[#f1f1f1]">{notice.title}</p>
                      {notice.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#aaaaaa] line-clamp-1">{notice.body}</p>
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

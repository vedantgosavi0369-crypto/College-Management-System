"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CLASS_ROSTER_60, useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { ATTENDANCE_SUMMARY } from "@/lib/mock-data";
import { Check, X, Clock, Save, CheckCircle2, Search } from "lucide-react";

type Status = "present" | "absent" | "late";

export default function TeacherAttendancePage() {
  const { user } = useSession();
  const { addAudit } = useCMSData();

  const [selectedSubject, setSelectedSubject] = useState(ATTENDANCE_SUMMARY[0]?.subject || "Data Structures and Applications");
  const [selectedDate, setSelectedDate] = useState("2026-09-21");
  const [selectedSlot, setSelectedSlot] = useState("09:00 - 10:00 AM");
  const [filterMode, setFilterMode] = useState<"all" | "defaulters" | "absent">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editReason, setEditReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize attendance map with present by default for convenience
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Status>>(() => {
    const initial: Record<string, Status> = {};
    CLASS_ROSTER_60.forEach((s) => {
      if (s.currentAttendancePercent < 70) {
        initial[s.rollNo] = "absent";
      } else {
        initial[s.rollNo] = "present";
      }
    });
    return initial;
  });

  const markAll = (status: Status) => {
    const next: Record<string, Status> = {};
    CLASS_ROSTER_60.forEach((s) => {
      next[s.rollNo] = status;
    });
    setAttendanceMap(next);
  };

  const toggleStudent = (rollNo: string, status: Status) => {
    setAttendanceMap((prev) => ({ ...prev, [rollNo]: status }));
  };

  const presentCount = Object.values(attendanceMap).filter((s) => s === "present").length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === "absent").length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === "late").length;
  const totalStudents = CLASS_ROSTER_60.length;
  const presentRate = ((presentCount / totalStudents) * 100).toFixed(1);

  const filteredStudents = CLASS_ROSTER_60.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === "defaulters") return s.currentAttendancePercent < 75;
    if (filterMode === "absent") return attendanceMap[s.rollNo] === "absent";
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actorName = user?.name || "Prof. Arun Kumar";
    addAudit(
      actorName,
      "teacher",
      "Marked Class Attendance",
      "Attendance",
      `${selectedSubject} on ${selectedDate} (${selectedSlot}): ${presentCount} Present, ${absentCount} Absent, ${lateCount} Late.${
        editReason ? ` Edit Reason: ${editReason}` : ""
      }`
    );

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <DashboardLayout title="Mark Class Attendance">
      <div className="space-y-6">
        {/* Class Selection & Quick Controls Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                  Subject & Batch
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                >
                  {ATTENDANCE_SUMMARY.map((s) => (
                    <option key={s.subject} value={s.subject} className="bg-white dark:bg-[#1e1e1e]">
                      [{s.type}] {s.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                  Lecture Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                >
                  <option value="09:00 - 10:00 AM" className="bg-white dark:bg-[#1e1e1e]">09:00 - 10:00 AM (Slot 1)</option>
                  <option value="10:15 - 11:15 AM" className="bg-white dark:bg-[#1e1e1e]">10:15 - 11:15 AM (Slot 2)</option>
                  <option value="11:30 - 12:30 PM" className="bg-white dark:bg-[#1e1e1e]">11:30 - 12:30 PM (Slot 3)</option>
                  <option value="01:30 - 02:30 PM" className="bg-white dark:bg-[#1e1e1e]">01:30 - 02:30 PM (Slot 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                  Correction Reason (if editing past log)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Corrected slip for Aarav"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                />
              </div>
            </div>

            {/* Quick Action Buttons & Stats Counter */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#272727] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => markAll("present")}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check size={14} /> Mark All Present ({totalStudents})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAll("absent")}
                  className="text-xs border-red-200 text-[#ff0000] dark:text-[#f28b82] hover:bg-[#fce8e6] dark:hover:bg-[#fce8e6]/10"
                >
                  <X size={14} /> Mark All Absent
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAll("late")}
                  className="text-xs"
                >
                  <Clock size={14} /> Mark All Late
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f9f9f9] dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-lg text-xs font-semibold text-slate-700 dark:text-[#cccccc]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">P:</span> {presentCount}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f9f9f9] dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-lg text-xs font-semibold text-slate-700 dark:text-[#cccccc]">
                  <span className="text-[#ff0000] dark:text-[#f28b82] font-bold">A:</span> {absentCount}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f9f9f9] dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-lg text-xs font-semibold text-slate-700 dark:text-[#cccccc]">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">L:</span> {lateCount}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0f0f0f] dark:bg-[#f1f1f1] rounded-lg text-xs font-bold text-white dark:text-[#0f0f0f]">
                  <span>{presentRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isSubmitted && (
          <div className="p-4 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-[#0f7b44] dark:text-[#81c995] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Attendance Successfully Saved & Logged!</strong> {presentCount} students marked present out of 60. Immutable audit timestamp recorded.
              </span>
            </div>
          </div>
        )}

        {/* 60 Students Attendance Roster View */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">Class Roster (60 Enrolled Students)</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">
                  Single-view rapid marking. Click status buttons to flip individual attendance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#717171]" />
                  <input
                    type="text"
                    placeholder="Filter by name / roll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] pl-8 pr-3 py-1.5 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                  />
                </div>

                <div className="flex rounded-lg border border-slate-200 dark:border-[#272727] overflow-hidden text-xs">
                  <button
                    onClick={() => setFilterMode("all")}
                    className={`px-3 py-1.5 font-medium transition cursor-pointer ${
                      filterMode === "all" ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]" : "bg-white dark:bg-[#212121] text-slate-600 dark:text-[#aaaaaa] hover:bg-[#f2f2f2] dark:hover:bg-[#272727]"
                    }`}
                  >
                    All (60)
                  </button>
                  <button
                    onClick={() => setFilterMode("defaulters")}
                    className={`px-3 py-1.5 font-medium transition cursor-pointer ${
                      filterMode === "defaulters" ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]" : "bg-white dark:bg-[#212121] text-[#ff0000] dark:text-[#f28b82] hover:bg-[#f2f2f2] dark:hover:bg-[#272727]"
                    }`}
                  >
                    Defaulters (&lt;75%)
                  </button>
                  <button
                    onClick={() => setFilterMode("absent")}
                    className={`px-3 py-1.5 font-medium transition cursor-pointer ${
                      filterMode === "absent" ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]" : "bg-white dark:bg-[#212121] text-slate-600 dark:text-[#aaaaaa] hover:bg-[#f2f2f2] dark:hover:bg-[#272727]"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[#f9f9f9] dark:bg-[#181818] text-slate-600 dark:text-[#aaaaaa] font-semibold border-b border-slate-100 dark:border-[#272727] z-10">
                  <tr>
                    <th className="py-2.5 px-4 w-12">#</th>
                    <th className="py-2.5 px-4 w-28">Roll No</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Cum. Attendance</th>
                    <th className="py-2.5 px-4 text-center">Status Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {filteredStudents.map((s, idx) => {
                    const currentStatus = attendanceMap[s.rollNo] || "present";
                    const isDefaulter = s.currentAttendancePercent < 75;

                    return (
                      <tr
                        key={s.rollNo}
                        className={`hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors ${
                          currentStatus === "absent" ? "bg-red-50/20 dark:bg-red-950/10" : ""
                        }`}
                      >
                        <td className="py-2.5 px-4 text-slate-400 dark:text-[#717171] font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 dark:text-[#cccccc]">
                          {s.rollNo}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-[#f1f1f1]">{s.name}</div>
                          <div className="text-[10px] text-slate-400 dark:text-[#717171]">{s.email}</div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                isDefaulter ? "text-[#ff0000] dark:text-[#f28b82]" : "text-emerald-700 dark:text-emerald-400"
                              }`}
                            >
                              {s.currentAttendancePercent}%
                            </span>
                            {isDefaulter && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#fce8e6] dark:bg-[#fce8e6]/10 text-[#c5221f] dark:text-[#f28b82] font-bold uppercase tracking-wider">
                                Defaulter
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleStudent(s.rollNo, "present")}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                                currentStatus === "present"
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-[#f2f2f2] dark:bg-[#272727] text-slate-500 dark:text-[#aaaaaa] hover:bg-[#e5e5e5] dark:hover:bg-[#383838]"
                              }`}
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStudent(s.rollNo, "absent")}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                                currentStatus === "absent"
                                  ? "bg-[#cc0000] text-white shadow-xs"
                                  : "bg-[#f2f2f2] dark:bg-[#272727] text-slate-500 dark:text-[#aaaaaa] hover:bg-[#e5e5e5] dark:hover:bg-[#383838]"
                              }`}
                            >
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStudent(s.rollNo, "late")}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                                currentStatus === "late"
                                  ? "bg-amber-500 text-white shadow-xs"
                                  : "bg-[#f2f2f2] dark:bg-[#272727] text-slate-500 dark:text-[#aaaaaa] hover:bg-[#e5e5e5] dark:hover:bg-[#383838]"
                              }`}
                            >
                              L
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-[#272727] bg-[#f9f9f9]/75 dark:bg-[#181818]/75 flex justify-between items-center">
              <div className="text-xs text-slate-500 dark:text-[#aaaaaa]">
                Showing {filteredStudents.length} of {totalStudents} enrolled students
              </div>
              <Button onClick={handleSubmit} className="py-2 px-5">
                <Save size={14} /> Commit & Save Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { ATTENDANCE_SUMMARY } from "@/lib/mock-data";
import { STATUS_COLORS } from "@/lib/utils";
import { CheckCircle2, Paperclip, Send } from "lucide-react";

function StudentRecheckContent() {
  const searchParams = useSearchParams();
  const { user } = useSession();
  const { recheckRequests, addRecheckRequest } = useCMSData();

  const initialSubject = searchParams.get("subject") || ATTENDANCE_SUMMARY[0]?.subject || "Data Structures and Applications";
  const initialDate = searchParams.get("date") || "2026-09-21";

  const [subject, setSubject] = useState(initialSubject);
  const [date, setDate] = useState(initialDate);
  const [reason, setReason] = useState("");
  const [proofFileName, setProofFileName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    addRecheckRequest({
      studentId: user?.id || "u4",
      studentName: user?.name || "Riya Sharma",
      subject,
      date,
      reason,
      proofUrl: proofFileName || "attached-medical-slip.pdf",
    });

    setReason("");
    setProofFileName("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const myRequests = recheckRequests.filter((r) => r.studentId === (user?.id || "u4"));

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
        <h2 className="text-xl font-bold">Attendance Dispute Pipeline</h2>
        <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
          Under Institutional Guidelines, any attendance marked in error may be disputed within 7 days.
          Your dispute is routed directly to the subject faculty for review and forwarded to the Head of Department (HOD) for official approval.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
              <CardTitle className="text-sm font-semibold">Raise Attendance Recheck</CardTitle>
              <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Provide class details and attach verification proof.</p>
            </CardHeader>
            <CardContent className="pt-5">
              {isSuccess && (
                <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Recheck request submitted! It has entered the faculty review queue.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
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
                    Date of Disputed Session
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                    Reason / Explanation
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Present in class, answered roll call. Notes verified by classmate..."
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                    Attach Proof (Medical / Duty Slip)
                  </label>
                  <div className="border border-dashed border-slate-300 dark:border-[#383838] rounded-lg p-4 text-center hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition cursor-pointer relative bg-[#f9f9f9] dark:bg-[#181818]">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProofFileName(file.name);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center">
                      <Paperclip size={20} className="text-slate-400 dark:text-[#717171] mb-1" />
                      <p className="text-xs font-medium text-slate-700 dark:text-[#cccccc]">
                        {proofFileName ? proofFileName : "Click to attach document or photo"}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-[#717171] mt-0.5">PNG, JPG, or PDF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full py-2.5">
                  <Send size={14} /> Submit Dispute Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Requests List */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">My Raised Dispute Requests</CardTitle>
                <span className="text-xs bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa] px-2.5 py-0.5 rounded-full font-medium">
                  {myRequests.length} Total
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {myRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">
                  No dispute requests raised yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {myRequests.map((req) => (
                    <div key={req.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">{req.subject}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${STATUS_COLORS[req.status]}`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1">
                            Class Date: <span className="font-medium text-slate-700 dark:text-[#cccccc]">{req.date}</span> &middot; Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#f9f9f9] dark:bg-[#181818] rounded-lg p-3 text-xs text-slate-700 dark:text-[#cccccc] border border-slate-100 dark:border-[#272727]">
                        <p className="font-semibold text-slate-500 dark:text-[#aaaaaa] uppercase tracking-wider text-[10px] mb-1">Student Stated Reason</p>
                        <p>{req.reason}</p>
                        {req.proofUrl && (
                          <div className="mt-2 flex items-center gap-1.5 text-[#065fd4] dark:text-[#3ea6ff] font-medium">
                            <Paperclip size={12} className="shrink-0" />
                            <span>Proof Attached: {req.proofUrl}</span>
                          </div>
                        )}
                      </div>

                      {/* Audit / Review timeline */}
                      <div className="space-y-2 text-xs">
                        {req.teacherComment && (
                          <div className="flex items-start gap-2 bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 text-[#065fd4] dark:text-[#8ab4f8] p-2.5 rounded-lg border border-[#e8f0fe] dark:border-[#e8f0fe]/20">
                            <span className="font-semibold shrink-0">Faculty Review:</span>
                            <span>{req.teacherComment}</span>
                          </div>
                        )}
                        {req.hodComment && (
                          <div className="flex items-start gap-2 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995] p-2.5 rounded-lg border border-[#e6f4ea] dark:border-[#e6f4ea]/20">
                            <span className="font-semibold shrink-0">HOD Decision:</span>
                            <span>{req.hodComment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function StudentRecheckPage() {
  return (
    <DashboardLayout title="Attendance Recheck & Disputes">
      <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading recheck form...</div>}>
        <StudentRecheckContent />
      </Suspense>
    </DashboardLayout>
  );
}

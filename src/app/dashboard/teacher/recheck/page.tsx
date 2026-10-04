"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { STATUS_COLORS } from "@/lib/utils";
import { CheckCircle2, Paperclip, ArrowUpRight, X } from "lucide-react";

export default function TeacherRecheckPage() {
  const { user } = useSession();
  const { recheckRequests, updateRecheckStatus } = useCMSData();
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [comments, setComments] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const teacherRequests = recheckRequests;

  const displayedRequests = teacherRequests.filter((r) => {
    if (activeTab === "pending") return r.status === "Pending";
    return true;
  });

  const handleAction = (id: string, newStatus: "Forwarded" | "Approved" | "Rejected") => {
    const comment = comments[id] || (newStatus === "Forwarded" ? "Verified medical proof, forwarding to HOD for approval." : "Resolved by faculty.");
    updateRecheckStatus(id, newStatus, comment, user?.name || "Prof. Arun Kumar", "teacher");
    setSuccessNotice(`Request #${id} successfully marked as ${newStatus}!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <DashboardLayout title="Student Dispute Review">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Attendance Recheck Queue</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Review disputed attendances raised by students. Validate their attached proof notes or medical certificates,
            attach your faculty assessment, and forward to the Head of Department (HOD) for administrative approval.
          </p>
        </div>

        {successNotice && (
          <div className="p-4 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2 text-xs">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "pending"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            Pending Review ({teacherRequests.filter((r) => r.status === "Pending").length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            All Historical Requests ({teacherRequests.length})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {displayedRequests.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-slate-500 dark:text-[#aaaaaa]">
                <p className="text-sm font-semibold">No recheck requests in this category.</p>
                <p className="text-xs text-slate-400 dark:text-[#717171] mt-1">All student attendance queries have been processed.</p>
              </CardContent>
            </Card>
          ) : (
            displayedRequests.map((req) => {
              const isPending = req.status === "Pending";
              return (
                <Card key={req.id}>
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f2f2f2] dark:bg-[#272727] text-slate-700 dark:text-[#cccccc] font-bold flex items-center justify-center text-xs">
                          {req.studentName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">
                            {req.studentName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">
                            Subject: <span className="font-medium text-slate-700 dark:text-[#cccccc]">{req.subject}</span> &middot; Class Date: {req.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[req.status]}`}>
                          {req.status}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">#{req.id}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4">
                    {/* Student Explanation & Proof */}
                    <div className="bg-[#f9f9f9] dark:bg-[#181818] p-4 rounded-lg border border-slate-100 dark:border-[#272727] space-y-2">
                      <p className="text-[11px] text-slate-500 dark:text-[#aaaaaa] font-bold uppercase tracking-wider">
                        Student Grievance & Attached Evidence
                      </p>
                      <p className="text-xs text-slate-800 dark:text-[#cccccc] leading-relaxed">
                        &quot;{req.reason}&quot;
                      </p>
                      {req.proofUrl && (
                        <div className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff]">
                          <Paperclip size={14} className="shrink-0" />
                          <span>Attached File:</span>
                          <span className="underline cursor-pointer bg-white dark:bg-[#212121] border border-slate-200 dark:border-[#272727] px-2 py-0.5 rounded text-[11px]">
                            {req.proofUrl}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timeline Comments */}
                    {req.teacherComment && (
                      <div className="text-xs bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 p-3 rounded-lg border border-[#e8f0fe] dark:border-[#e8f0fe]/20 text-[#065fd4] dark:text-[#8ab4f8]">
                        <strong>Teacher Review Comment:</strong> {req.teacherComment}
                      </div>
                    )}
                    {req.hodComment && (
                      <div className="text-xs bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 p-3 rounded-lg border border-[#e6f4ea] dark:border-[#e6f4ea]/20 text-[#0f7b44] dark:text-[#81c995]">
                        <strong>HOD Final Note:</strong> {req.hodComment}
                      </div>
                    )}

                    {/* Teacher Action Form (Only active if Pending) */}
                    {isPending && (
                      <div className="pt-3 border-t border-slate-100 dark:border-[#272727] space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                            Faculty Recommendation / Comment for HOD
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Verified classroom physical notes. Recommend updating attendance to Present."
                            value={comments[req.id] || ""}
                            onChange={(e) => setComments({ ...comments, [req.id]: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(req.id, "Rejected")}
                            className="text-xs text-[#c5221f] dark:text-[#f28b82] border-red-200 dark:border-red-900/30 hover:bg-[#fce8e6] dark:hover:bg-[#fce8e6]/10"
                          >
                            <X size={14} /> Reject Claim
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction(req.id, "Forwarded")}
                            className="text-xs"
                          >
                            <ArrowUpRight size={14} /> Forward to HOD for Approval
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

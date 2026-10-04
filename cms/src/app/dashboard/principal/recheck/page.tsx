"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { STATUS_COLORS } from "@/lib/utils";
import { CheckCircle2, Paperclip, Check, X } from "lucide-react";

export default function PrincipalRecheckPage() {
  const { user } = useSession();
  const { recheckRequests, updateRecheckStatus } = useCMSData();
  const [hodNotes, setHodNotes] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const forwardedRequests = recheckRequests.filter((r) => r.status === "Forwarded");
  const allRequests = recheckRequests;

  const handleDecision = (id: string, decision: "Approved" | "Rejected") => {
    const comment =
      hodNotes[id] ||
      (decision === "Approved"
        ? "Official HOD approval granted. Attendance updated in central roster."
        : "Rejected after reviewing student attendance records.");

    updateRecheckStatus(
      id,
      decision,
      comment,
      user?.name || "Dr. Priya Mehta (HOD)",
      "principal"
    );

    setToast(`Request #${id} successfully ${decision}!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <DashboardLayout title="Recheck Approval Desk">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Academic Dispute Decisions</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Provide the binding institutional decision on student attendance disputes forwarded by faculty.
          </p>
        </div>

        {toast && (
          <div className="p-4 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2 text-xs shadow-sm">
            <CheckCircle2 size={16} /> <span>{toast}</span>
          </div>
        )}

        {/* Forwarded Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span>Forwarded by Faculty</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#e8f0fe] text-[#065fd4] dark:bg-[#e8f0fe]/10 dark:text-[#8ab4f8]">
                  {forwardedRequests.length}
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {forwardedRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">
                No forwarded disputes currently pending HOD decision.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {forwardedRequests.map((req) => (
                  <div key={req.id} className="p-6 space-y-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">
                            {req.studentName}
                          </h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#e8f0fe] text-[#065fd4] dark:bg-[#e8f0fe]/10 dark:text-[#8ab4f8]">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1">
                          Subject: <span className="font-medium text-slate-700 dark:text-[#cccccc]">{req.subject}</span> &middot; Class Date: {req.date} &middot; Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-400 dark:text-[#717171]">#{req.id}</span>
                    </div>

                    {/* Grievance text & proof */}
                    <div className="bg-[#f9f9f9] dark:bg-[#181818] p-4 rounded-lg border border-slate-100 dark:border-[#272727] space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-[#aaaaaa] uppercase tracking-wider">
                        Student Explanation
                      </p>
                      <p className="text-xs text-slate-800 dark:text-[#cccccc] leading-relaxed">
                        "{req.reason}"
                      </p>
                      {req.proofUrl && (
                        <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-[#065fd4] dark:text-[#3ea6ff]">
                          <Paperclip size={14} />
                          <span>Proof Attached:</span>
                          <span className="underline cursor-pointer bg-white dark:bg-[#212121] border border-slate-200 dark:border-[#272727] px-2 py-0.5 rounded">
                            {req.proofUrl}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Teacher's note */}
                    {req.teacherComment && (
                      <div className="text-xs bg-[#e8f0fe] dark:bg-[#e8f0fe]/10 text-[#065fd4] dark:text-[#8ab4f8] p-3 rounded-lg border border-[#e8f0fe] dark:border-[#e8f0fe]/20 flex items-start gap-2">
                        <span className="font-semibold shrink-0">Faculty Note:</span>
                        <span>{req.teacherComment}</span>
                      </div>
                    )}

                    {/* HOD Decision Action */}
                    <div className="pt-2 border-t border-slate-100 dark:border-[#272727] space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                          HOD Final Order / Note
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Approved. Duty leave attendance confirmed by department coordinator."
                          value={hodNotes[req.id] || ""}
                          onChange={(e) => setHodNotes({ ...hodNotes, [req.id]: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecision(req.id, "Rejected")}
                          className="text-xs text-[#c5221f] dark:text-[#f28b82] border-red-200 dark:border-red-900/30 hover:bg-[#fce8e6] dark:hover:bg-[#fce8e6]/10"
                        >
                          <X size={14} /> Reject Dispute
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDecision(req.id, "Approved")}
                          className="text-xs"
                        >
                          <Check size={14} /> Approve Dispute
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Rechecks (Audit History) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Historical Dispute Ledger</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {allRequests.map((req) => (
                <div key={req.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-[#f1f1f1]">{req.studentName}</span> &middot; {req.subject} ({req.date})
                    {req.hodComment && (
                      <p className="text-slate-500 dark:text-[#aaaaaa] mt-0.5">HOD: {req.hodComment}</p>
                    )}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[req.status]}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

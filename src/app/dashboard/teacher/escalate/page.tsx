"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { EscalationCategory } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/utils";
import { CheckCircle2, Send } from "lucide-react";

export default function TeacherEscalatePage() {
  const { user } = useSession();
  const { escalations, addEscalation } = useCMSData();

  const [category, setCategory] = useState<EscalationCategory>("Resource");
  const [description, setDescription] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addEscalation({
      raisedBy: user?.name || "Prof. Arun Kumar",
      raisedByRole: "teacher",
      category,
      description,
    });

    setDescription("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const myEscalations = escalations.filter((e) => e.raisedByRole === "teacher");

  return (
    <DashboardLayout title="Faculty Escalations">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Academic & Departmental Escalation Portal</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Direct channel to the Head of Department and Principal for unresolved facility needs, student disciplinary cases, or curriculum resources.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Escalation Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Submit New Escalation</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">All submissions are directly routed to the HOD's dashboard.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {isSuccess && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Escalation logged and notified to Principal & HOD!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Concern Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EscalationCategory)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    >
                      <option value="Resource" className="bg-white dark:bg-[#1e1e1e]">Lab / Classroom Resource (Projector, AC, Whiteboard)</option>
                      <option value="Disciplinary" className="bg-white dark:bg-[#1e1e1e]">Student Disciplinary Concern</option>
                      <option value="Equipment" className="bg-white dark:bg-[#1e1e1e]">Laboratory Hardware / System Fault</option>
                      <option value="Network" className="bg-white dark:bg-[#1e1e1e]">Internet / Wi-Fi Outage</option>
                      <option value="Other" className="bg-white dark:bg-[#1e1e1e]">Other Institutional Matter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Detailed Issue Description & Urgency
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Specify room/lab number, impact on teaching schedule, and past follow-ups..."
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <Button type="submit" className="w-full py-2.5">
                    <Send size={14} /> Escalate to Principal / HOD
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">My Escalation History</CardTitle>
                  <span className="text-xs bg-[#f2f2f2] dark:bg-[#272727] px-2.5 py-0.5 rounded-full text-slate-600 dark:text-[#aaaaaa] font-medium">
                    {myEscalations.length} Active
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {myEscalations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">
                    No escalations raised currently.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                    {myEscalations.map((esc) => (
                      <div key={esc.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] text-slate-700 dark:text-[#cccccc] uppercase tracking-wider">
                              {esc.category}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${STATUS_COLORS[esc.status]}`}>
                              {esc.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">#{esc.id}</span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-[#cccccc] leading-relaxed bg-[#f9f9f9] dark:bg-[#181818] p-3 rounded-lg border border-slate-100 dark:border-[#272727]">
                          {esc.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#717171]">
                          <span>Raised by {esc.raisedBy}</span>
                          <span>{new Date(esc.createdAt).toLocaleDateString()}</span>
                        </div>

                        {esc.resolutionNotes && (
                          <div className="p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995]">
                            <strong>HOD Resolution Note:</strong> {esc.resolutionNotes} (Resolved by {esc.resolvedBy})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

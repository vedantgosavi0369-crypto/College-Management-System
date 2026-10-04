"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { STATUS_COLORS } from "@/lib/utils";
import { CheckCircle2, GraduationCap, Wrench, Check, Clock, AlertCircle } from "lucide-react";

export default function PrincipalEscalationsPage() {
  const { user } = useSession();
  const {
    escalations,
    labIssues,
    resolveEscalation,
    updateLabIssueStatus,
  } = useCMSData();

  const [activeTab, setActiveTab] = useState<"all" | "faculty" | "facility">("all");
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResolveEscalation = (id: string, status: "In Progress" | "Resolved") => {
    const notes = resolutionNotes[id] || (status === "Resolved" ? "Inspected and resolved by HOD." : "Under active review with administration.");
    resolveEscalation(id, status, notes, user?.name || "Dr. Priya Mehta (HOD)");
    setToastMessage(`Escalation #${id} updated to ${status}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResolveLabIssue = (id: string, status: "In Progress" | "Resolved") => {
    const notes = resolutionNotes[id] || (status === "Resolved" ? "Maintenance team dispatched and task completed." : "Work order issued to facility manager.");
    updateLabIssueStatus(id, status, notes, user?.name || "Dr. Priya Mehta (HOD)");
    setToastMessage(`Lab Issue #${id} updated to ${status}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingFacultyCount = escalations.filter((e) => e.status !== "Resolved").length;
  const pendingLabCount = labIssues.filter((l) => l.status !== "Resolved").length;

  return (
    <DashboardLayout title="Grievance Resolution">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Review Desk</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Single unified pipeline routing faculty concerns and non-teaching staff facility/lab reports. Review details, update status, and log administrative resolution notes.
          </p>
        </div>

        {toastMessage && (
          <div className="p-4 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2 text-xs shadow-sm">
            <CheckCircle2 size={16} /> <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            All ({escalations.length + labIssues.length})
          </button>
          <button
            onClick={() => setActiveTab("faculty")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "faculty"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            Faculty Concerns ({pendingFacultyCount} pending)
          </button>
          <button
            onClick={() => setActiveTab("facility")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "facility"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            Facility Reports ({pendingLabCount} pending)
          </button>
        </div>

        <div className="grid gap-6">
          {/* Section 1: Faculty Escalations */}
          {(activeTab === "all" || activeTab === "faculty") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap size={16} className="text-slate-500 dark:text-[#aaaaaa]" />
                  <span>Faculty Concerns & Resource Requests</span>
                  <span className="text-xs text-slate-500 dark:text-[#aaaaaa] font-normal ml-auto">{escalations.length} total</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {escalations.map((esc) => (
                    <div key={esc.id} className="p-5 space-y-3 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">
                              {esc.raisedBy}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] text-slate-700 dark:text-[#cccccc]">
                              {esc.category}
                            </span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[esc.status]}`}>
                              {esc.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1">
                            Logged on {new Date(esc.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 dark:text-[#717171]">#{esc.id}</span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-[#cccccc] bg-[#f9f9f9] dark:bg-[#181818] p-3 rounded-lg border border-slate-100 dark:border-[#272727]">
                        {esc.description}
                      </p>

                      {esc.resolutionNotes && (
                        <div className="text-xs bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995] p-2.5 rounded-md border border-[#e6f4ea] dark:border-[#e6f4ea]/20">
                          <strong>Resolution Log:</strong> {esc.resolutionNotes} (by {esc.resolvedBy})
                        </div>
                      )}

                      {esc.status !== "Resolved" && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Add action note..."
                            value={resolutionNotes[esc.id] || ""}
                            onChange={(e) => setResolutionNotes({ ...resolutionNotes, [esc.id]: e.target.value })}
                            className="flex-1 rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                          />
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveEscalation(esc.id, "In Progress")}
                              className="text-xs"
                            >
                              In Progress
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleResolveEscalation(esc.id, "Resolved")}
                              className="text-xs"
                            >
                              Mark Resolved
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 2: Non-Teaching Staff Facility Reports */}
          {(activeTab === "all" || activeTab === "facility") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Wrench size={16} className="text-slate-500 dark:text-[#aaaaaa]" />
                  <span>Facility & Maintenance Reports</span>
                  <span className="text-xs text-slate-500 dark:text-[#aaaaaa] font-normal ml-auto">{labIssues.length} total</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {labIssues.map((issue) => (
                    <div key={issue.id} className="p-5 space-y-3 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">
                              {issue.lab}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] text-slate-700 dark:text-[#cccccc]">
                              {issue.category}
                            </span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[issue.status]}`}>
                              {issue.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1">
                            Reported by: <span className="font-medium text-slate-700 dark:text-[#cccccc]">{issue.reportedBy}</span> &middot; {new Date(issue.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 dark:text-[#717171]">#{issue.id}</span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-[#cccccc] bg-[#f9f9f9] dark:bg-[#181818] p-3 rounded-lg border border-slate-100 dark:border-[#272727]">
                        {issue.description}
                      </p>

                      {issue.resolutionNotes && (
                        <div className="text-xs bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995] p-2.5 rounded-md border border-[#e6f4ea] dark:border-[#e6f4ea]/20">
                          <strong>Resolution Log:</strong> {issue.resolutionNotes}
                        </div>
                      )}

                      {issue.status !== "Resolved" && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Add action note..."
                            value={resolutionNotes[issue.id] || ""}
                            onChange={(e) => setResolutionNotes({ ...resolutionNotes, [issue.id]: e.target.value })}
                            className="flex-1 rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                          />
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveLabIssue(issue.id, "In Progress")}
                              className="text-xs"
                            >
                              In Progress
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleResolveLabIssue(issue.id, "Resolved")}
                              className="text-xs"
                            >
                              Mark Resolved
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

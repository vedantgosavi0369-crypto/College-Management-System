"use client";
import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { STATUS_COLORS } from "@/lib/utils";
import { Plus, Camera } from "lucide-react";

export default function StaffIssuesPage() {
  const { labIssues } = useCMSData();
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");

  const myIssues = labIssues;

  const filtered = myIssues.filter((i) => {
    if (filter === "pending") return i.status !== "Resolved";
    if (filter === "resolved") return i.status === "Resolved";
    return true;
  });

  return (
    <DashboardLayout title="My Facility Maintenance Reports">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Assigned Lab Maintenance Tickets</h2>
              <p className="text-[#aaaaaa] text-xs mt-1">
                Real-time tracking of repair status, electrician visits, and HOD approvals for your assigned labs.
              </p>
            </div>
            <Link href="/dashboard/staff/report">
              <Button size="sm" className="text-xs">
                <Plus size={14} /> Report New Problem
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === "all"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f] shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            All Tickets ({myIssues.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === "pending"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f] shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            In Progress / Pending ({myIssues.filter((i) => i.status !== "Resolved").length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === "resolved"
                ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f] shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
            }`}
          >
            Resolved ({myIssues.filter((i) => i.status === "Resolved").length})
          </button>
        </div>

        {/* Tickets Grid */}
        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">
                No tickets found under this filter.
              </CardContent>
            </Card>
          ) : (
            filtered.map((issue) => (
              <Card key={issue.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">
                        {issue.lab}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] text-slate-700 dark:text-[#cccccc] font-bold uppercase tracking-wider">
                        {issue.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${STATUS_COLORS[issue.status]}`}>
                        {issue.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">Ticket #{issue.id}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-[#cccccc] leading-relaxed bg-[#f9f9f9] dark:bg-[#181818] p-3 rounded-lg border border-slate-100 dark:border-[#272727]">
                    {issue.description}
                  </p>

                  {issue.photoUrl && (
                    <div className="text-xs text-slate-500 dark:text-[#aaaaaa] flex items-center gap-1.5">
                      <Camera size={14} className="text-slate-400 dark:text-[#717171] shrink-0" />
                      <span>Proof Photo attached:</span>
                      <span className="font-mono text-[#065fd4] dark:text-[#3ea6ff] underline cursor-pointer">{issue.photoUrl}</span>
                    </div>
                  )}

                  {issue.resolutionNotes && (
                    <div className="p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995]">
                      <strong>HOD Action / Resolution:</strong> {issue.resolutionNotes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#717171] pt-1 border-t border-slate-100 dark:border-[#272727]">
                    <span>Reported by: <strong className="text-slate-700 dark:text-[#cccccc]">{issue.reportedBy}</strong></span>
                    <span>Logged: {new Date(issue.createdAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

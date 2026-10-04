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
import { EscalationCategory } from "@/lib/types";
import {
  Zap,
  Wrench,
  Laptop,
  Wifi,
  Sparkles,
  ClipboardList,
  Plus,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Electrical: Zap,
  Plumbing: Wrench,
  Equipment: Laptop,
  Network: Wifi,
  Cleanliness: Sparkles,
  Other: ClipboardList,
};

export default function StaffDashboard() {
  const { user } = useSession();
  const { labIssues, notices, addLabIssue } = useCMSData();

  const [showForm, setShowForm] = useState(false);
  const [lab, setLab] = useState("Computer Lab 1");
  const [category, setCategory] = useState<EscalationCategory>("Equipment");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const pending = labIssues.filter((i) => i.status === "Pending").length;
  const inProgress = labIssues.filter((i) => i.status === "In Progress").length;
  const resolved = labIssues.filter((i) => i.status === "Resolved").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addLabIssue({
      reportedBy: user?.name || "Suresh Yadav",
      lab,
      category,
      description,
    });

    setSubmitted(true);
    setShowForm(false);
    setDescription("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const staffNotices = notices.filter((n) => n.targetRoles.includes("staff"));

  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="space-y-6">
        {/* KPI Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "New / Pending", value: pending, color: "text-[#b06000] dark:text-[#fdd663]", bg: "bg-[#fef7e0] dark:bg-[#fef7e0]/10", href: "/dashboard/staff/issues" },
            { label: "In Progress", value: inProgress, color: "text-[#065fd4] dark:text-[#3ea6ff]", bg: "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10", href: "/dashboard/staff/issues" },
            { label: "Resolved", value: resolved, color: "text-[#0f7b44] dark:text-[#81c995]", bg: "bg-[#e6f4ea] dark:bg-[#e6f4ea]/10", href: "/dashboard/staff/issues" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="card-hover">
                <CardContent className="pt-5 pb-5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-[#aaaaaa] uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {submitted && (
          <div className="bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <p className="text-xs text-[#0f7b44] dark:text-[#81c995] font-semibold">
              Issue reported successfully! Ticket added to the resolution queue.
            </p>
          </div>
        )}

        {/* Quick Report Trigger / Form */}
        <Card>
          <CardHeader className="border-b border-slate-100 dark:border-[#272727]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Report Maintenance Issue</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Quick ticketing for lab and facility maintenance</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setShowForm(!showForm)} className="text-xs">
                  {showForm ? "Cancel" : <><Plus size={14} /> Quick Report</>}
                </Button>
                <Link href="/dashboard/staff/report">
                  <Button size="sm" variant="outline" className="text-xs">
                    Full Form <ArrowUpRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          {showForm && (
            <CardContent className="pt-0 border-t border-slate-100 dark:border-[#272727]">
              <form onSubmit={handleSubmit} className="p-4 bg-[#f9f9f9] dark:bg-[#181818] rounded-xl border border-slate-200 dark:border-[#272727] space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Lab / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Lab 1"
                      value={lab}
                      onChange={(e) => setLab(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EscalationCategory)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    >
                      <option value="Equipment" className="bg-white dark:bg-[#1e1e1e]">Equipment / Hardware</option>
                      <option value="Electrical" className="bg-white dark:bg-[#1e1e1e]">Electrical / Lighting</option>
                      <option value="Network" className="bg-white dark:bg-[#1e1e1e]">Network / Wi-Fi</option>
                      <option value="Plumbing" className="bg-white dark:bg-[#1e1e1e]">Plumbing / Water</option>
                      <option value="Cleanliness" className="bg-white dark:bg-[#1e1e1e]">Cleanliness</option>
                      <option value="Other" className="bg-white dark:bg-[#1e1e1e]">Other Maintenance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                    Problem Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe problem details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="text-xs">
                    Submit Report
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Issue Log List */}
        <Card>
          <CardHeader className="border-b border-slate-100 dark:border-[#272727]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">My Reported Issues</CardTitle>
              <Link href="/dashboard/staff/issues" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                View all ({labIssues.length})
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {labIssues.slice(0, 4).map((issue) => {
                const IconComponent = CATEGORY_ICONS[issue.category] || ClipboardList;
                return (
                  <div key={issue.id} className="px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center text-slate-600 dark:text-[#aaaaaa] shrink-0 mt-0.5">
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{issue.lab}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[issue.status]}`}>
                            {issue.status}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-[#aaaaaa] bg-[#f2f2f2] dark:bg-[#272727] px-2 py-0.5 rounded-full font-medium">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-[#aaaaaa] mt-1">{issue.description}</p>
                        {issue.resolutionNotes && (
                          <div className="mt-2 p-2.5 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] border border-[#e6f4ea] dark:border-[#e6f4ea]/20">
                            <span className="font-semibold">Resolution:</span> {issue.resolutionNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Operational Notices */}
        <Card>
          <CardHeader className="border-b border-slate-100 dark:border-[#272727]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Staff Circulars</CardTitle>
              <Link href="/dashboard/staff/notices" className="text-xs font-semibold text-[#065fd4] dark:text-[#3ea6ff] hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#272727]">
              {staffNotices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="flex gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.isUrgent ? "bg-[#ff0000]" : "bg-slate-300 dark:bg-[#383838]"}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{notice.title}</p>
                      {notice.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#aaaaaa] line-clamp-2">{notice.body}</p>
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

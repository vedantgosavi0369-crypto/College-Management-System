"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { Role } from "@/lib/types";
import { CheckCircle2, Send, AlertTriangle } from "lucide-react";

export default function TeacherNoticesPage() {
  const { user } = useSession();
  const { notices, addNotice } = useCMSData();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetStudent, setTargetStudent] = useState(true);
  const [targetTeacher, setTargetTeacher] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const targets: Role[] = [];
    if (targetStudent) targets.push("student");
    if (targetTeacher) targets.push("teacher");
    if (targets.length === 0) targets.push("student");

    addNotice({
      title,
      body,
      targetRoles: targets,
      postedBy: user?.name || "Prof. Arun Kumar",
      postedByRole: "teacher",
      isUrgent,
    });

    setTitle("");
    setBody("");
    setIsUrgent(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const visibleNotices = notices.filter(
    (n) => n.targetRoles.includes("teacher") || n.postedByRole === "teacher"
  );

  return (
    <DashboardLayout title="Notice Board & Class Circulars">
      <div className="space-y-6">
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Class Circulars & Announcements</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Post announcements, test reschedule alerts, or assignment updates to enrolled students and faculty members.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Post Notice Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Broadcast Notice to Students</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Post announcements, test reschedule alerts, or assignment updates.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {success && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Notice published to student dashboards!</span>
                  </div>
                )}

                <form onSubmit={handlePost} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Circular Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DBMS Lab Practical Submission Extended"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Announcement Content
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter detailed notice message..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa]">
                      Target Audience
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-[#cccccc] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={targetStudent}
                          onChange={(e) => setTargetStudent(e.target.checked)}
                          className="rounded text-[#065fd4] focus:ring-[#065fd4]"
                        />
                        <span>Students</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-[#cccccc] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={targetTeacher}
                          onChange={(e) => setTargetTeacher(e.target.checked)}
                          className="rounded text-[#065fd4] focus:ring-[#065fd4]"
                        />
                        <span>Faculty Members</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-[#f9f9f9] dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-lg">
                    <input
                      type="checkbox"
                      id="urgentCheck"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-[#ff0000] focus:ring-[#ff0000]"
                    />
                    <label htmlFor="urgentCheck" className="text-xs font-semibold text-slate-900 dark:text-[#f1f1f1] cursor-pointer flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-[#ff0000] shrink-0" />
                      <span>Mark as Urgent / Priority Alert</span>
                    </label>
                  </div>

                  <Button type="submit" className="w-full py-2.5">
                    <Send size={14} /> Broadcast Notice
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Active Notices Feed */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Department Notices</CardTitle>
                  <span className="text-xs bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa] px-2.5 py-0.5 rounded-full font-medium">
                    {visibleNotices.length} Active
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {visibleNotices.map((n) => (
                    <div key={n.id} className="p-5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">{n.title}</h4>
                          {n.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                        </div>
                        <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-[#cccccc] leading-relaxed whitespace-pre-line">
                        {n.body}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#717171] pt-1">
                        <span>Posted by: <strong className="text-slate-700 dark:text-[#cccccc]">{n.postedBy}</strong> ({n.postedByRole})</span>
                        <div className="flex gap-1 flex-wrap">
                          {n.targetRoles.map((r) => (
                            <span key={r} className="px-1.5 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] font-medium uppercase text-[9px] text-slate-600 dark:text-[#aaaaaa]">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

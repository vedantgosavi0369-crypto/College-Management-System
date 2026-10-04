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

const ALL_ROLES: { role: Role; label: string }[] = [
  { role: "student", label: "Students" },
  { role: "teacher", label: "Faculty Members" },
  { role: "staff", label: "Staff" },
  { role: "watchman", label: "Security" },
  { role: "admin", label: "Administration" },
];

export default function PrincipalNoticesPage() {
  const { user } = useSession();
  const { notices, addNotice } = useCMSData();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(["student", "teacher", "staff", "watchman"]);
  const [isUrgent, setIsUrgent] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || selectedRoles.length === 0) return;

    addNotice({
      title,
      body,
      targetRoles: selectedRoles,
      postedBy: user?.name || "Dr. Priya Mehta (Principal / HOD)",
      postedByRole: "principal",
      isUrgent,
    });

    setTitle("");
    setBody("");
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 4000);
  };

  return (
    <DashboardLayout title="Circulars & Notices">
      <div className="space-y-6">
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Publish Circular</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Broadcast official administrative decisions, schedules, and alerts across student, faculty, and operational security channels.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Post Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Draft Notice</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Configure target stakeholder roles and priority flag.</p>
              </CardHeader>
              <CardContent>
                {isPublished && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={14} /> <span>Official notice broadcasted across selected dashboards!</span>
                  </div>
                )}

                <form onSubmit={handlePublish} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Schedule of Annual Convocation"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Content
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Enter directive instructions, effective dates, and compliance mandates..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-2">
                      Target Stakeholders
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_ROLES.map(({ role, label }) => {
                        const checked = selectedRoles.includes(role);
                        return (
                          <label
                            key={role}
                            onClick={() => toggleRole(role)}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              checked
                                ? "bg-[#f2f2f2] border-slate-300 text-slate-900 dark:bg-[#272727] dark:border-[#383838] dark:text-[#f1f1f1] font-semibold"
                                : "border-slate-200 text-slate-600 hover:bg-[#f2f2f2] dark:border-[#272727] dark:text-[#aaaaaa] dark:hover:bg-[#272727]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="rounded text-[#065fd4] focus:ring-[#065fd4]"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-[#f9f9f9] dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-lg">
                    <input
                      type="checkbox"
                      id="urgentOrder"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-[#ff0000] focus:ring-[#ff0000]"
                    />
                    <label htmlFor="urgentOrder" className="text-xs font-semibold text-slate-900 dark:text-[#f1f1f1] cursor-pointer flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-[#ff0000]" /> High Priority Notice
                    </label>
                  </div>

                  <Button type="submit" className="w-full">
                    <Send size={14} /> Publish Notice
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Active Notices History */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Published Notices</CardTitle>
                  <span className="text-xs bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa] px-2.5 py-1 rounded-full font-medium">
                    {notices.length} Total
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {notices.map((n) => (
                    <div key={n.id} className="p-5 space-y-2 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">{n.title}</h4>
                          {n.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                        </div>
                        <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-[#aaaaaa] leading-relaxed whitespace-pre-line">
                        {n.body}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#717171] pt-1">
                        <span>Issued by: <strong className="text-slate-700 dark:text-[#cccccc]">{n.postedBy}</strong></span>
                        <div className="flex gap-1 flex-wrap">
                          {n.targetRoles.map((r) => (
                            <span key={r} className="px-1.5 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa] font-medium uppercase text-[9px]">
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

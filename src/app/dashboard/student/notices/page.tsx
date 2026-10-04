"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { Search } from "lucide-react";

export default function StudentNoticesPage() {
  const { notices, markNoticeRead } = useCMSData();
  const { user } = useSession();
  const [filter, setFilter] = useState<"all" | "urgent" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const studentNotices = notices.filter((n) => n.targetRoles.includes("student"));

  const filteredNotices = studentNotices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.body.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "urgent") return n.isUrgent;
    if (filter === "unread") return !(n.readBy || []).includes(user?.id || "");
    return true;
  });

  return (
    <DashboardLayout title="Official Notice Board">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {(["all", "urgent", "unread"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filter === tab
                    ? "bg-[#0f0f0f] text-white dark:bg-[#f1f1f1] dark:text-[#0f0f0f]"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
                }`}
              >
                {tab === "unread" ? "Unread Only" : tab === "urgent" ? "Urgent Priority" : "All Circulars"}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#717171]" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] pl-8 pr-3 py-1.5 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
            />
          </div>
        </div>

        {/* Notices Feed */}
        <div className="space-y-4">
          {filteredNotices.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">
                No circulars match your current filter.
              </CardContent>
            </Card>
          ) : (
            filteredNotices.map((notice) => {
              const isRead = (notice.readBy || []).includes(user?.id || "");
              return (
                <Card
                  key={notice.id}
                  className={`transition-all ${
                    notice.isUrgent ? "border-l-4 border-l-[#ff0000]" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-semibold">{notice.title}</CardTitle>
                          {notice.isUrgent && <Badge variant="urgent">Urgent Circular</Badge>}
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#065fd4] dark:bg-[#3ea6ff] inline-block" title="Unread" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">
                          Issued by: <span className="font-medium text-slate-700 dark:text-[#cccccc]">{notice.postedBy}</span> ({notice.postedByRole}) &middot; {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {!isRead && (
                        <button
                          onClick={() => markNoticeRead(notice.id, user?.id || "u4")}
                          className="text-xs text-[#065fd4] dark:text-[#3ea6ff] hover:underline font-medium cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-700 dark:text-[#cccccc] leading-relaxed whitespace-pre-line">
                      {notice.body}
                    </p>
                    <div className="mt-3 flex gap-1.5 flex-wrap">
                      {notice.targetRoles.map((role) => (
                        <span key={role} className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa]">
                          {role}
                        </span>
                      ))}
                    </div>
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

"use client";
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCMSData } from "@/lib/store";

export default function StaffNoticesPage() {
  const { notices } = useCMSData();
  const staffNotices = notices.filter((n) => n.targetRoles.includes("staff"));

  return (
    <DashboardLayout title="Operational Notices for Staff">
      <div className="space-y-6">
        <div className="space-y-4">
          {staffNotices.map((n) => (
            <Card key={n.id} className={n.isUrgent ? "border-l-4 border-l-[#ff0000]" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{n.title}</CardTitle>
                    {n.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-700 dark:text-[#cccccc] leading-relaxed whitespace-pre-line">
                  {n.body}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-[#717171] mt-2">Issued by: <strong className="text-slate-600 dark:text-[#aaaaaa]">{n.postedBy}</strong></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

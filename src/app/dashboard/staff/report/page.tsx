"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { EscalationCategory } from "@/lib/types";
import {
  Monitor,
  Zap,
  Wifi,
  Wrench,
  Sparkles,
  ClipboardList,
  Camera,
  CheckCircle2,
  Send
} from "lucide-react";

const CATEGORIES: { id: EscalationCategory; label: string; icon: React.ElementType }[] = [
  { id: "Equipment", label: "Equipment", icon: Monitor },
  { id: "Electrical", label: "Electrical", icon: Zap },
  { id: "Network", label: "Network", icon: Wifi },
  { id: "Plumbing", label: "Plumbing", icon: Wrench },
  { id: "Cleanliness", label: "Cleanliness", icon: Sparkles },
  { id: "Other", label: "General", icon: ClipboardList },
];

export default function StaffReportPage() {
  const { user } = useSession();
  const { addLabIssue } = useCMSData();

  const [lab, setLab] = useState("Computer Lab 1");
  const [category, setCategory] = useState<EscalationCategory>("Equipment");
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addLabIssue({
      reportedBy: user?.name || "Suresh Yadav (Lab Assistant)",
      lab,
      category,
      description,
      photoUrl: photoName || "fault-photo.jpg",
    });

    setDescription("");
    setPhotoName("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <DashboardLayout title="Report Maintenance Issue">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Facility Issue Ticket Dispatch</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Quick-entry maintenance ticket form designed with high-visibility buttons for lab technicians and staff. Dispatched directly to Administration.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
              <CardTitle className="text-sm font-semibold">Submit Problem Report</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {isSuccess && (
                <div className="mb-6 p-4 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong>Problem report registered!</strong> Ticket generated and assigned to maintenance desk.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Visual Category Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-3 uppercase tracking-wider">
                    1. Problem Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                          category === cat.id
                            ? "bg-[#0f0f0f] text-white border-[#0f0f0f] dark:bg-[#f1f1f1] dark:text-[#0f0f0f] dark:border-[#f1f1f1] shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#181818] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
                        }`}
                      >
                        <cat.icon size={20} className={category === cat.id ? "text-white dark:text-[#0f0f0f]" : "text-slate-400 dark:text-[#717171]"} />
                        <span className="text-[11px] font-semibold tracking-wide uppercase">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-2 uppercase tracking-wider">
                    2. Location
                  </label>
                  <select
                    value={lab}
                    onChange={(e) => setLab(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                  >
                    <option value="Computer Lab 1" className="bg-white dark:bg-[#1e1e1e]">Computer Lab 1 (Ground Floor)</option>
                    <option value="Computer Lab 2" className="bg-white dark:bg-[#1e1e1e]">Computer Lab 2 (1st Floor)</option>
                    <option value="Physics Lab" className="bg-white dark:bg-[#1e1e1e]">Physics Lab (2nd Floor)</option>
                    <option value="Chemistry Lab" className="bg-white dark:bg-[#1e1e1e]">Chemistry Lab (2nd Floor)</option>
                    <option value="Hardware & IoT Lab" className="bg-white dark:bg-[#1e1e1e]">Hardware & IoT Lab (3rd Floor)</option>
                    <option value="Room 203 (Lecture Hall)" className="bg-white dark:bg-[#1e1e1e]">Room 203 (Lecture Hall)</option>
                    <option value="Main Auditorium" className="bg-white dark:bg-[#1e1e1e]">Main Auditorium</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-2 uppercase tracking-wider">
                    3. Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. 5 system keyboards failing keystrokes; switch board tripping breaker..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                  />
                </div>

                {/* Photo Upload Simulator */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-2 uppercase tracking-wider">
                    4. Optional Damage Photo
                  </label>
                  <div className="border border-dashed border-slate-300 dark:border-[#383838] rounded-xl p-6 text-center hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition cursor-pointer relative bg-[#f9f9f9] dark:bg-[#181818]">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPhotoName(file.name);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center">
                      <Camera size={24} className="text-slate-400 dark:text-[#717171] mb-2" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-[#f1f1f1]">
                        {photoName ? photoName : "Take photo or upload image of defect"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-[#aaaaaa] mt-1">JPEG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full py-2.5">
                    <Send size={16} /> Dispatch Maintenance Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

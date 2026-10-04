"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { Plus, CheckCircle2, Search, LogOut } from "lucide-react";

export default function WatchmanVisitorPage() {
  const { user } = useSession();
  const { visitorEntries, addVisitorEntry, checkoutVisitor } = useCMSData();

  const [visitorName, setVisitorName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [whomToMeet, setWhomToMeet] = useState("");
  const [inTime, setInTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [isUrgent, setIsUrgent] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !whomToMeet.trim()) return;

    addVisitorEntry({
      visitorName,
      purpose: purpose || "Official Meeting",
      whomToMeet,
      inTime,
      loggedBy: user?.name || "Ramesh Gupta",
      isUrgent,
    });

    setVisitorName("");
    setPurpose("");
    setWhomToMeet("");
    setIsUrgent(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCheckout = (id: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    checkoutVisitor(id, nowTime, user?.name || "Ramesh Gupta");
  };

  const filtered = visitorEntries.filter(
    (v) =>
      v.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      v.whomToMeet.toLowerCase().includes(search.toLowerCase()) ||
      v.purpose.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Visitor Register">
      <div className="space-y-6">
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Campus Visitor Pass & Log Desk</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Track external visitors, parents, contractors, and inspectors visiting campus. Mark exit times on departure.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* New Visitor Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Issue Visitor Pass</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Record visitor identity and host official.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {success && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Visitor recorded successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Visitor Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Khanna"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Whom to Meet (Staff / Faculty / Office)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Arun Kumar (HOD Office)"
                      value={whomToMeet}
                      onChange={(e) => setWhomToMeet(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Purpose of Visit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Parent teacher meeting / Vendor delivery / Inspection"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Entry Time
                    </label>
                    <input
                      type="text"
                      value={inTime}
                      onChange={(e) => setInTime(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    />
                  </div>

                  <Button type="submit" className="w-full py-2.5">
                    <Plus size={16} /> Register Visitor
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Visitors Log Table */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm font-semibold">Active Visitors Today</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">Live campus presence tracker</p>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#717171]" />
                    <input
                      type="text"
                      placeholder="Search visitors..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] pl-8 pr-3 py-1.5 text-xs w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#272727] bg-[#f9f9f9] dark:bg-[#181818] text-slate-600 dark:text-[#aaaaaa] font-semibold">
                        <th className="py-2.5 px-4">Visitor</th>
                        <th className="py-2.5 px-4">Purpose</th>
                        <th className="py-2.5 px-4">Meeting With</th>
                        <th className="py-2.5 px-4">In Time</th>
                        <th className="py-2.5 px-4">Out Time</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#272727]">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500 dark:text-[#aaaaaa]">
                            No visitor records found.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((v) => (
                          <tr key={v.id} className="hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-[#f1f1f1]">
                              {v.visitorName}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-[#aaaaaa]">{v.purpose}</td>
                            <td className="py-3 px-4 font-medium text-slate-800 dark:text-[#cccccc]">
                              {v.whomToMeet}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#aaaaaa]">{v.inTime}</td>
                            <td className="py-3 px-4 font-mono">
                              {v.outTime ? (
                                <span className="text-slate-500 dark:text-[#717171]">{v.outTime}</span>
                              ) : (
                                <span className="text-[#b06000] dark:text-[#fdd663] font-semibold">On Campus</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {!v.outTime ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCheckout(v.id)}
                                  className="text-xs"
                                >
                                  <LogOut size={12} className="mr-1" /> Check Out
                                </Button>
                              ) : (
                                <span className="text-[10px] text-[#0f7b44] dark:text-[#81c995] font-medium">Exited</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

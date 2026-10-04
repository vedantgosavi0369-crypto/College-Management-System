"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { KeyRound, CheckCircle2, Check } from "lucide-react";

export default function WatchmanKeysPage() {
  const { user } = useSession();
  const { keyEntries, addKeyEntry, returnKey } = useCMSData();

  const [keyId, setKeyId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [timeOut, setTimeOut] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyId.trim() || !issuedTo.trim()) return;

    addKeyEntry({
      keyId,
      roomName: roomName || keyId,
      issuedTo,
      timeOut,
      loggedBy: user?.name || "Ramesh Gupta",
    });

    setKeyId("");
    setRoomName("");
    setIssuedTo("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleReturn = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    returnKey(id, timeNow, user?.name || "Ramesh Gupta");
  };

  return (
    <DashboardLayout title="Key Management Register">
      <div className="space-y-6">
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Classroom & Laboratory Key Custody</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Audit trail of room keys issued to faculty, lab assistants, and cleaning staff. Ensure all keys are checked back into security custody.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Issue Key Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Issue Room Key</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Record recipient and key tag identifier.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {success && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Key issuance logged!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Key Tag Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LAB-CS-02 / ROOM-305"
                      value={keyId}
                      onChange={(e) => setKeyId(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Room / Lab Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Advanced AI Lab / Seminar Hall B"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Issued To (Staff / Faculty Name)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Yadav (Lab Assistant)"
                      value={issuedTo}
                      onChange={(e) => setIssuedTo(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Time Out
                    </label>
                    <input
                      type="text"
                      value={timeOut}
                      onChange={(e) => setTimeOut(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    />
                  </div>

                  <Button type="submit" className="w-full py-2.5">
                    <KeyRound size={16} /> Issue Key
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Key Log */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Key Status Board</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#272727] bg-[#f9f9f9] dark:bg-[#181818] text-slate-600 dark:text-[#aaaaaa] font-semibold">
                        <th className="py-2.5 px-4">Key ID</th>
                        <th className="py-2.5 px-4">Room</th>
                        <th className="py-2.5 px-4">Issued To</th>
                        <th className="py-2.5 px-4">Out Time</th>
                        <th className="py-2.5 px-4">In Time</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#272727]">
                      {keyEntries.map((k) => (
                        <tr key={k.id} className="hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-[#f1f1f1]">
                            {k.keyId}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-[#cccccc]">{k.roomName}</td>
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-[#f1f1f1]">
                            {k.issuedTo}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#aaaaaa]">{k.timeOut}</td>
                          <td className="py-3 px-4 font-mono">
                            {k.timeIn ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{k.timeIn}</span>
                            ) : (
                              <span className="text-amber-700 dark:text-amber-400 font-semibold">Issued Out</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {!k.timeIn ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReturn(k.id)}
                                className="text-xs text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                              >
                                <Check size={14} /> Return Key
                              </Button>
                            ) : (
                              <span className="text-[10px] text-slate-400 dark:text-[#717171] font-medium">Returned</span>
                            )}
                          </td>
                        </tr>
                      ))}
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

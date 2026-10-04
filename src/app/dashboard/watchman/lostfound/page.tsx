"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { Plus, CheckCircle2, PackageCheck } from "lucide-react";

export default function WatchmanLostFoundPage() {
  const { user } = useSession();
  const { lostFoundEntries, addLostFoundEntry, claimLostFound } = useCMSData();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [foundDate, setFoundDate] = useState(new Date().toISOString().split("T")[0]);
  const [claimantName, setClaimantName] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState<"all" | "unclaimed">("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !description.trim()) return;

    addLostFoundEntry({
      itemName,
      description,
      foundDate,
      isClaimed: false,
      loggedBy: user?.name || "Ramesh Gupta",
    });

    setItemName("");
    setDescription("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleClaim = (id: string) => {
    const name = claimantName[id] || "Student Claimant";
    claimLostFound(id, name, user?.name || "Ramesh Gupta");
  };

  const displayed = lostFoundEntries.filter((item) => {
    if (filter === "unclaimed") return !item.isClaimed;
    return true;
  });

  return (
    <DashboardLayout title="Lost & Found Register">
      <div className="space-y-6">
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <h2 className="text-xl font-bold">Lost & Found Property Register</h2>
          <p className="text-[#aaaaaa] text-xs mt-1 max-w-2xl">
            Log retrieved personal belongings, keys, devices, and books. Record identification details when claimed by rightful owners.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Add Item Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Deposit Found Article</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Log item details and location found.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {success && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Found item recorded!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Article Name / Item
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Black Leather Wallet / Casio Scientific Calculator"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Description & Location Found
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Found on 2nd floor corridor bench near Room 204..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      Date Deposited
                    </label>
                    <input
                      type="date"
                      value={foundDate}
                      onChange={(e) => setFoundDate(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                    />
                  </div>

                  <Button type="submit" className="w-full py-2.5">
                    <Plus size={16} /> Register Found Item
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Items Ledger */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Property Inventory</CardTitle>
                  <div className="flex gap-1 bg-[#f2f2f2] dark:bg-[#272727] p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                        filter === "all"
                          ? "bg-white text-slate-900 dark:bg-[#121212] dark:text-[#f1f1f1] shadow-xs"
                          : "text-slate-600 dark:text-[#aaaaaa] hover:text-slate-900 dark:hover:text-[#f1f1f1]"
                      }`}
                    >
                      All ({lostFoundEntries.length})
                    </button>
                    <button
                      onClick={() => setFilter("unclaimed")}
                      className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                        filter === "unclaimed"
                          ? "bg-white text-slate-900 dark:bg-[#121212] dark:text-[#f1f1f1] shadow-xs"
                          : "text-slate-600 dark:text-[#aaaaaa] hover:text-slate-900 dark:hover:text-[#f1f1f1]"
                      }`}
                    >
                      Unclaimed ({lostFoundEntries.filter((i) => !i.isClaimed).length})
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                  {displayed.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-[#aaaaaa] text-xs">
                      No items found matching the selected filter.
                    </div>
                  ) : (
                    displayed.map((item) => (
                      <div key={item.id} className="p-5 space-y-2 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 dark:text-[#f1f1f1] text-sm">
                              {item.itemName}
                            </h4>
                            {item.isClaimed ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 text-[#0f7b44] dark:text-[#81c995] uppercase">
                                Claimed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef7e0] dark:bg-[#fef7e0]/10 text-[#b06000] dark:text-[#fdd663] uppercase">
                                In Custody
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 dark:text-[#717171] font-mono">Found: {item.foundDate}</span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-[#aaaaaa]">{item.description}</p>

                        {item.isClaimed ? (
                          <div className="text-[11px] text-[#0f7b44] dark:text-[#81c995] font-medium flex items-center gap-1.5 pt-1">
                            <PackageCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Handed over to: <strong>{item.claimedBy}</strong></span>
                          </div>
                        ) : (
                          <div className="pt-2 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter claimant name & ID..."
                              value={claimantName[item.id] || ""}
                              onChange={(e) => setClaimantName({ ...claimantName, [item.id]: e.target.value })}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleClaim(item.id)}
                              className="text-xs"
                            >
                              Mark Claimed
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

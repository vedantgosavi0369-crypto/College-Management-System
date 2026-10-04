"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";

export default function Home() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(`/dashboard/${user.role}`);
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-[#272727] border-t-[#0f0f0f] dark:border-t-[#f1f1f1] rounded-full animate-spin" />
        <p className="text-slate-600 dark:text-[#aaaaaa] font-medium text-sm">Loading CMS...</p>
      </div>
    </div>
  );
}

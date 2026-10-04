"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pending" | "approved" | "rejected" | "progress" | "resolved" | "urgent" | "success";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-[#f2f2f2] text-[#0f0f0f] dark:bg-[#272727] dark:text-[#f1f1f1]",
    pending: "bg-[#fef7e0] text-[#b06000] dark:bg-[#fef7e0]/10 dark:text-[#fdd663]",
    approved: "bg-[#e6f4ea] text-[#0f7b44] dark:bg-[#e6f4ea]/10 dark:text-[#81c995]",
    rejected: "bg-[#fce8e6] text-[#c5221f] dark:bg-[#fce8e6]/10 dark:text-[#f28b82]",
    progress: "bg-[#e8f0fe] text-[#065fd4] dark:bg-[#e8f0fe]/10 dark:text-[#8ab4f8]",
    resolved: "bg-[#f2f2f2] text-[#606060] dark:bg-[#272727] dark:text-[#aaaaaa]",
    urgent: "bg-[#fce8e6] text-[#c5221f] dark:bg-[#fce8e6]/10 dark:text-[#f28b82]",
    success: "bg-[#e6f4ea] text-[#0f7b44] dark:bg-[#e6f4ea]/10 dark:text-[#81c995]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-normal",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

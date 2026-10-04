"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#212121] rounded-xl border border-slate-200 dark:border-[#272727] shadow-sm transition-colors duration-150",
        hover && "card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 py-3.5 border-b border-slate-200 dark:border-[#272727]", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

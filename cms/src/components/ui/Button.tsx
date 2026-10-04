"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary:
      "bg-[#0f0f0f] text-white hover:bg-[#272727] dark:bg-[#f1f1f1] dark:text-[#0f0f0f] dark:hover:bg-[#d9d9d9] shadow-sm",
    secondary:
      "bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5] dark:bg-[#272727] dark:text-[#f1f1f1] dark:hover:bg-[#383838]",
    danger:
      "bg-[#cc0000] text-white hover:bg-[#ff0000] shadow-sm",
    ghost:
      "text-[#606060] hover:bg-[#f2f2f2] hover:text-[#0f0f0f] dark:text-[#aaaaaa] dark:hover:bg-[#272727] dark:hover:text-[#f1f1f1]",
    outline:
      "border border-slate-200 bg-white text-[#0f0f0f] hover:bg-[#f2f2f2] dark:border-[#272727] dark:bg-[#212121] dark:text-[#f1f1f1] dark:hover:bg-[#272727] shadow-sm",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065fd4] dark:focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin" size={14} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

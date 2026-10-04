"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-700 dark:text-[#aaaaaa]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-[#717171]">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            "w-full rounded-lg border border-slate-200 dark:border-[#272727]",
            "bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1]",
            "px-3 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-[#717171]",
            "focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] focus:border-transparent",
            "transition-colors duration-150",
            icon ? "pl-10" : undefined,
            error ? "border-red-500 focus:ring-red-500 dark:border-red-500" : undefined,
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-700 dark:text-[#aaaaaa]">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full rounded-lg border border-slate-200 dark:border-[#272727]",
          "bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1]",
          "px-3 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-[#717171]",
          "focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] focus:border-transparent",
          "transition-colors duration-150 resize-none",
          error ? "border-red-500 focus:ring-red-500 dark:border-red-500" : undefined,
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-700 dark:text-[#aaaaaa]">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full rounded-lg border border-slate-200 dark:border-[#272727]",
          "bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1]",
          "px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] focus:border-transparent",
          "transition-colors duration-150",
          error ? "border-red-500 focus:ring-red-500 dark:border-red-500" : undefined,
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1e1e1e] text-slate-900 dark:text-[#f1f1f1]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

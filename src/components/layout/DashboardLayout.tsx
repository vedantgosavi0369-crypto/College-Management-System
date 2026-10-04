"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f9f9f9] dark:bg-[#0f0f0f] text-[#0f0f0f] dark:text-[#f1f1f1] overflow-hidden transition-colors duration-150">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area — offset by sidebar width on large screens */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in bg-[#f9f9f9] dark:bg-[#0f0f0f]">
          {children}
        </main>
      </div>
    </div>
  );
}

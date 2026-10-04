"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, GraduationCap, AlertTriangle } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@cms.edu", password: "admin123" },
  { role: "Principal/HOD", email: "hod@cms.edu", password: "hod123" },
  { role: "Teacher", email: "teacher@cms.edu", password: "teacher123" },
  { role: "Student", email: "student@cms.edu", password: "student123" },
  { role: "Watchman", email: "watchman@cms.edu", password: "watchman123" },
  { role: "Lab Staff", email: "staff@cms.edu", password: "staff123" },
];

export default function LoginPage() {
  const { login } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      const stored = localStorage.getItem("cms_user");
      if (stored) {
        const user = JSON.parse(stored);
        router.push(`/dashboard/${user.role}`);
      }
    } else {
      setError("Invalid email or password. Try a demo account below.");
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    const success = await login(demoEmail, demoPassword);
    setIsLoading(false);
    if (success) {
      const stored = localStorage.getItem("cms_user");
      if (stored) {
        const user = JSON.parse(stored);
        router.push(`/dashboard/${user.role}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#f1f1f1] transition-colors duration-150">
      {/* Left — Product presentation panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f0f0f] border-r border-[#272727] p-12 flex-col justify-between relative overflow-hidden text-[#f1f1f1]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,0,0,0.1),rgba(0,0,0,0))]"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff0000] rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">College MS</p>
            <p className="text-[#aaaaaa] text-xs">Unified Campus Operations</p>
          </div>
        </div>

        <div className="relative z-10 my-16 max-w-lg">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-5">
            The foundation for modern academic operations.
          </h2>
          <p className="text-[#aaaaaa] text-base mb-8 leading-relaxed">
            Manage attendance, streamline maintenance requests, clear grievances, and automate physical registers — through focused apps for every role.
          </p>

          <ul className="space-y-3.5">
            {[
              "Digital Registers & Audit Trails",
              "SLA-driven Grievance Escalation",
              "Role-based Action Dashboards",
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#f1f1f1]">
                <CheckCircle2 size={18} className="text-[#3ea6ff] shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mockup visual representation */}
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 rotate-12 scale-125 z-0">
          <div className="w-[600px] h-[400px] bg-[#212121] rounded-2xl border border-[#272727] shadow-2xl overflow-hidden p-6 gap-4 flex flex-col">
            <div className="h-8 bg-[#272727] rounded-md w-1/3" />
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-xl bg-[#ff0000]/10 border border-[#ff0000]/20" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-[#272727] rounded w-full" />
                <div className="h-4 bg-[#272727] rounded w-5/6" />
                <div className="h-4 bg-[#272727] rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[#717171] text-xs">
          &copy; {new Date().getFullYear()} College MS Inc.
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:px-12 lg:px-24 bg-white dark:bg-[#0f0f0f] relative z-10">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff0000] rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-slate-900 dark:text-[#f1f1f1] font-bold text-lg">College MS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f1f1f1] tracking-tight">Sign in to workspace</h1>
            <p className="text-slate-500 dark:text-[#aaaaaa] mt-1.5 text-xs">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@cms.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={16} />}
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock size={16} />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2 text-slate-400 hover:text-slate-600 dark:text-[#717171] dark:hover:text-[#aaaaaa] cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="bg-[#fce8e6] dark:bg-[#fce8e6]/10 text-[#c5221f] dark:text-[#f28b82] text-xs px-3.5 py-2.5 rounded-lg border border-[#fce8e6] dark:border-[#fce8e6]/20 flex gap-2 items-center">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="md" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-[#272727]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white dark:bg-[#0f0f0f] text-[11px] text-slate-500 dark:text-[#aaaaaa] uppercase tracking-wider font-semibold">
                  Or use demo accounts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleDemoLogin(acc.email, acc.password)}
                  disabled={isLoading}
                  className="flex flex-col items-start gap-0.5 p-2.5 rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#212121] hover:border-[#065fd4] dark:hover:border-[#3ea6ff] hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors text-left group disabled:opacity-50 cursor-pointer"
                  aria-label={`Log in as ${acc.role}`}
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-[#f1f1f1] group-hover:text-[#065fd4] dark:group-hover:text-[#3ea6ff]">
                    {acc.role}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#aaaaaa] truncate w-full">
                    {acc.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

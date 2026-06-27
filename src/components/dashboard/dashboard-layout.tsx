"use client";

import React from "react";
import {
  Signal,
  Clock,
  Layers
} from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = React.useState<string>("");

  React.useEffect(() => {
    // Keep local clock running in tabular numbers
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#080B11] text-slate-100 selection:bg-indigo-500/30">
      {/* Header Panel */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800/60 bg-slate-950/40 px-6 backdrop-blur-md">
        {/* Logo and Instance Details */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col mr-3">
            <span className="text-sm font-bold text-white tracking-wider uppercase">Vibe Analytics</span>
            <span className="text-[10px] text-indigo-400 font-semibold">SaaS CONTROL ROOM</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 ml-1">
            <span className="text-xs font-semibold text-slate-400">Instance:</span>
            <span className="rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-indigo-400">
              prod-us-east-1
            </span>
          </div>
        </div>

        {/* Platform Status Indicators */}
        <div className="flex items-center gap-6">
          {/* Clock widget */}
          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono text-xs tabular-nums">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <Signal className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline text-xs font-medium text-slate-400">API Status:</span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              OPERATIONAL
            </span>
          </div>
        </div>
      </header>

      {/* Core Panel Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

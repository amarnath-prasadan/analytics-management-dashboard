"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { LiveEvent } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface EventLogProps {
  events: LiveEvent[];
  isLoading: boolean;
}

export function EventLog({ events, isLoading }: EventLogProps) {
  // Helper for choosing colors and icons for event status
  const getStatusConfig = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          dot: "bg-emerald-500"
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
          dot: "bg-amber-500"
        };
      case "error":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          icon: <AlertCircle className="h-4 w-4 text-rose-400" />,
          dot: "bg-rose-500"
        };
    }
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="col-span-full xl:col-span-4 border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-400" />
          Live Platform Activity
        </CardTitle>
        <CardDescription className="text-slate-400">
          Simulated live streams of SaaS user events and server telemetry
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[350px] overflow-y-auto no-scrollbar divide-y divide-slate-800/60">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3 bg-slate-800" />
                    <Skeleton className="h-3 w-1/2 bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <ShieldAlert className="h-8 w-8 text-slate-600 mb-2 animate-bounce" />
              <span className="text-sm">No recent events</span>
            </div>
          ) : (
            events.map((event) => {
              const config = getStatusConfig(event.status);
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-800/20 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    {/* User Avatar Circle */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-300 border border-indigo-500/20 font-mono">
                      {getInitials(event.user)}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-white">
                        {event.user}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        {event.action}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Relative time */}
                    <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                      {event.time}
                    </span>

                    {/* Status indicator */}
                    <div
                      className={cn(
                        "flex items-center justify-center p-1 rounded-full border shrink-0",
                        config.bg
                      )}
                      title={event.status}
                    >
                      {config.icon}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

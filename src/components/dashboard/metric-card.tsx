"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value?: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral" | "inverse"; // "inverse" means negative change is green (e.g. error rate decreasing)
  isLoading?: boolean;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
  subtext?: string;
  live?: boolean;
  children?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  change = 0,
  changeType = "positive",
  isLoading = false,
  icon,
  suffix = "",
  prefix = "",
  subtext,
  live = false,
  children
}: MetricCardProps) {
  // Determine if the change is "good" or "bad"
  let isGood = change >= 0;
  if (changeType === "inverse") {
    isGood = change <= 0;
  }

  const isNeutral = changeType === "neutral" || change === 0;

  // Format value to prevent layout shift with tabular-nums
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card className="relative overflow-hidden border border-slate-800/80 bg-slate-900/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/5">
      {/* Decorative top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <div className="rounded-lg p-2 bg-slate-800/40 text-slate-300 border border-slate-700/30">
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-28 bg-slate-800" />
            <Skeleton className="h-4 w-40 bg-slate-800" />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                {prefix}
                {displayValue}
                {suffix}
              </span>
              {live && (
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              {!isNeutral && (
                <div
                  className={cn(
                    "flex items-center text-xs font-semibold rounded-full px-2 py-0.5 border",
                    isGood
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  )}
                >
                  {change > 0 ? (
                    <ArrowUpRight className="mr-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ArrowDownRight className="mr-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="font-mono tabular-nums">
                    {Math.abs(change)}%
                  </span>
                </div>
              )}
              {subtext && (
                <span className="text-xs text-slate-400">{subtext}</span>
              )}
            </div>
            {children && <div className="mt-4">{children}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { VisitorPoint } from "@/types/analytics";

interface RealTimeChartProps {
  data: VisitorPoint[];
  isLoading: boolean;
}

export function RealTimeChart({ data, isLoading }: RealTimeChartProps) {
  // Calculate some simple metrics based on current window data
  const currentCount = data.length > 0 ? data[data.length - 1].value : 0;
  const averageCount = data.length > 0 
    ? Math.round(data.reduce((sum, p) => sum + p.value, 0) / data.length) 
    : 0;
  const peakCount = data.length > 0 
    ? Math.max(...data.map(p => p.value)) 
    : 0;

  return (
    <Card className="col-span-full border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            Real-Time Visitor Volume
          </CardTitle>
          <CardDescription className="text-slate-400">
            Crawling timeline of simulated user traffic across the past 60 seconds
          </CardDescription>
        </div>
        
        {/* Quick summary stats inside the chart header */}
        <div className="flex gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Active</span>
            <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">{currentCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Avg Volume</span>
            <span className="text-sm font-mono font-bold text-slate-300 tabular-nums">{averageCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Peak Volume</span>
            <span className="text-sm font-mono font-bold text-indigo-400 tabular-nums">{peakCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-[320px] w-full flex-col justify-between pt-2">
            <div className="flex gap-4">
              <Skeleton className="h-[280px] w-full bg-slate-800/60" />
            </div>
          </div>
        ) : (
          <div className="h-[320px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="visitorGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#1e293b" 
                  opacity={0.5} 
                  vertical={false}
                />
                <XAxis
                  dataKey="timestamp"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  tickFormatter={(val) => {
                    // Show only every 3rd label to avoid clustering
                    const parts = val.split(":");
                    return `${parts[0]}:${parts[1]}:${parts[2]}`;
                  }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 50", "dataMax + 50"]}
                  dx={-5}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-slate-800 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-md">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                            Time: {payload[0].payload.timestamp}
                          </p>
                          <p className="mt-1 text-sm font-mono font-bold text-cyan-400">
                            {payload[0].value} visitors
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#visitorGlow)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visitorGlow)"
                  animationDuration={300}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: "#06b6d4",
                    strokeWidth: 2,
                    fill: "#0f172a",
                    className: "animate-pulse"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

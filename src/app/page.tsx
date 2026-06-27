"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MetricCard } from "@/components/dashboard/metric-card";
import dynamic from "next/dynamic";

const RealTimeChart = dynamic(
  () => import("@/components/dashboard/real-time-chart").then((mod) => mod.RealTimeChart),
  { ssr: false }
);
import { EventLog } from "@/components/dashboard/event-log";
import { 
  Users, 
  DollarSign, 
  AlertTriangle,
  ServerCrash
} from "lucide-react";
import { 
  useActiveUsers, 
  useRevenue, 
  useErrorRate, 
  useVisitorVolume, 
  useLiveEvents 
} from "@/hooks/use-analytics";

export default function Home() {
  // Call custom hooks with SWR polling mechanism
  const { data: activeUsersData, isLoading: activeUsersLoading } = useActiveUsers();
  const { data: revenueData, isLoading: revenueLoading } = useRevenue();
  const { data: errorRateData, isLoading: errorRateLoading } = useErrorRate();
  const { data: visitorData, isLoading: visitorLoading } = useVisitorVolume();
  const { data: eventsData, isLoading: eventsLoading } = useLiveEvents();

  // Helper for error status styling
  const getErrorStatusLabel = (status?: string) => {
    switch (status) {
      case "healthy":
        return "All systems running normally";
      case "warning":
        return "API latency warning active";
      case "critical":
        return "Database pool degradation";
      default:
        return "Checking telemetry node";
    }
  };

  return (
    <DashboardLayout>
      {/* Title & Headline Section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/40 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Real-time SaaS Telemetry
        </h1>
        <p className="text-sm text-slate-400">
          Monitor instant platform traffic, error states, and live business actions.
        </p>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1: Active Users (2s refresh) */}
        <MetricCard
          title="Active Session Volume"
          value={activeUsersData?.activeUsers}
          change={activeUsersData?.change}
          isLoading={activeUsersLoading}
          live={true}
          icon={<Users className="h-4 w-4" />}
          subtext="vs last refresh interval (2s)"
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Mean load:</span>
            <span className="font-mono">1,210 users/min</span>
          </div>
        </MetricCard>

        {/* Metric 2: Revenue Today (5s refresh + Goal Progress) */}
        <MetricCard
          title="Gross Daily Revenue"
          value={revenueData?.revenueToday}
          change={revenueData?.change}
          isLoading={revenueLoading}
          prefix="$"
          icon={<DollarSign className="h-4 w-4" />}
          subtext="vs pacing estimate (5s)"
        >
          {/* Revenue target progress bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Daily Goal: $160,000</span>
              <span className="font-mono font-semibold text-slate-300">
                {revenueData ? Math.round((revenueData.revenueToday / revenueData.target) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${revenueData ? Math.min(100, (revenueData.revenueToday / revenueData.target) * 100) : 0}%` }}
              />
            </div>
          </div>
        </MetricCard>

        {/* Metric 3: Error Rate (10s refresh + Service Status) */}
        <MetricCard
          title="System Error Frequency"
          value={errorRateData?.errorRate}
          change={errorRateData?.change}
          changeType="inverse" // Down is good
          isLoading={errorRateLoading}
          suffix="%"
          icon={<ServerCrash className="h-4 w-4" />}
          subtext="delta vs previous minute (10s)"
        >
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className={`h-3.5 w-3.5 ${
              errorRateData?.status === "critical" 
                ? "text-rose-400" 
                : errorRateData?.status === "warning" 
                  ? "text-amber-400" 
                  : "text-emerald-400"
            }`} />
            <span className={
              errorRateData?.status === "critical" 
                ? "text-rose-400 font-semibold" 
                : errorRateData?.status === "warning" 
                  ? "text-amber-400 font-semibold" 
                  : "text-slate-400"
            }>
              {getErrorStatusLabel(errorRateData?.status)}
            </span>
          </div>
        </MetricCard>
      </div>

      {/* Main Charts & Stream Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-12">
        {/* Real-time chart panel (spans 8 columns) */}
        <div className="xl:col-span-8 flex flex-col h-full">
          <RealTimeChart 
            data={visitorData} 
            isLoading={visitorLoading} 
          />
        </div>

        {/* Live event logs panel (spans 4 columns) */}
        <div className="xl:col-span-4 flex flex-col h-full">
          <EventLog 
            events={eventsData || []} 
            isLoading={eventsLoading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

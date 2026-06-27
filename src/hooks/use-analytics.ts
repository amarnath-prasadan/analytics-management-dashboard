"use client";

import { useState } from "react";
import useSWR from "swr";
import { ActiveUsersData, RevenueData, ErrorRateData, VisitorPoint, LiveEvent } from "@/types/analytics";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics from ${url}`);
  }
  return res.json();
};

export function useActiveUsers() {
  const { data, error, isLoading } = useSWR<ActiveUsersData>(
    "/api/analytics?metric=activeUsers",
    fetcher,
    {
      refreshInterval: 2000,
      dedupingInterval: 1000,
      revalidateOnFocus: false
    }
  );

  return { data, error, isLoading };
}

export function useRevenue() {
  const { data, error, isLoading } = useSWR<RevenueData>(
    "/api/analytics?metric=revenue",
    fetcher,
    {
      refreshInterval: 5000,
      dedupingInterval: 2000,
      revalidateOnFocus: false
    }
  );

  return { data, error, isLoading };
}

export function useErrorRate() {
  const { data, error, isLoading } = useSWR<ErrorRateData>(
    "/api/analytics?metric=errorRate",
    fetcher,
    {
      refreshInterval: 10000,
      dedupingInterval: 5000,
      revalidateOnFocus: false
    }
  );

  return { data, error, isLoading };
}

export function useLiveEvents() {
  const { data, error, isLoading } = useSWR<LiveEvent[]>(
    "/api/analytics?metric=events",
    fetcher,
    {
      refreshInterval: 3000,
      dedupingInterval: 1500,
      revalidateOnFocus: false
    }
  );

  return { data, error, isLoading };
}

export function useVisitorVolume() {
  // Fetch initial history once
  const { data: initialHistory, error: historyError } = useSWR<VisitorPoint[]>(
    "/api/analytics?metric=visitorVolume&history=true",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000
    }
  );

  // Poll for the latest single point every 2 seconds
  const { data: latestPoint } = useSWR<VisitorPoint>(
    "/api/analytics?metric=visitorVolume",
    fetcher,
    {
      refreshInterval: 2000,
      dedupingInterval: 1000,
      revalidateOnFocus: false
    }
  );

  const [history, setHistory] = useState<VisitorPoint[]>([]);
  const [prevInitialHistory, setPrevInitialHistory] = useState<VisitorPoint[] | undefined>(undefined);
  const [prevLatestPoint, setPrevLatestPoint] = useState<VisitorPoint | undefined>(undefined);

  // Load initial history when it resolves
  if (initialHistory && initialHistory !== prevInitialHistory) {
    setPrevInitialHistory(initialHistory);
    setHistory(initialHistory);
  }

  // Append the latest point to the crawling timeline state
  if (latestPoint && latestPoint !== prevLatestPoint) {
    setPrevLatestPoint(latestPoint);
    if (history.length > 0) {
      const lastPoint = history[history.length - 1];
      // Skip duplicate timestamps (e.g. SWR hot reload trigger)
      if (!lastPoint || lastPoint.timestamp !== latestPoint.timestamp) {
        setHistory((prev) => [...prev.slice(1), latestPoint]);
      }
    }
  }

  return {
    data: history.length > 0 ? history : initialHistory || [],
    isLoading: !initialHistory && !historyError,
    error: historyError
  };
}

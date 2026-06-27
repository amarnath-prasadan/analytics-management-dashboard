export interface ActiveUsersData {
  activeUsers: number;
  change: number;
  timestamp: string;
}

export interface RevenueData {
  revenueToday: number;
  change: number;
  target: number;
  hourlyBreakdown: number[];
}

export interface ErrorRateData {
  errorRate: number;
  change: number;
  status: "healthy" | "warning" | "critical";
}

export interface VisitorPoint {
  timestamp: string;
  value: number;
}

export interface LiveEvent {
  id: string;
  user: string;
  action: string;
  time: string;
  status: "success" | "warning" | "error";
  timestamp: number;
}

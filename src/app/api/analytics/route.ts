import { NextResponse } from "next/server";
import { ActiveUsersData, RevenueData, ErrorRateData, VisitorPoint, LiveEvent } from "@/types/analytics";

// Helper for deterministic visitor calculation based on time
function getVisitorPoint(time: Date): number {
  const hours = time.getHours() + time.getMinutes() / 60;
  const minutes = time.getMinutes() + time.getSeconds() / 60;
  
  // Sine wave representing daily cycle: peak traffic around 14:00 (2 PM), low at 04:00 (4 AM)
  const dailyCycle = Math.sin((hours - 8) / 24 * Math.PI * 2) * 300;
  const baseUsers = 1200 + dailyCycle;
  
  // Short-term micro-cycles (5-minute waves)
  const microCycle = Math.sin(minutes / 5 * Math.PI * 2) * 40;
  
  // Pseudo-random noise based on seconds for dynamic feel
  const secondsNoise = Math.sin(time.getSeconds()) * 15;
  
  return Math.round(baseUsers + microCycle + secondsNoise);
}

// Lists of mock data for events
const USERS = ["Sophia R.", "Alex M.", "David K.", "Emma W.", "Liam N.", "Olivia P.", "James B.", "Isabella H.", "Lucas V.", "Mia T."];
const ACTIONS = [
  { text: "signed in to dashboard", status: "success" },
  { text: "upgraded to Enterprise Tier", status: "success" },
  { text: "created project 'production-v4'", status: "success" },
  { text: "triggered API rate limit (429)", status: "warning" },
  { text: "database query timeout (504)", status: "error" },
  { text: "completed checkout flow ($249.00)", status: "success" },
  { text: "failed credit card validation", status: "error" },
  { text: "invited teammates to workspace", status: "success" },
  { text: "deployed lambda service 'auth-handler'", status: "success" },
  { text: "reset workspace MFA security keys", status: "warning" }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const metric = searchParams.get("metric") || "activeUsers";
  const history = searchParams.get("history") === "true";
  const now = new Date();

  // 1. Active Users
  if (metric === "activeUsers") {
    const value = getVisitorPoint(now);
    const prev = getVisitorPoint(new Date(now.getTime() - 2000));
    const change = parseFloat((((value - prev) / prev) * 100).toFixed(2));
    
    const payload: ActiveUsersData = {
      activeUsers: value,
      change: isNaN(change) ? 0.25 : change,
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    };
    return NextResponse.json(payload);
  }

  // 2. Revenue Today (grows incrementally through the day)
  if (metric === "revenue") {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const elapsedSeconds = (now.getTime() - startOfDay) / 1000;
    
    // Average $1.85 revenue per second (~$160k per day)
    const baseRevenue = elapsedSeconds * 1.85;
    
    // Add hourly fluctuation (more sales in afternoon/evening)
    const timeFactor = Math.sin((now.getHours() - 6) / 24 * Math.PI * 2) * 5000;
    
    // Add some noise
    const noise = Math.sin(now.getSeconds() * 0.1) * 80;
    
    const revenueToday = Math.max(8500, parseFloat((baseRevenue + timeFactor + noise).toFixed(2)));
    const target = 160000; // Daily Target
    
    // Compare current speed with standard pacing
    const change = parseFloat(((revenueToday / (target * (elapsedSeconds / 86400)) - 1) * 100).toFixed(2));

    // Generate simulated hourly breakdown (24 values) for visual subcharts
    const hourlyBreakdown: number[] = [];
    for (let i = 0; i <= now.getHours(); i++) {
      const hourRevenue = Math.max(200, Math.round(
        (1.85 * 3600) + 
        (Math.sin((i - 6) / 24 * Math.PI * 2) * 300) + 
        (Math.sin(i * 0.7) * 100)
      ));
      hourlyBreakdown.push(hourRevenue);
    }

    const payload: RevenueData = {
      revenueToday,
      change: isNaN(change) ? 1.45 : change,
      target,
      hourlyBreakdown
    };
    return NextResponse.json(payload);
  }

  // 3. Error Rate
  if (metric === "errorRate") {
    const baseError = 0.65;
    const wave = Math.sin(now.getMinutes() / 15 * Math.PI * 2) * 0.2;
    
    // Simulate periodic spike (e.g. cron run or code deploy simulation)
    // Spikes every 8 minutes, lasting for 20 seconds
    const isSpikePeriod = now.getMinutes() % 8 === 0;
    const isSpikeSecond = now.getSeconds() < 20;
    const spike = (isSpikePeriod && isSpikeSecond) ? 1.8 + Math.random() * 0.8 : 0;
    
    const secondsNoise = Math.sin(now.getSeconds() * 0.5) * 0.08;
    const errorRate = parseFloat(Math.max(0.05, baseError + wave + spike + secondsNoise).toFixed(2));
    
    const prevErrorRate = parseFloat(Math.max(0.05, baseError + wave + secondsNoise).toFixed(2));
    const change = parseFloat((errorRate - prevErrorRate).toFixed(2));
    
    const status = errorRate > 2.0 ? "critical" : errorRate > 1.2 ? "warning" : "healthy";
    
    const payload: ErrorRateData = {
      errorRate,
      change,
      status
    };
    return NextResponse.json(payload);
  }

  // 4. Visitor Volume (crawling timeline data)
  if (metric === "visitorVolume") {
    if (history) {
      // Return the last 30 data points (every 2 seconds, back 60 seconds)
      const points: VisitorPoint[] = [];
      for (let i = 29; i >= 0; i--) {
        const timePoint = new Date(now.getTime() - i * 2000);
        points.push({
          timestamp: timePoint.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
          value: getVisitorPoint(timePoint)
        });
      }
      return NextResponse.json(points);
    } else {
      // Return just the latest point
      const payload: VisitorPoint = {
        timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        value: getVisitorPoint(now)
      };
      return NextResponse.json(payload);
    }
  }

  // 5. Live Activity Events Log
  if (metric === "events") {
    // Generate events deterministically based on timestamps to simulate real-time updates
    const events: LiveEvent[] = [];
    const eventCount = 12;
    
    for (let i = 0; i < eventCount; i++) {
      // Calculate historical times (spaced out over the last 5 minutes)
      const eventTime = new Date(now.getTime() - i * 22000 - (Math.sin(i) * 5000));
      const eventTimestamp = eventTime.getTime();
      
      // Select users and actions pseudo-randomly but anchored to the timestamp so they don't jump around on refreshes
      const userIndex = Math.floor((eventTimestamp / 1000) % USERS.length);
      const actionIndex = Math.floor((eventTimestamp / 3000) % ACTIONS.length);
      
      const user = USERS[userIndex];
      const action = ACTIONS[actionIndex];
      
      // Calculate visual relative time display
      const secondsAgo = Math.floor((now.getTime() - eventTime.getTime()) / 1000);
      let timeStr = "just now";
      if (secondsAgo > 0) {
        if (secondsAgo < 60) {
          timeStr = `${secondsAgo}s ago`;
        } else {
          timeStr = `${Math.floor(secondsAgo / 60)}m ago`;
        }
      }
      
      events.push({
        id: `evt-${eventTimestamp}-${i}`,
        user,
        action: action.text,
        time: timeStr,
        status: action.status as "success" | "warning" | "error",
        timestamp: eventTimestamp
      });
    }
    
    return NextResponse.json(events);
  }

  return NextResponse.json({ error: "Invalid metric query param" }, { status: 400 });
}

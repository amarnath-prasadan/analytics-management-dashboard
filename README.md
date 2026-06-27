# 🎯 SaaS Platform Insights — Live Analytics Dashboard

A highly polished, real-time analytics control center simulating active user traffic, business operations, and server telemetry.

🚀 **Live Deployment URL:** [https://analytics-management-dashboard.vercel.app/](https://analytics-management-dashboard.vercel.app/)

---

## ⚡ Core Mechanism: Serverless "Live" Polling

* A Next.js API route (`/api/analytics`) serves as a deterministic mock engine, shifting metrics according to timestamp deltas.
* The client uses **SWR (Stale-While-Revalidate)** with isolated `refreshInterval` settings to pull telemetry:
  - **Active Session Volume:** 2-second interval
  - **Visitor Volume Timeline:** 2-second interval (manages client-side sliding window of 30 items)
  - **Live Platform Activity Logs:** 3-second interval
  - **Gross Daily Revenue:** 5-second interval (increments mathematically representing daily sales progression)
  - **System Error Frequency:** 10-second interval

---

## 🏗️ Technical Highlights & Performance Tuning
* **React 19 Native Compiler:** Zero manual `useMemo` or `useCallback` optimization hooks are used. Performance optimization and component caching are handled natively by the active React Compiler configured in `next.config.ts`.
* **Zero Jitter Tabular Figures:** Numeric components explicitly utilize the `font-mono tabular-nums` utility to ensure uniform character widths, eliminating visual layout jitter/flicker on tick updates.
* **Hydration Mismatch Prevention:** Recharts graph is loaded dynamically (`ssr: false`) to ensure Canvas and SVG bounds calculations occur exclusively inside client viewports.
* **Cascading Render Safety:** SWR data-point mutations for the crawling timeline chart are updated during render rather than inside synchronous `useEffect` calls, satisfying strict React 19 hooks standards.
* **Glassmorphic Premium Aesthetic:** Sleek dark-mode interface designed with translucent backdrops, glowing boundaries, and hover translation animations.

---

## 🛠️ Technology Stack
* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript (Enforced Contracts)
* **Data Fetching:** SWR v2
* **Styling & UI:** Tailwind CSS v4 + shadcn/ui (Radix Primitives)
* **Visualization:** Recharts (monotone area chart with gradients)
* **Telemetry Icons:** Lucide React

---

## 📂 Architecture Directory Blueprint

```text
src/
├── app/
│   ├── api/analytics/route.ts       # Deterministic timestamp-based mock data engine
│   ├── layout.tsx                   # Font configurations and global HTML structure
│   └── page.tsx                     # Dynamic dashboard page assembly
├── components/
│   ├── dashboard/                   # Isolated dashboard feature components
│   │   ├── dashboard-layout.tsx     # Centered, branded main shell container
│   │   ├── metric-card.tsx          # Reusable glassmorphic KPI cards
│   │   ├── real-time-chart.tsx      # Scrolling Recharts visitor AreaChart
│   │   └── event-log.tsx            # Streaming activity log log stream
│   └── ui/                          # Radix primitives styled via shadcn/ui
├── hooks/
│   ├── use-analytics.ts             # Modular SWR hooks for fetching and sliding arrays
│   └── use-mobile.ts                # Sidebar responsive state watcher
└── types/
    └── analytics.ts                 # Enforced TypeScript data contracts
```

---

## 💻 Local Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Access the telemetry panel at **http://localhost:3000**
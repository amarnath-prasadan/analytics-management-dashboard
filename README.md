## 📂 Architecture Directory Blueprint

```text
src/
├── app/
│   ├── api/analytics/route.ts  # Mocking engine for high-frequency live data
│   └── dashboard/page.tsx      # Core Dashboard Layout Container
├── components/
│   ├── dashboard/              # Isolated, feature-specific data blocks
│   │   ├── metric-card.tsx
│   │   ├── live-chart.tsx
│   │   └── activity-log.tsx
│   └── ui/                     # Accessible UI components (shadcn/ui)
├── hooks/
│   └── use-analytics.ts        # Modularized SWR configuration & hooks
└── types/
    └── analytics.ts            # Enforced TypeScript data contracts
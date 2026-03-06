"use client";

import Link from "next/link";
import {
  CalendarDays,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";

const pipelineStages = [
  { label: "Prospect", count: 5, color: "var(--muted-foreground)" },
  { label: "Quote", count: 8, color: "#3b82f6" },
  { label: "Approval", count: 3, color: "#f59e0b" },
  { label: "Client", count: 12, color: "var(--gold)" },
  { label: "Event", count: 4, color: "var(--gold-neon)" },
  { label: "Execution", count: 2, color: "#f97316" },
  { label: "Closure", count: 6, color: "#22c55e" },
];

const recentActivity = [
  {
    id: "Q-2026-042",
    client: "Maria Santos",
    event: "Corporate Gala",
    date: "2026-03-15",
    services: 5,
    status: "Approved",
  },
  {
    id: "Q-2026-041",
    client: "Carlos Rivera",
    event: "Product Launch",
    date: "2026-04-02",
    services: 3,
    status: "Sent",
  },
  {
    id: "Q-2026-040",
    client: "Ana Gutierrez",
    event: "Wedding Reception",
    date: "2026-05-20",
    services: 7,
    status: "Draft",
  },
  {
    id: "Q-2026-039",
    client: "Tech Innovations Inc.",
    event: "Annual Conference",
    date: "2026-03-28",
    services: 4,
    status: "Approved",
  },
  {
    id: "Q-2026-038",
    client: "Festival Cultura Viva",
    event: "Music Festival",
    date: "2026-06-10",
    services: 6,
    status: "Planning",
  },
];

export default function OperationsDashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your event production pipeline.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="ghost"
            className="gap-1.5 rounded-lg border border-border/50 text-sm"
          >
            <Link href="/operations/pipeline">
              View Pipeline
              <ArrowRight size={14} />
            </Link>
          </Button>
          <Button
            asChild
            className="gap-1.5 rounded-lg text-sm text-primary-foreground"
            style={{
              background:
                "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))",
            }}
          >
            <Link href="/operations/quotes">
              <Plus size={14} />
              New Quote
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Events"
          value={18}
          icon={CalendarDays}
          trend={{ value: "12%", positive: true }}
        />
        <StatCard
          label="Pending Quotes"
          value={11}
          icon={FileText}
          trend={{ value: "3 new", positive: true }}
        />
        <StatCard
          label="This Month Revenue"
          value="$124K"
          icon={TrendingUp}
          trend={{ value: "8.2%", positive: true }}
        />
        <StatCard
          label="Upcoming (7 days)"
          value={4}
          icon={Clock}
          trend={{ value: "2 tomorrow", positive: true }}
        />
      </div>

      {/* Pipeline Overview */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Pipeline Overview
          </h2>
          <Link
            href="/operations/pipeline"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View full pipeline
          </Link>
        </div>
        <div className="flex items-end gap-1 overflow-x-auto">
          {pipelineStages.map((stage) => {
            const maxCount = Math.max(...pipelineStages.map((s) => s.count));
            const heightPct = (stage.count / maxCount) * 100;
            return (
              <div
                key={stage.label}
                className="flex flex-1 flex-col items-center gap-2"
                style={{ minWidth: 60 }}
              >
                <span className="text-sm font-bold text-foreground">
                  {stage.count}
                </span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(heightPct, 12)}px`,
                    minHeight: 12,
                    maxHeight: 80,
                    backgroundColor: stage.color,
                    opacity: 0.8,
                  }}
                />
                <span className="text-[11px] text-muted-foreground text-center leading-tight">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <Link
            href="/operations/quotes"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all quotes
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-t border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quote
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Client
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider md:table-cell">
                  Event
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider lg:table-cell">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border/50 transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {row.id}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {row.client}
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {row.event}
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                    {row.date}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

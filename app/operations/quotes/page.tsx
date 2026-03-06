"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ServiceIcon, SERVICE_DATA, type ServiceType } from "@/components/service-icon";

type Quote = {
  id: string;
  client: string;
  event: string;
  eventDate: string;
  services: ServiceType[];
  total: string;
  status: string;
};

const quotesData: Quote[] = [
  {
    id: "Q-2026-042",
    client: "Maria Santos",
    event: "Corporate Gala",
    eventDate: "2026-03-15",
    services: ["lighting", "audio", "decor", "atmosphere", "experiences"],
    total: "$18,500",
    status: "Approved",
  },
  {
    id: "Q-2026-041",
    client: "Carlos Rivera",
    event: "Product Launch",
    eventDate: "2026-04-02",
    services: ["lighting", "audio", "structures"],
    total: "$9,200",
    status: "Sent",
  },
  {
    id: "Q-2026-040",
    client: "Ana Gutierrez",
    event: "Wedding Reception",
    eventDate: "2026-05-20",
    services: [
      "lighting",
      "audio",
      "structures",
      "atmosphere",
      "experiences",
      "decor",
      "logistics",
    ],
    total: "$32,800",
    status: "Draft",
  },
  {
    id: "Q-2026-039",
    client: "Tech Innovations Inc.",
    event: "Annual Conference",
    eventDate: "2026-03-28",
    services: ["audio", "structures", "experiences", "logistics"],
    total: "$14,600",
    status: "Approved",
  },
  {
    id: "Q-2026-038",
    client: "Festival Cultura Viva",
    event: "Music Festival",
    eventDate: "2026-06-10",
    services: [
      "lighting",
      "audio",
      "structures",
      "atmosphere",
      "experiences",
      "logistics",
    ],
    total: "$45,000",
    status: "Sent",
  },
  {
    id: "Q-2026-037",
    client: "Hotel Meridian",
    event: "New Year Gala",
    eventDate: "2026-12-31",
    services: ["lighting", "audio", "atmosphere", "decor"],
    total: "$22,100",
    status: "Rejected",
  },
];

export default function QuotesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Quotes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage client quotations and proposals.
          </p>
        </div>
        <Button
          className="gap-1.5 rounded-lg text-sm text-primary-foreground"
          style={{
            background:
              "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))",
          }}
        >
          <Plus size={14} />
          Create Quote
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
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
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:table-cell">
                  Services
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 w-10" aria-label="Expand">
                  <span className="sr-only">Expand row</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {quotesData.map((q) => (
                <>
                  <tr
                    key={q.id}
                    className="border-t border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === q.id ? null : q.id)
                    }
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {q.id}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">
                      {q.client}
                    </td>
                    <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                      {q.event}
                    </td>
                    <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                      {q.eventDate}
                    </td>
                    <td className="hidden px-5 py-3 sm:table-cell">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--gold)" }}
                      >
                        {q.services.length} modules
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-foreground">
                      {q.total}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-5 py-3">
                      {expandedId === q.id ? (
                        <ChevronUp
                          size={14}
                          className="text-muted-foreground"
                        />
                      ) : (
                        <ChevronDown
                          size={14}
                          className="text-muted-foreground"
                        />
                      )}
                    </td>
                  </tr>
                  {expandedId === q.id && (
                    <tr key={`${q.id}-detail`} className="bg-muted/20">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="flex flex-wrap gap-3">
                          {q.services.map((svc) => (
                            <div
                              key={svc}
                              className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2"
                            >
                              <ServiceIcon
                                service={svc}
                                size={16}
                                className="text-[var(--gold)]"
                              />
                              <span className="text-xs font-medium text-foreground">
                                {SERVICE_DATA[svc].label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

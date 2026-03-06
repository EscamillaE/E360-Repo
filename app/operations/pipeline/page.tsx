"use client";

import { StatusBadge } from "@/components/status-badge";

type PipelineCard = {
  id: string;
  event: string;
  client: string;
  date: string;
  services: number;
};

const pipelineData: Record<string, PipelineCard[]> = {
  Prospect: [
    {
      id: "P-101",
      event: "Charity Gala",
      client: "Fundacion Luz",
      date: "2026-04-12",
      services: 3,
    },
    {
      id: "P-102",
      event: "Art Exhibition",
      client: "Galeria Norte",
      date: "2026-04-20",
      services: 2,
    },
  ],
  Quote: [
    {
      id: "Q-041",
      event: "Product Launch",
      client: "Carlos Rivera",
      date: "2026-04-02",
      services: 3,
    },
    {
      id: "Q-040",
      event: "Wedding Reception",
      client: "Ana Gutierrez",
      date: "2026-05-20",
      services: 7,
    },
    {
      id: "Q-043",
      event: "Awards Night",
      client: "Media Group SA",
      date: "2026-05-08",
      services: 5,
    },
  ],
  Approval: [
    {
      id: "Q-039",
      event: "Annual Conference",
      client: "Tech Innovations",
      date: "2026-03-28",
      services: 4,
    },
  ],
  Client: [
    {
      id: "E-018",
      event: "Corporate Gala",
      client: "Maria Santos",
      date: "2026-03-15",
      services: 5,
    },
    {
      id: "E-017",
      event: "Summer Festival",
      client: "Cultura Viva",
      date: "2026-06-10",
      services: 6,
    },
  ],
  Event: [
    {
      id: "E-016",
      event: "Brand Activation",
      client: "Moda Express",
      date: "2026-03-08",
      services: 4,
    },
  ],
  Execution: [
    {
      id: "E-015",
      event: "Tech Summit",
      client: "DevCon Latam",
      date: "2026-03-01",
      services: 5,
    },
  ],
  Closure: [
    {
      id: "E-014",
      event: "New Year Bash",
      client: "Hotel Meridian",
      date: "2026-01-01",
      services: 7,
    },
    {
      id: "E-013",
      event: "Valentine Soiree",
      client: "Rosales Events",
      date: "2026-02-14",
      services: 3,
    },
  ],
};

const stageColors: Record<string, string> = {
  Prospect: "var(--muted-foreground)",
  Quote: "#3b82f6",
  Approval: "#f59e0b",
  Client: "var(--gold)",
  Event: "var(--gold-neon)",
  Execution: "#f97316",
  Closure: "#22c55e",
};

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Pipeline
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kanban view of events across all workflow stages.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(pipelineData).map(([stage, cards]) => (
          <div key={stage} className="flex-shrink-0" style={{ width: 260 }}>
            {/* Column header */}
            <div className="mb-3 flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: stageColors[stage] }}
              />
              <h2 className="text-sm font-semibold text-foreground">
                {stage}
              </h2>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg border border-border/50 bg-card p-3.5 transition-colors hover:border-border"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {card.id}
                    </span>
                    <StatusBadge status={stage} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {card.event}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {card.client}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{card.date}</span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--gold)" }}
                    >
                      {card.services} services
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

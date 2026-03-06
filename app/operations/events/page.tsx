"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  ServiceIcon,
  SERVICE_DATA,
  type ServiceType,
} from "@/components/service-icon";

type EventRow = {
  id: string;
  name: string;
  client: string;
  date: string;
  location: string;
  locationType: string;
  guests: number;
  services: ServiceType[];
  status: string;
  team: string;
  checklist: { item: string; done: boolean }[];
};

const eventsData: EventRow[] = [
  {
    id: "E-018",
    name: "Corporate Gala",
    client: "Maria Santos",
    date: "2026-03-15",
    location: "Grand Ballroom, Hotel Excelsior",
    locationType: "indoor",
    guests: 350,
    services: ["lighting", "audio", "decor", "atmosphere", "experiences"],
    status: "Confirmed",
    team: "Team Alpha",
    checklist: [
      { item: "Venue walkthrough", done: true },
      { item: "Equipment load-in", done: true },
      { item: "Sound check", done: false },
      { item: "Lighting program", done: false },
      { item: "Client final review", done: false },
    ],
  },
  {
    id: "E-017",
    name: "Summer Festival",
    client: "Cultura Viva",
    date: "2026-06-10",
    location: "Parque Central",
    locationType: "outdoor",
    guests: 2000,
    services: [
      "lighting",
      "audio",
      "structures",
      "atmosphere",
      "experiences",
      "logistics",
    ],
    status: "Planning",
    team: "Team Bravo",
    checklist: [
      { item: "Permits & licenses", done: true },
      { item: "Stage design approval", done: true },
      { item: "Vendor contracts", done: false },
      { item: "Power grid layout", done: false },
      { item: "Security plan", done: false },
      { item: "Weather contingency", done: false },
    ],
  },
  {
    id: "E-016",
    name: "Brand Activation",
    client: "Moda Express",
    date: "2026-03-08",
    location: "Showroom Moda, Centro Comercial",
    locationType: "indoor",
    guests: 150,
    services: ["lighting", "audio", "experiences", "decor"],
    status: "In-Progress",
    team: "Team Alpha",
    checklist: [
      { item: "Setup complete", done: true },
      { item: "Photo wall installed", done: true },
      { item: "DJ booth ready", done: true },
      { item: "Client walkthrough", done: true },
      { item: "Doors open", done: false },
    ],
  },
  {
    id: "E-015",
    name: "Tech Summit",
    client: "DevCon Latam",
    date: "2026-03-01",
    location: "Convention Center, Hall A",
    locationType: "indoor",
    guests: 800,
    services: ["audio", "structures", "experiences", "logistics", "lighting"],
    status: "Completed",
    team: "Team Charlie",
    checklist: [
      { item: "Load-in", done: true },
      { item: "AV setup", done: true },
      { item: "Keynote rehearsal", done: true },
      { item: "Event day execution", done: true },
      { item: "Load-out", done: true },
      { item: "Post-event report", done: true },
    ],
  },
];

export default function EventsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Events
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage all active and completed events.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Event
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider md:table-cell">
                  Client
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider lg:table-cell">
                  Date
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:table-cell">
                  Services
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider lg:table-cell">
                  Team
                </th>
                <th className="px-5 py-3 w-10" aria-label="Expand">
                  <span className="sr-only">Expand row</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {eventsData.map((evt) => {
                const isExpanded = expandedId === evt.id;
                const completedTasks = evt.checklist.filter(
                  (c) => c.done
                ).length;
                return (
                  <>
                    <tr
                      key={evt.id}
                      className="border-t border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : evt.id)
                      }
                    >
                      <td className="px-5 py-3">
                        <div>
                          <span className="font-medium text-foreground">
                            {evt.name}
                          </span>
                          <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                            {evt.id}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                        {evt.client}
                      </td>
                      <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                        {evt.date}
                      </td>
                      <td className="hidden px-5 py-3 sm:table-cell">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--gold)" }}
                        >
                          {evt.services.length} modules
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={evt.status} />
                      </td>
                      <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                        {evt.team}
                      </td>
                      <td className="px-5 py-3">
                        {isExpanded ? (
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
                    {isExpanded && (
                      <tr key={`${evt.id}-detail`} className="bg-muted/20">
                        <td colSpan={7} className="px-5 py-5">
                          <div className="grid gap-6 md:grid-cols-2">
                            {/* Event info */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin size={14} />
                                  <span>{evt.location}</span>
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize">
                                    {evt.locationType}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Users size={14} />
                                  <span>{evt.guests} guests</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {evt.services.map((svc) => (
                                  <div
                                    key={svc}
                                    className="flex items-center gap-1.5 rounded-md border border-border/50 bg-card px-2.5 py-1"
                                  >
                                    <ServiceIcon
                                      service={svc}
                                      size={14}
                                      className="text-[var(--gold)]"
                                    />
                                    <span className="text-xs text-foreground">
                                      {SERVICE_DATA[svc].label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Checklist */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Checklist
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {completedTasks}/{evt.checklist.length}
                                </span>
                              </div>
                              {/* Progress bar */}
                              <div className="h-1.5 w-full rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${(completedTasks / evt.checklist.length) * 100}%`,
                                    background:
                                      "linear-gradient(90deg, var(--gold-deep), var(--gold))",
                                  }}
                                />
                              </div>
                              <ul className="space-y-1.5">
                                {evt.checklist.map((item) => (
                                  <li
                                    key={item.item}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div
                                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                                        item.done
                                          ? "border-[var(--gold)] bg-[var(--gold)]/20"
                                          : "border-border"
                                      }`}
                                    >
                                      {item.done && (
                                        <svg
                                          viewBox="0 0 12 12"
                                          className="h-2.5 w-2.5"
                                          style={{ color: "var(--gold)" }}
                                        >
                                          <path
                                            d="M10 3L4.5 8.5L2 6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <span
                                      className={
                                        item.done
                                          ? "text-muted-foreground line-through"
                                          : "text-foreground"
                                      }
                                    >
                                      {item.item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  prospect: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  quote: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-destructive/15 text-destructive",
  planning: "bg-[var(--gold)]/15 text-[var(--gold-deep)] dark:text-[var(--gold-neon)]",
  client: "bg-[var(--gold)]/15 text-[var(--gold-deep)] dark:text-[var(--gold-neon)]",
  "in-progress": "bg-[var(--gold)]/20 text-[var(--gold-deep)] dark:text-[var(--gold-neon)]",
  event: "bg-[var(--gold)]/20 text-[var(--gold-deep)] dark:text-[var(--gold-neon)]",
  execution: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  closure: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const key = status.toLowerCase().replace(/\s+/g, "-")
  const style = statusStyles[key] || "bg-muted text-muted-foreground"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      {status}
    </span>
  )
}

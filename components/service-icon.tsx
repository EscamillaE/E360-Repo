import {
  Lightbulb,
  Volume2,
  Warehouse,
  CloudFog,
  Sparkles,
  Flower2,
  Truck,
  type LucideIcon,
} from "lucide-react"

export type ServiceType =
  | "lighting"
  | "audio"
  | "structures"
  | "atmosphere"
  | "experiences"
  | "decor"
  | "logistics"

export const SERVICE_DATA: Record<
  ServiceType,
  { label: string; icon: LucideIcon; description: string }
> = {
  lighting: {
    label: "Lighting",
    icon: Lightbulb,
    description: "Architectural, scenic, and cinematic lighting design",
  },
  audio: {
    label: "Audio",
    icon: Volume2,
    description: "Sound systems, live mixing, and acoustic engineering",
  },
  structures: {
    label: "Structures",
    icon: Warehouse,
    description: "Stages, tents, platforms, and custom builds",
  },
  atmosphere: {
    label: "Atmosphere",
    icon: CloudFog,
    description: "Fog, haze, pyrotechnics, and special effects",
  },
  experiences: {
    label: "Experiences",
    icon: Sparkles,
    description: "Photo booths, LED walls, and interactive stations",
  },
  decor: {
    label: "Decor",
    icon: Flower2,
    description: "Floral design, fabric draping, and scenic elements",
  },
  logistics: {
    label: "Logistics",
    icon: Truck,
    description: "Transport, power supply, crew, and coordination",
  },
}

export function ServiceIcon({
  service,
  size = 20,
  className = "",
}: {
  service: ServiceType
  size?: number
  className?: string
}) {
  const data = SERVICE_DATA[service]
  const Icon = data.icon
  return <Icon size={size} className={className} aria-hidden="true" />
}

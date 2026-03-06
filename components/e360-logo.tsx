"use client"

import Link from "next/link"
import Image from "next/image"

export function E360Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const dimensions = {
    small: 32,
    default: 44,
    large: 60,
  }
  const dim = dimensions[size]

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="Eventos 360 - Home">
      <Image
        src="/images/logo.png"
        alt="Eventos 360"
        width={dim}
        height={dim}
        className="object-contain"
        style={{ width: dim, height: dim }}
        priority
      />
    </Link>
  )
}

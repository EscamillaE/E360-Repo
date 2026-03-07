"use client"

import { useState } from "react"
import { AdminShell, type AdminTab } from "@/components/admin-shell"
import { DashboardView } from "@/components/views/dashboard"
import { CalendarView } from "@/components/views/calendar"
import { CatalogView } from "@/components/views/catalog"
import { QuotesView } from "@/components/views/quotes"
import { ContactsView } from "@/components/views/contacts"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("inicio")

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "inicio" && <DashboardView onNavigate={setActiveTab} />}
      {activeTab === "calendario" && <CalendarView />}
      {activeTab === "catalogo" && <CatalogView />}
      {activeTab === "cotizaciones" && <QuotesView />}
      {activeTab === "contactos" && <ContactsView />}
    </AdminShell>
  )
}

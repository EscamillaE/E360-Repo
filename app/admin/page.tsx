import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/client"
import { getAdminStats, getAdminQuotes, getAdminCatalog, getAdminClients } from "@/lib/actions/admin"
import { getCategories } from "@/lib/actions/catalog"
import { AdminDashboard } from "./admin-dashboard"

export default async function AdminPage() {
  const { user, profile } = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirectTo=/admin')
  }
  
  // For now, allow any authenticated user to access admin
  // In production, you would check: if (profile?.role !== 'admin') redirect('/')
  
  const [stats, quotes, catalog, clients, categories] = await Promise.all([
    getAdminStats(),
    getAdminQuotes(),
    getAdminCatalog(),
    getAdminClients(),
    getCategories(),
  ])
  
  return (
    <AdminDashboard 
      user={user}
      profile={profile}
      stats={stats}
      quotes={quotes}
      catalog={catalog}
      clients={clients}
      categories={categories}
    />
  )
}

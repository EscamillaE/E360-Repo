import { redirect } from "next/navigation"
import { getCurrentUser, getClientQuotes, getClientEvents, getClientFavorites } from "@/lib/actions/client"
import { ClientPortal } from "./client-portal"

export default async function ClientePage() {
  const { user, profile } = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirectTo=/cliente')
  }
  
  const [quotes, events, favorites] = await Promise.all([
    getClientQuotes(),
    getClientEvents(),
    getClientFavorites()
  ])
  
  return (
    <ClientPortal 
      user={user}
      profile={profile}
      quotes={quotes}
      events={events}
      favorites={favorites}
    />
  )
}

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        isAuthenticated: false,
        profile: null,
        quotes: [],
        events: [],
      })
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Get client record if exists
    const { data: clientRecord } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single()

    let quotes: unknown[] = []
    let events: unknown[] = []

    if (clientRecord) {
      // Get client's quotes
      const { data: clientQuotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("client_id", clientRecord.id)
        .order("created_at", { ascending: false })

      quotes = clientQuotes || []

      // Get client's events
      const { data: clientEvents } = await supabase
        .from("events")
        .select("*")
        .eq("client_id", clientRecord.id)
        .order("event_date", { ascending: true })

      events = clientEvents || []
    }

    return NextResponse.json({
      isAuthenticated: true,
      profile: {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.email?.split("@")[0] || "Usuario",
        role: profile?.role || "client",
      },
      quotes,
      events,
    })
  } catch (error) {
    console.error("Error fetching client data:", error)
    return NextResponse.json({ error: "Failed to fetch client data" }, { status: 500 })
  }
}

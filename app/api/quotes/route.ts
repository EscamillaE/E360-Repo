import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        clients (
          id,
          name,
          email,
          phone
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ quotes: data || [] })
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      client_id,
      event_type,
      event_date,
      venue,
      items,
      subtotal,
      discount_percent,
      total,
      notes,
    } = body

    // Generate quote number
    const quoteNumber = `Q-${Date.now().toString(36).toUpperCase()}`

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        quote_number: quoteNumber,
        client_id,
        event_type,
        event_date,
        venue,
        items: items || [],
        subtotal: subtotal || 0,
        discount_percent: discount_percent || 0,
        total: total || 0,
        notes,
        status: "pendiente",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ quote: data })
  } catch (error) {
    console.error("Error creating quote:", error)
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
  }
}

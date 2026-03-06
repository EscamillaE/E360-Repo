import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current date info
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

    // Get quotes this month
    const { count: quotesThisMonth } = await supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth)

    // Get quotes last month
    const { count: quotesLastMonth } = await supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lte("created_at", endOfLastMonth)

    // Get total revenue this month
    const { data: revenueData } = await supabase
      .from("quotes")
      .select("total")
      .gte("created_at", startOfMonth)
      .in("status", ["aprobada", "completada"])

    const revenueThisMonth = revenueData?.reduce((sum, q) => sum + (parseFloat(q.total) || 0), 0) || 0

    // Get upcoming events
    const { count: upcomingEvents } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", now.toISOString())
      .eq("status", "confirmado")

    // Get total clients
    const { count: totalClients } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })

    // Get recent quotes
    const { data: recentQuotes } = await supabase
      .from("quotes")
      .select(`
        id,
        quote_number,
        event_type,
        event_date,
        total,
        status,
        created_at,
        clients (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    // Calculate changes
    const quotesChange = quotesLastMonth 
      ? Math.round(((quotesThisMonth || 0) - quotesLastMonth) / quotesLastMonth * 100)
      : 0

    return NextResponse.json({
      stats: {
        quotesThisMonth: quotesThisMonth || 0,
        quotesChange: quotesChange > 0 ? `+${quotesChange}%` : `${quotesChange}%`,
        revenueThisMonth,
        revenueFormatted: `$${revenueThisMonth.toLocaleString()}`,
        upcomingEvents: upcomingEvents || 0,
        totalClients: totalClients || 0,
      },
      recentQuotes: recentQuotes?.map(q => ({
        id: q.id,
        quoteNumber: q.quote_number,
        client: q.clients?.name || "Sin cliente",
        event: q.event_type,
        total: parseFloat(q.total) || 0,
        status: q.status,
        date: q.event_date,
      })) || [],
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

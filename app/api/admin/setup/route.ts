import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Admin users to create - in production, these would be environment variables
const ADMIN_USERS = [
  {
    email: "osvaldo@eventos360.com",
    password: "Taco.123",
    fullName: "Osvaldo Moncada",
  },
  {
    email: "enrique@eventos360.com",
    password: "Louvre.2026",
    fullName: "Enrique Escamilla",
  },
]

// One-time setup key - change this after initial setup
const SETUP_KEY = process.env.ADMIN_SETUP_KEY || "E360-SETUP-2026"

export async function POST(request: Request) {
  try {
    const { setupKey } = await request.json()

    // Verify setup key
    if (setupKey !== SETUP_KEY) {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const results: { email: string; success: boolean; error?: string }[] = []

    for (const admin of ADMIN_USERS) {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from("profiles")
        .select("id")
        .eq("full_name", admin.fullName)
        .limit(1)

      if (existingUsers && existingUsers.length > 0) {
        results.push({
          email: admin.email,
          success: false,
          error: "User already exists",
        })
        continue
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          data: {
            full_name: admin.fullName,
            role: "admin",
          },
        },
      })

      if (authError) {
        results.push({
          email: admin.email,
          success: false,
          error: authError.message,
        })
        continue
      }

      // If user was created, update their profile to be admin
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: authData.user.id,
            full_name: admin.fullName,
            role: "admin",
          })

        if (profileError) {
          results.push({
            email: admin.email,
            success: false,
            error: `Profile error: ${profileError.message}`,
          })
          continue
        }
      }

      results.push({
        email: admin.email,
        success: true,
      })
    }

    return NextResponse.json({
      message: "Admin setup completed",
      results,
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json(
      { error: "Setup failed" },
      { status: 500 }
    )
  }
}

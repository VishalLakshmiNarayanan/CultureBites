"use server"

import { createClient } from "@supabase/supabase-js"

// Create admin client with service role key for user management
function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  console.log("[v0] Creating admin client with URL:", supabaseUrl)
  console.log("[v0] Service key exists:", !!supabaseServiceKey)

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function confirmUserEmail(userId: string) {
  try {
    console.log("[v0] Attempting to confirm email for user:", userId)
    const adminClient = createAdminClient()

    // Update user to confirm their email
    const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) {
      console.error("[v0] Error confirming user email:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] User email confirmed successfully:", userId)
    console.log("[v0] Confirmation data:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Exception confirming user email:", error)
    return { success: false, error: String(error) }
  }
}

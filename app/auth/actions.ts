"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Create admin client with service role key
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Create regular server client
function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Handle cookie setting errors
        }
      },
    },
  })
}

export async function signUpUser(email: string, password: string, role: string) {
  try {
    const adminClient = createAdminClient()

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role,
      },
    })

    if (authError) {
      console.log("[v0] Admin signup error:", authError.message)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: "Failed to create user" }
    }

    console.log("[v0] User created successfully:", authData.user.id)

    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.log("[v0] Signup error:", error instanceof Error ? error.message : "An error occurred")
    return { error: error instanceof Error ? error.message : "An error occurred" }
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log("[v0] Sign in error:", error.message)
      return { error: error.message }
    }

    if (!data.user) {
      return { error: "Failed to sign in" }
    }

    console.log("[v0] User signed in successfully:", data.user.id)

    // Get user role from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.log("[v0] Error fetching user role:", userError.message)
      return { error: "Failed to fetch user data" }
    }

    return {
      success: true,
      userId: data.user.id,
      role: userData.role,
    }
  } catch (error) {
    console.log("[v0] Login error:", error instanceof Error ? error.message : "An error occurred")
    return { error: error instanceof Error ? error.message : "An error occurred" }
  }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function signUpUser(email: string, password: string, name: string, role: "host" | "cook") {
  console.log("[v0] Starting signup:", { email, name, role })

  const supabase = await createClient()

  const { data: existingUser } = await supabase.from("app_users").select("email").eq("email", email).maybeSingle()

  if (existingUser) {
    console.log("[v0] User already exists")
    return { error: "User with this email already exists" }
  }

  const { data, error } = await supabase
    .from("app_users")
    .insert({
      email,
      password,
      display_name: name,
      role,
    })
    .select()
    .single()

  if (error) {
    console.log("[v0] Signup error:", error)
    return { error: error.message }
  }

  console.log("[v0] Signup successful:", data)

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("user_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  cookieStore.set("user_role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  return { data }
}

export async function loginUser(email: string, password: string) {
  console.log("[v0] Starting login:", { email })

  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.from("app_users").select("*").eq("email", email).maybeSingle()

  if (userError) {
    console.log("[v0] Database error:", userError)
    return { error: "Database error occurred" }
  }

  if (!user) {
    console.log("[v0] User not found")
    return { error: "Invalid email or password" }
  }

  if (user.password !== password) {
    console.log("[v0] Password mismatch")
    return { error: "Invalid email or password" }
  }

  console.log("[v0] Login successful:", user)

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("user_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  cookieStore.set("user_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  return { data: user }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("user_email")
  cookieStore.delete("user_role")
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const email = cookieStore.get("user_email")?.value
  const role = cookieStore.get("user_role")?.value

  if (!email) return null

  const supabase = await createClient()
  const { data: user } = await supabase.from("app_users").select("display_name").eq("email", email).maybeSingle()

  return { email, role, displayName: user?.display_name || email }
}

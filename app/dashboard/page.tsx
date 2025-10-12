import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import UserDashboard from "@/components/dashboards/user-dashboard"
import HostDashboard from "@/components/dashboards/host-dashboard"
import CookDashboard from "@/components/dashboards/cook-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError || !profile) {
    redirect("/auth/login")
  }

  // Route to appropriate dashboard based on role
  if (profile.role === "user") {
    return <UserDashboard profile={profile} />
  } else if (profile.role === "host") {
    return <HostDashboard profile={profile} />
  } else if (profile.role === "cook") {
    return <CookDashboard profile={profile} />
  }

  redirect("/auth/login")
}

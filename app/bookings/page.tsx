import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookingsList } from "@/components/bookings-list"

export default async function BookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "user") {
    redirect("/dashboard")
  }

  // Fetch user's bookings with event details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      events (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <BookingsList bookings={bookings || []} profile={profile} />
}

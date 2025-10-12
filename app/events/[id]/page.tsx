import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EventDetails } from "@/components/event-details"

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event details
  const { data: event, error: eventError } = await supabase.from("events").select("*").eq("id", id).single()

  if (eventError || !event) {
    redirect("/dashboard")
  }

  // Fetch host profile
  const { data: host } = await supabase.from("profiles").select("*").eq("id", event.host_id).single()

  // Fetch cook profile if assigned
  let cook = null
  if (event.cook_id) {
    const { data: cookData } = await supabase.from("profiles").select("*").eq("id", event.cook_id).single()
    cook = cookData
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentUserProfile = null
  if (user) {
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    currentUserProfile = profileData
  }

  return <EventDetails event={event} host={host} cook={cook} currentUser={currentUserProfile} />
}

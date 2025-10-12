import { createClient } from "./client"
import type { Event, Host, Cook, CollaborationRequest, SeatRequest } from "@/lib/types"

// Hosts
export async function getAllHosts(): Promise<Host[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("hosts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching hosts:", error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    profileImage: row.profile_image,
    spaceTitle: row.space_title,
    spaceDesc: row.space_desc,
    location: row.location,
    capacity: row.capacity,
    photos: row.photos || [],
  }))
}

export async function createHost(host: Host): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("hosts").insert({
    id: host.id,
    name: host.name,
    profile_image: host.profileImage,
    space_title: host.spaceTitle,
    space_desc: host.spaceDesc,
    location: host.location,
    capacity: host.capacity,
    photos: host.photos,
  })

  if (error) {
    console.error("[v0] Error creating host:", error)
    throw error
  }
}

// Cooks
export async function getAllCooks(): Promise<Cook[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("cooks").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching cooks:", error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    profileImage: row.profile_image,
    originCountry: row.origin_country,
    specialties: row.specialties || [],
    story: row.story,
    cuisineImages: row.cuisine_images || [],
  }))
}

export async function createCook(cook: Cook): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("cooks").insert({
    id: cook.id,
    name: cook.name,
    profile_image: cook.profileImage,
    origin_country: cook.originCountry,
    specialties: cook.specialties,
    story: cook.story,
    cuisine_images: cook.cuisineImages,
  })

  if (error) {
    console.error("[v0] Error creating cook:", error)
    throw error
  }
}

// Events
export async function getAllEvents(): Promise<Event[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching events:", error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    cuisine: row.cuisine,
    hostId: row.host_id,
    cookId: row.cook_id,
    dateISO: row.date_iso,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    images: row.images || [],
    seatsTotal: row.seats_total,
    seatsLeft: row.seats_left,
  }))
}

export async function createEvent(event: Event): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("events").insert({
    id: event.id,
    title: event.title,
    cuisine: event.cuisine,
    host_id: event.hostId,
    cook_id: event.cookId,
    date_iso: event.dateISO,
    start_time: event.startTime,
    end_time: event.endTime,
    location: event.location,
    images: event.images,
    seats_total: event.seatsTotal,
    seats_left: event.seatsLeft,
  })

  if (error) {
    console.error("[v0] Error creating event:", error)
    throw error
  }
}

export async function updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
  const supabase = createClient()
  const dbUpdates: Record<string, any> = {}

  if (updates.cookId !== undefined) dbUpdates.cook_id = updates.cookId
  if (updates.seatsLeft !== undefined) dbUpdates.seats_left = updates.seatsLeft

  const { error } = await supabase.from("events").update(dbUpdates).eq("id", eventId)

  if (error) {
    console.error("[v0] Error updating event:", error)
    throw error
  }
}

// Collaboration Requests
export async function getAllCollaborationRequests(): Promise<CollaborationRequest[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("collaboration_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching collaboration requests:", error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    fromCookId: row.from_cook_id,
    toHostId: row.to_host_id,
    eventId: row.event_id,
    message: row.message,
    proposedDishes: row.proposed_dishes || [],
    status: row.status as "pending" | "accepted" | "declined",
    createdAtISO: row.created_at_iso,
  }))
}

export async function createCollaborationRequest(request: CollaborationRequest): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("collaboration_requests").insert({
    id: request.id,
    from_cook_id: request.fromCookId,
    to_host_id: request.toHostId,
    event_id: request.eventId,
    message: request.message,
    proposed_dishes: request.proposedDishes,
    status: request.status,
    created_at_iso: request.createdAtISO,
  })

  if (error) {
    console.error("[v0] Error creating collaboration request:", error)
    throw error
  }
}

export async function updateCollaborationRequest(
  requestId: string,
  status: "pending" | "accepted" | "declined",
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("collaboration_requests").update({ status }).eq("id", requestId)

  if (error) {
    console.error("[v0] Error updating collaboration request:", error)
    throw error
  }
}

// Seat Requests
export async function getAllSeatRequests(): Promise<SeatRequest[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("seat_requests").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching seat requests:", error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    eventId: row.event_id,
    guestName: row.guest_name,
    note: row.note,
    status: row.status as "pending" | "approved" | "waitlist" | "declined",
    createdAtISO: row.created_at_iso,
  }))
}

export async function createSeatRequest(request: SeatRequest): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("seat_requests").insert({
    id: request.id,
    event_id: request.eventId,
    guest_name: request.guestName,
    note: request.note,
    status: request.status,
    created_at_iso: request.createdAtISO,
  })

  if (error) {
    console.error("[v0] Error creating seat request:", error)
    throw error
  }
}

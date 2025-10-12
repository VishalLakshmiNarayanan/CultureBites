import { createClient } from "./client"
import type { Event, Host, Cook, CollaborationRequest, SeatRequest } from "@/lib/types"

const PAGE_SIZE = 24

type Page<T> = { items: T[]; nextOffset: number | null }

export async function listHosts(offset = 0, limit = PAGE_SIZE, userEmail?: string): Promise<Page<Host>> {
  const supabase = createClient()
  let query = supabase.from("hosts").select("*").order("created_at", { ascending: false })

  if (userEmail) {
    query = query.eq("user_email", userEmail)
  }

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error("[v0] Error fetching hosts:", error)
    return { items: [], nextOffset: null }
  }

  const hosts = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    profileImage: row.images?.[0] || "", // First image is the profile image
    spaceTitle: row.space_type,
    spaceDesc: row.description,
    location: row.location,
    capacity: row.capacity,
    photos: row.images?.slice(1) || [], // Rest of images are photos
    userEmail: row.user_email,
  }))

  const nextOffset = data.length < limit ? null : offset + limit
  return { items: hosts, nextOffset }
}

export async function listCooks(offset = 0, limit = PAGE_SIZE, userEmail?: string): Promise<Page<Cook>> {
  const supabase = createClient()
  let query = supabase.from("cooks").select("*").order("created_at", { ascending: false })

  if (userEmail) {
    query = query.eq("user_email", userEmail)
  }

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error("[v0] Error fetching cooks:", error)
    return { items: [], nextOffset: null }
  }

  const cooks = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    profileImage: row.profile_picture,
    originCountry: row.origin_country,
    specialties: row.specialties || [],
    story: row.story,
    cuisineImages: row.cuisine_images || [],
    userEmail: row.user_email,
  }))

  const nextOffset = data.length < limit ? null : offset + limit
  return { items: cooks, nextOffset }
}

export async function listEvents(offset = 0, limit = PAGE_SIZE): Promise<Page<Event>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date_iso", { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("[v0] Error fetching events:", error)
    return { items: [], nextOffset: null }
  }

  const events = (data || []).map((row) => ({
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

  const nextOffset = data.length < limit ? null : offset + limit
  return { items: events, nextOffset }
}

export async function listCollaborationRequests(offset = 0, limit = PAGE_SIZE): Promise<Page<CollaborationRequest>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("collaboration_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("[v0] Error fetching collaboration requests:", error)
    return { items: [], nextOffset: null }
  }

  const requests = (data || []).map((row) => ({
    id: row.id,
    fromCookId: row.cook_id,
    toHostId: row.host_id,
    eventId: row.event_id,
    message: row.message,
    proposedDishes: [], // Not in new schema
    status: row.status as "pending" | "accepted" | "declined",
    createdAtISO: row.created_at_iso,
  }))

  const nextOffset = data.length < limit ? null : offset + limit
  return { items: requests, nextOffset }
}

export async function listSeatRequests(offset = 0, limit = PAGE_SIZE): Promise<Page<SeatRequest>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("seat_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("[v0] Error fetching seat requests:", error)
    return { items: [], nextOffset: null }
  }

  const requests = (data || []).map((row) => ({
    id: row.id,
    eventId: row.event_id,
    guestName: row.guest_name,
    note: row.dietary_restrictions || "",
    createdAtISO: row.created_at_iso,
    status: (row.status || "pending") as "pending" | "approved" | "declined" | "waitlist",
  }))

  const nextOffset = data.length < limit ? null : offset + limit
  return { items: requests, nextOffset }
}

export async function listSeatRequestsByEvent(
  eventId: string,
  offset = 0,
  limit = PAGE_SIZE,
): Promise<Page<SeatRequest>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("seat_requests")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("[v0] Error fetching seat requests:", error)
    return { items: [], nextOffset: null }
  }

  const requests = (data || []).map((row) => ({
    id: row.id,
    eventId: row.event_id,
    guestName: row.guest_name,
    note: row.dietary_restrictions,
    createdAtISO: row.created_at_iso,
    status: "pending" as const, // Default status
  }))

  const nextOffset = data.length < limit ? null : offset + limit
  return { items: requests, nextOffset }
}

// CREATE operations
export async function createHost(host: Host, userEmail?: string): Promise<void> {
  const supabase = createClient()
  // Profile image is stored as first item in images array
  const { error } = await supabase.from("hosts").insert({
    id: host.id,
    name: host.name,
    location: host.location,
    space_type: host.spaceTitle,
    capacity: host.capacity,
    amenities: [], // Not in current Host type
    description: host.spaceDesc,
    images: host.profileImage ? [host.profileImage, ...host.photos] : host.photos,
    user_email: userEmail, // Link to logged-in user
  })

  if (error) {
    console.error("[v0] Error creating host:", error)
    throw error
  }
}

export async function createCook(cook: Cook, userEmail?: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("cooks").insert({
    id: cook.id,
    name: cook.name,
    origin_country: cook.originCountry,
    specialties: cook.specialties,
    story: cook.story,
    profile_picture: cook.profileImage,
    cuisine_images: cook.cuisineImages,
    user_email: userEmail, // Link to logged-in user
  })

  if (error) {
    console.error("[v0] Error creating cook:", error)
    throw error
  }
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

export async function createCollaborationRequest(request: CollaborationRequest): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("collaboration_requests").insert({
    id: request.id,
    cook_id: request.fromCookId,
    host_id: request.toHostId,
    event_id: request.eventId,
    message: request.message,
    status: request.status,
    created_at_iso: request.createdAtISO,
  })

  if (error) {
    console.error("[v0] Error creating collaboration request:", error)
    throw error
  }
}

export async function createSeatRequest(request: SeatRequest): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("seat_requests").insert({
    id: request.id,
    event_id: request.eventId,
    guest_name: request.guestName,
    guest_email: "", // Required field, using empty string as default
    seats_requested: 1, // Default to 1 seat
    dietary_restrictions: request.note,
    created_at_iso: request.createdAtISO,
  })

  if (error) {
    console.error("[v0] Error creating seat request:", error)
    throw error
  }
}

// UPDATE operations
export async function updateEventSeatsLeft(eventId: string, seatsLeft: number): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("events").update({ seats_left: seatsLeft }).eq("id", eventId)

  if (error) {
    console.error("[v0] Error updating event seats:", error)
    throw error
  }
}

export async function updateEventCook(eventId: string, cookId: string | null): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("events").update({ cook_id: cookId }).eq("id", eventId)

  if (error) {
    console.error("[v0] Error updating event cook:", error)
    throw error
  }
}

export async function updateCollaborationRequestStatus(
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

export async function updateSeatRequestStatus(
  requestId: string,
  status: "pending" | "approved" | "declined" | "waitlist",
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("seat_requests").update({ status }).eq("id", requestId)

  if (error) {
    console.error("[v0] Error updating seat request:", error)
    throw error
  }
}

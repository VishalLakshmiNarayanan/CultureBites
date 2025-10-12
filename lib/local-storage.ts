import type { AppData } from "@/lib/types"
import {
  listHosts,
  listCooks,
  listEvents,
  listCollaborationRequests,
  listSeatRequests,
  createHost,
  createCook,
  createEvent,
  createCollaborationRequest,
  createSeatRequest,
  updateEventSeatsLeft,
  updateEventCook,
  updateCollaborationRequestStatus,
  updateSeatRequestStatus as updateSeatRequestStatusFunc,
  listHostsByUserEmail,
  listCooksByUserEmail,
} from "@/lib/supabase/database"
import type { Host, Cook, Event, CollaborationRequest, SeatRequest } from "@/lib/types"

// Initialize with empty data structure
const defaultData: AppData = {
  events: [],
  hosts: [],
  cooks: [],
  collaborationRequests: [],
  seatRequests: [],
}

export async function getAppData(): Promise<AppData> {
  try {
    console.log("[v0] Fetching data from Supabase...")

    // Fetch all data from Supabase in parallel with individual error handling
    const [hostsResult, cooksResult, eventsResult, collaborationRequestsResult, seatRequestsResult] =
      await Promise.allSettled([
        listHosts(0, 1000),
        listCooks(0, 1000),
        listEvents(0, 1000),
        listCollaborationRequests(0, 1000),
        listSeatRequests(0, 1000),
      ])

    const data: AppData = {
      hosts: hostsResult.status === "fulfilled" ? hostsResult.value.items : [],
      cooks: cooksResult.status === "fulfilled" ? cooksResult.value.items : [],
      events: eventsResult.status === "fulfilled" ? eventsResult.value.items : [],
      collaborationRequests:
        collaborationRequestsResult.status === "fulfilled" ? collaborationRequestsResult.value.items : [],
      seatRequests: seatRequestsResult.status === "fulfilled" ? seatRequestsResult.value.items : [],
    }

    // Log any errors
    if (hostsResult.status === "rejected") {
      console.error("[v0] Error fetching hosts:", hostsResult.reason)
    }
    if (cooksResult.status === "rejected") {
      console.error("[v0] Error fetching cooks:", cooksResult.reason)
    }
    if (eventsResult.status === "rejected") {
      console.error("[v0] Error fetching events:", eventsResult.reason)
    }

    console.log("[v0] Data fetched from Supabase:", {
      hosts: data.hosts.length,
      cooks: data.cooks.length,
      events: data.events.length,
      collaborationRequests: data.collaborationRequests.length,
      seatRequests: data.seatRequests.length,
    })

    return data
  } catch (error) {
    console.error("[v0] Error fetching from Supabase:", error)
    return defaultData
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  console.warn("[v0] saveAppData is deprecated. Use individual create/update functions instead.")
}

export async function resetAppData(): Promise<void> {
  console.warn("[v0] resetAppData is not supported with Supabase. Please delete data from Supabase dashboard.")
}

// Helper functions for individual operations
export async function addHost(host: Host): Promise<void> {
  try {
    console.log("[v0] Creating host in Supabase:", host.id)
    await createHost(host, host.userEmail)
    console.log("[v0] Host created successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error creating host:", error)
    throw error
  }
}

export async function addCook(cook: Cook): Promise<void> {
  try {
    console.log("[v0] Creating cook in Supabase:", cook.id)
    await createCook(cook, cook.userEmail)
    console.log("[v0] Cook created successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error creating cook:", error)
    throw error
  }
}

export async function addEvent(event: Event): Promise<void> {
  try {
    console.log("[v0] Creating event in Supabase:", event.id)
    await createEvent(event)
    console.log("[v0] Event created successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    throw error
  }
}

export async function addCollaborationRequest(request: CollaborationRequest): Promise<void> {
  try {
    console.log("[v0] Creating collaboration request in Supabase:", request.id)
    await createCollaborationRequest(request)
    console.log("[v0] Collaboration request created successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error creating collaboration request:", error)
    throw error
  }
}

export async function addSeatRequest(request: SeatRequest): Promise<void> {
  try {
    console.log("[v0] Creating seat request in Supabase:", request.id)
    await createSeatRequest(request)
    console.log("[v0] Seat request created successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error creating seat request:", error)
    throw error
  }
}

export async function updateEventSeats(eventId: string, seatsLeft: number): Promise<void> {
  try {
    await updateEventSeatsLeft(eventId, seatsLeft)
  } catch (error) {
    console.error("[v0] Error updating event seats:", error)
    throw error
  }
}

export async function assignCookToEvent(eventId: string, cookId: string | null): Promise<void> {
  try {
    await updateEventCook(eventId, cookId)
  } catch (error) {
    console.error("[v0] Error assigning cook to event:", error)
    throw error
  }
}

export async function updateCollaborationStatus(
  requestId: string,
  status: "pending" | "accepted" | "declined",
): Promise<void> {
  try {
    await updateCollaborationRequestStatus(requestId, status)
  } catch (error) {
    console.error("[v0] Error updating collaboration status:", error)
    throw error
  }
}

export async function updateSeatRequestStatus(
  requestId: string,
  status: "pending" | "approved" | "declined" | "waitlist",
): Promise<void> {
  try {
    await updateSeatRequestStatusFunc(requestId, status)
  } catch (error) {
    console.error("[v0] Error updating seat request status:", error)
    throw error
  }
}

// New function to get user-specific data
export async function getUserData(userEmail: string): Promise<{ hosts: Host[]; cooks: Cook[] }> {
  try {
    console.log("[v0] Fetching user data for:", userEmail)

    const [hostsPage, cooksPage] = await Promise.all([
      listHostsByUserEmail(userEmail, 0, 100),
      listCooksByUserEmail(userEmail, 0, 100),
    ])

    console.log("[v0] User data fetched:", {
      hosts: hostsPage.items.length,
      cooks: cooksPage.items.length,
    })

    return {
      hosts: hostsPage.items,
      cooks: cooksPage.items,
    }
  } catch (error) {
    console.error("[v0] Error fetching user data:", error)
    return { hosts: [], cooks: [] }
  }
}

export async function getCooksData(userEmail: string): Promise<{
  cooks: Cook[]
  hosts: Host[]
  events: Event[]
  collaborationRequests: CollaborationRequest[]
}> {
  try {
    console.log("[v0] Fetching cooks data for:", userEmail)

    // Fetch user's cooks and other data in parallel
    const [cooksPage, eventsPage, collaborationRequestsPage] = await Promise.all([
      listCooksByUserEmail(userEmail, 0, 100),
      listEvents(0, 1000),
      listCollaborationRequests(0, 1000),
    ])

    // Fetch hosts separately with error handling for timeouts
    let hosts: Host[] = []
    try {
      const hostsPage = await listHosts(0, 1000)
      hosts = hostsPage.items
    } catch (error) {
      console.error("[v0] Error fetching hosts (timeout), using empty array:", error)
      hosts = []
    }

    const data = {
      cooks: cooksPage.items,
      hosts,
      events: eventsPage.items,
      collaborationRequests: collaborationRequestsPage.items,
    }

    console.log("[v0] Cooks data fetched:", {
      cooks: data.cooks.length,
      hosts: data.hosts.length,
      events: data.events.length,
      collaborationRequests: data.collaborationRequests.length,
    })

    return data
  } catch (error) {
    console.error("[v0] Error fetching cooks data:", error)
    return { cooks: [], hosts: [], events: [], collaborationRequests: [] }
  }
}

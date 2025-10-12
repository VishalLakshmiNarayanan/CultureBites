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

    // Fetch all data from Supabase in parallel
    const [hostsPage, cooksPage, eventsPage, collaborationRequestsPage, seatRequestsPage] = await Promise.all([
      listHosts(0, 1000), // Fetch up to 1000 items
      listCooks(0, 1000),
      listEvents(0, 1000),
      listCollaborationRequests(0, 1000),
      listSeatRequests(0, 1000),
    ])

    const data: AppData = {
      hosts: hostsPage.items,
      cooks: cooksPage.items,
      events: eventsPage.items,
      collaborationRequests: collaborationRequestsPage.items,
      seatRequests: seatRequestsPage.items,
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
    await createHost(host)
    console.log("[v0] Host created successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error creating host:", error)
    throw error
  }
}

export async function addCook(cook: Cook): Promise<void> {
  try {
    console.log("[v0] Creating cook in Supabase:", cook.id)
    await createCook(cook)
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

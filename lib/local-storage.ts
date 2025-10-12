import type { AppData } from "@/lib/types"

const STORAGE_KEY = "culturebites-app-data"

// Initialize with empty data structure
const defaultData: AppData = {
  events: [],
  hosts: [],
  cooks: [],
  collaborationRequests: [],
  seatRequests: [],
}

export function getAppData(): AppData {
  if (typeof window === "undefined") {
    return defaultData
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return defaultData
    }
    const parsed = JSON.parse(stored)

    // Ensure all arrays exist
    return {
      events: parsed.events || [],
      hosts: parsed.hosts || [],
      cooks: parsed.cooks || [],
      collaborationRequests: parsed.collaborationRequests || [],
      seatRequests: parsed.seatRequests || [],
    }
  } catch (error) {
    console.error("[v0] Error reading from localStorage:", error)
    return defaultData
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log("[v0] Data saved to localStorage:", {
      hosts: data.hosts.length,
      cooks: data.cooks.length,
      events: data.events.length,
      collaborationRequests: data.collaborationRequests.length,
      seatRequests: data.seatRequests.length,
    })
  } catch (error) {
    console.error("[v0] Error saving to localStorage:", error)
  }
}

export function resetAppData(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("[v0] localStorage cleared")
  } catch (error) {
    console.error("[v0] Error clearing localStorage:", error)
  }
}

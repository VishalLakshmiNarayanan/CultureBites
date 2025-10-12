import type { AppData } from "@/lib/types"
import { initialData } from "@/data/mock"

const STORAGE_KEY = "foodconnect-data"

// In-memory fallback for SSR
let memoryStore: AppData | null = null

export function getAppData(): AppData {
  // During SSR, use memory store
  if (typeof window === "undefined") {
    if (!memoryStore) {
      memoryStore = JSON.parse(JSON.stringify(initialData))
    }
    return memoryStore
  }

  // Client-side: check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Failed to read from localStorage:", error)
  }

  // First load: initialize with seed data
  const data = JSON.parse(JSON.stringify(initialData))
  saveAppData(data)
  return data
}

export function saveAppData(data: AppData): void {
  // Update memory store
  memoryStore = data

  // Save to localStorage (client-side only)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("[v0] Failed to write to localStorage:", error)
    }
  }
}

export function resetAppData(): void {
  const fresh = JSON.parse(JSON.stringify(initialData))
  saveAppData(fresh)
}

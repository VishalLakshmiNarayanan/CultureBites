export type Event = {
  id: string
  title: string
  cuisine: string
  hostId: string
  cookId?: string
  dateISO: string
  startTime: string
  endTime: string
  location: string
  images: string[] // Changed from imageQueries to actual image URLs
  seatsTotal: number
  seatsLeft: number
}

export type Host = {
  id: string
  name: string
  profileImage?: string // Added profileImage for host avatar
  spaceTitle: string
  spaceDesc: string
  location: string
  capacity: number
  photos: string[]
  userEmail?: string // Added userEmail to link host to authenticated user
}

export type Cook = {
  id: string
  name: string
  profileImage?: string // Renamed avatar to profileImage for consistency
  originCountry: string
  specialties: string[]
  story: string
  cuisineImages: string[]
  userEmail?: string // Added userEmail to link cook to authenticated user
}

export type CollaborationRequest = {
  id: string
  fromCookId: string
  toHostId: string
  eventId?: string // Added eventId to link collaboration to specific event
  message: string
  proposedDishes: string[]
  status: "pending" | "accepted" | "declined"
  createdAtISO: string
}

export type SeatRequest = {
  id: string
  eventId: string
  guestName: string
  note?: string
  createdAtISO: string
  status: "pending" | "approved" | "waitlist" | "declined"
}

export type AppData = {
  events: Event[]
  hosts: Host[]
  cooks: Cook[]
  collaborationRequests: CollaborationRequest[]
  seatRequests: SeatRequest[]
}

export type UserRole = "user" | "host" | "cook"

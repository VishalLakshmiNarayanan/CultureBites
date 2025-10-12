"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Profile, Contact } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CookDashboardProps {
  profile: Profile
}

export default function CookDashboard({ profile }: CookDashboardProps) {
  const [hosts, setHosts] = useState<Profile[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHost, setSelectedHost] = useState<Profile | null>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchHosts()
    fetchContacts()
  }, [])

  const fetchHosts = async () => {
    const supabase = createClient()
    setIsLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "host")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setHosts(data)
    }
    setIsLoading(false)
  }

  const fetchContacts = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setContacts(data)
    }
  }

  const handleContactHost = async () => {
    if (!selectedHost || !message.trim()) return

    const supabase = createClient()
    setIsSending(true)

    try {
      const { error } = await supabase.from("contacts").insert({
        sender_id: profile.id,
        recipient_id: selectedHost.id,
        message: message.trim(),
        status: "pending",
      })

      if (error) throw error

      setMessage("")
      setSelectedHost(null)
      fetchContacts()
      alert("Message sent successfully!")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const filteredHosts = hosts.filter(
    (host) =>
      host.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.space_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sentContacts = contacts.filter((c) => c.sender_id === profile.id)
  const receivedContacts = contacts.filter((c) => c.recipient_id === profile.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <DashboardNav profile={profile} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Chef Dashboard</h1>
          <p className="text-muted-foreground">Discover venues and connect with hosts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Hosts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hosts.length}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sentContacts.length}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Responses Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{receivedContacts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search hosts by name, location, or space type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-white/80"
          />
        </div>

        {/* Hosts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Discover Hosts</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse backdrop-blur-sm bg-white/80">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredHosts.length === 0 ? (
            <Card className="p-12 text-center backdrop-blur-sm bg-white/80">
              <p className="text-muted-foreground">No hosts found matching your search</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHosts.map((host) => (
                <Card key={host.id} className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{host.display_name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{host.location || "Location not specified"}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {host.space_type && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>🏠</span>
                          <span className="font-medium">{host.space_type}</span>
                        </div>
                      )}
                      {host.space_capacity && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>👥</span>
                          <span>Capacity: {host.space_capacity} guests</span>
                        </div>
                      )}
                      {host.space_amenities && host.space_amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {host.space_amenities.slice(0, 3).map((amenity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {host.bio && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{host.bio}</p>}
                      <Button
                        onClick={() => setSelectedHost(host)}
                        className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                      >
                        Contact Host
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact History */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact History</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sent Messages */}
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle>Sent Messages</CardTitle>
                <CardDescription>Messages you've sent to hosts</CardDescription>
              </CardHeader>
              <CardContent>
                {sentContacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No messages sent yet</p>
                ) : (
                  <div className="space-y-4">
                    {sentContacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="border-b pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">To: Host</span>
                          <Badge
                            variant={
                              contact.status === "accepted"
                                ? "default"
                                : contact.status === "declined"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {contact.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Received Messages */}
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle>Received Messages</CardTitle>
                <CardDescription>Messages from hosts</CardDescription>
              </CardHeader>
              <CardContent>
                {receivedContacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No messages received yet</p>
                ) : (
                  <div className="space-y-4">
                    {receivedContacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="border-b pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">From: Host</span>
                          <Badge
                            variant={
                              contact.status === "accepted"
                                ? "default"
                                : contact.status === "declined"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {contact.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={!!selectedHost} onOpenChange={(open) => !open && setSelectedHost(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedHost?.display_name}</DialogTitle>
            <DialogDescription>
              Send a message to introduce yourself and discuss collaboration opportunities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Hi! I'm interested in hosting an event at your space..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedHost(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleContactHost}
                disabled={isSending || !message.trim()}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { GlassCard } from "@/components/glass-card"
import { Users, Home, ChefHat } from "lucide-react"

export function GuideTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          How CultureBites Works
        </h1>
        <p className="text-lg text-white max-w-3xl mx-auto">
          Welcome to CultureBites! Whether you're looking to experience authentic cuisines, share your culinary space,
          or showcase your cooking talents, we've made it simple for everyone.
        </p>
      </div>

      {/* For Guests Section */}
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500 rounded-full">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">For Guests</h2>
        </div>

        <p className="text-gray-900 mb-6 text-lg">
          Discover and attend authentic cultural dining experiences in your area.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Browse Events</h3>
              <p className="text-gray-900">
                Go to the <strong>Guests</strong> tab and explore available dining events. Use the search bar to find
                specific cuisines (like "Mexican" or "Indian"), or click the <strong>Surprise Me</strong> button to
                discover something new!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Filter by Date</h3>
              <p className="text-gray-900">
                Use the calendar icon to filter events by specific dates. This helps you find experiences that fit your
                schedule.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">View Event Details</h3>
              <p className="text-gray-900">
                Click on any event card to flip it and see full details including the host's space, the cook's story,
                menu items, date, time, location, and available seats.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Request a Seat</h3>
              <p className="text-gray-900">
                Found an event you love? Click the <strong>Request Seat</strong> button on the event card. The host will
                review your request and confirm your attendance.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* For Hosts Section */}
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500 rounded-full">
            <Home className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">For Hosts</h2>
        </div>

        <p className="text-gray-900 mb-6 text-lg">
          Share your space and bring people together through cultural dining experiences.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Create Your Host Profile</h3>
              <p className="text-gray-900">
                Go to the <strong>Hosts</strong> tab and click <strong>Create Host Profile</strong>. Fill in your space
                name, location, capacity, and upload photos of your venue. You can create multiple host profiles if you
                have different spaces!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Browse Cooks</h3>
              <p className="text-gray-900">
                Scroll down to the <strong>Browse Cooks</strong> section to see all available cooks. View their
                profiles, specialties, stories, and dishes. Click <strong>Request Collaboration</strong> to invite a
                cook to your space.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Create Events</h3>
              <p className="text-gray-900">
                Once a cook accepts your collaboration request, you can create events together! Set the date, time,
                menu, and number of seats. Your event will appear in the Guests tab for people to discover.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Manage Requests</h3>
              <p className="text-gray-900">
                Check your <strong>Connections Inbox</strong> to see collaboration requests from cooks and seat requests
                from guests. Accept or decline based on your availability and preferences.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* For Cooks Section */}
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500 rounded-full">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">For Cooks</h2>
        </div>

        <p className="text-gray-900 mb-6 text-lg">
          Share your culinary heritage and connect with hosts to create memorable dining experiences.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Create Your Cook Profile</h3>
              <p className="text-gray-900">
                Go to the <strong>Cooks</strong> tab and click <strong>Create Cook Profile</strong>. Share your name,
                country of origin, specialties, your story about why you cook, and upload photos of your signature
                dishes. You can create multiple cook profiles for different cuisines!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Browse Host Spaces</h3>
              <p className="text-gray-900">
                Scroll down to see all available host spaces. View their locations, capacity, and venue photos. Click{" "}
                <strong>Request Collaboration</strong> to propose cooking at their space.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Collaborate on Events</h3>
              <p className="text-gray-900">
                When a host accepts your collaboration request (or you accept theirs), work together to create events.
                Your dishes and story will be featured to guests looking for authentic cultural experiences.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Manage Your Connections</h3>
              <p className="text-gray-900">
                Check <strong>My Connections</strong> to see collaboration requests from hosts. Accept opportunities
                that align with your schedule and culinary vision.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tips Section */}
      <GlassCard className="p-8 bg-gradient-to-br from-orange-50 to-amber-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Helpful Tips</h2>
        <ul className="space-y-3 text-gray-900">
          <li className="flex gap-3">
            <span className="text-orange-500">•</span>
            <span>
              <strong>Profile Pictures:</strong> Upload clear photos to make your profiles more appealing and
              trustworthy.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500">•</span>
            <span>
              <strong>Be Descriptive:</strong> The more details you share in your profiles and events, the better
              connections you'll make.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500">•</span>
            <span>
              <strong>Safe Space:</strong> Remember our Safe Space Pledge in the Terms & Conditions - respect,
              inclusion, and kindness are our foundation.
            </span>
          </li>
        </ul>
      </GlassCard>
    </div>
  )
}

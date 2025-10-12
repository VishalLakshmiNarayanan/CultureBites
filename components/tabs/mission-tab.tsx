"use client"

import { GlassCard } from "@/components/glass-card"

export function MissionTab() {
  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <div className="space-y-8 text-gray-900">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              About Us — Culture Bites
            </h1>
          </div>

          {/* Who We Are */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
            <p className="text-gray-900 leading-relaxed">
              We are Culture Bites, a community platform built on one simple idea: people bond best over food. In an age
              where screens often replace real conversations, we invite everyone to step back to the table — to meet,
              greet, eat, and repeat.
            </p>
          </section>

          {/* Our Aim */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Our Aim</h2>
            <p className="text-gray-900 leading-relaxed">
              Our goal is to bridge cultures through shared meals and meaningful stories. We connect immigrants, locals,
              and food enthusiasts who want more than just a plate of food — they want connection, understanding, and
              belonging. Every dinner hosted on Culture Bites is a small act of humanity — a chance to see the world
              through someone else's recipe.
            </p>
          </section>

          {/* Our Mission */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-900 leading-relaxed mb-3">To use the universal language of food to:</p>
            <ul className="space-y-2 text-gray-900 list-none pl-4">
              <li className="flex items-start gap-2">
                <span className="text-gray-900 mt-1">•</span>
                <span>Foster genuine human interaction between people of different backgrounds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 mt-1">•</span>
                <span>Empower cooks to share their culture and stories with pride.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 mt-1">•</span>
                <span>Encourage hosts to open their homes as spaces of empathy and inclusion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 mt-1">•</span>
                <span>Inspire guests to experience the world through flavor, friendship, and curiosity.</span>
              </li>
            </ul>
            <p className="text-gray-900 leading-relaxed mt-3 italic">
              Culture Bites transforms a simple meal into an exchange of identity, memory, and kindness.
            </p>
          </section>

          {/* Our Values */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Our Values — Rooted in Humanity 101</h2>
            <p className="text-gray-900 leading-relaxed mb-3">
              Culture Bites is inspired by the Humanity 101 principles of Compassion, Empathy, Kindness, and Respect.
            </p>
            <div className="space-y-3 pl-4">
              <div>
                <span className="font-semibold text-gray-900">Compassion:</span>
                <span className="text-gray-900">
                  {" "}
                  We care for those far from home and create spaces that feel like family.
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Empathy:</span>
                <span className="text-gray-900">
                  {" "}
                  We listen to stories behind every dish and learn from each culture we meet.
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Kindness:</span>
                <span className="text-gray-900">
                  {" "}
                  Our cooks and hosts give a piece of themselves through every shared meal.
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Respect:</span>
                <span className="text-gray-900">
                  {" "}
                  Every culture, accent, and ingredient is treated with dignity and curiosity.
                </span>
              </div>
            </div>
            <p className="text-gray-900 leading-relaxed mt-3 italic">
              These values guide every interaction — from the first message to the final shared bite.
            </p>
          </section>

          {/* Our Pledge */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Our Pledge</h2>
            <p className="text-gray-900 leading-relaxed">
              Culture Bites follows the Safe Space and Humanities 101 Pledge: to create inclusive, judgment-free
              environments where everyone feels welcome. We celebrate diversity, protect privacy, and promote active
              listening, ensuring every gathering becomes a moment of reflection, warmth, and growth.
            </p>
          </section>

          {/* Our Vision */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-gray-900 leading-relaxed">
              To build a world where food reconnects humanity — one shared meal, one story, one friendship at a time.
            </p>
            <p className="text-center text-xl font-semibold text-gray-900 mt-4">
              Culture Bites — Meet. Greet. Eat. Repeat.
            </p>
          </section>
        </div>
      </GlassCard>
    </div>
  )
}

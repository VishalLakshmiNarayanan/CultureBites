import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { interests, events } = await request.json()

    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      // Fallback to local scoring
      const scored = events.map((event: any) => {
        let score = 0

        // Tag overlap scoring
        if (interests && interests.length > 0) {
          const interestLower = interests.map((i: string) => i.toLowerCase())
          if (interestLower.includes(event.cuisine.toLowerCase())) {
            score += 10
          }
        }

        // Soonest date boost
        const daysUntil = Math.floor((new Date(event.dateISO).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntil >= 0 && daysUntil <= 7) {
          score += 5
        } else if (daysUntil > 7 && daysUntil <= 14) {
          score += 3
        }

        // Seats availability
        if (event.seatsLeft > 0) {
          score += 2
        }

        return { ...event, score }
      })

      // Sort by score descending
      scored.sort((a: any, b: any) => b.score - a.score)

      return NextResponse.json({
        recommendations: scored.slice(0, 5).map((e: any) => ({
          id: e.id,
          reason: `This ${e.cuisine} event matches your interests and is coming up soon.`,
        })),
      })
    }

    // Use Groq for AI-powered recommendations
    const eventDescriptions = events
      .map(
        (e: any) =>
          `ID: ${e.id}, Title: ${e.title}, Cuisine: ${e.cuisine}, Date: ${e.dateISO}, Seats: ${e.seatsLeft}/${e.seatsTotal}`,
      )
      .join("\n")

    const prompt = `You are a food event recommendation assistant. Based on the user's interests: ${interests.join(", ")}, recommend the top 3-5 events from this list and explain why each is a good match.

Events:
${eventDescriptions}

Respond in JSON format:
{
  "recommendations": [
    { "id": "event-id", "reason": "brief explanation" }
  ]
}`

    const { text } = await generateText({
      model: "groq/llama-3.3-70b-versatile",
      prompt,
      temperature: 0.7,
    })

    // Parse the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return NextResponse.json(parsed)
    }

    // Fallback if parsing fails
    return NextResponse.json({
      recommendations: events.slice(0, 3).map((e: any) => ({
        id: e.id,
        reason: "Recommended based on your interests",
      })),
    })
  } catch (error) {
    console.error("[v0] Recommendation error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

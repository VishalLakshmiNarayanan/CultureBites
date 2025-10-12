import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, preferences } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    // Fetch available events
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("date", { ascending: true })
      .limit(50)

    if (!events || events.length === 0) {
      return NextResponse.json({ recommendations: [], message: "No events available" })
    }

    // Build context for AI
    const userContext = `
User Profile:
- Location: ${profile?.location || "Not specified"}
- Preferences: ${preferences || "General dining experiences"}

Available Events:
${events
  .map(
    (e, idx) => `
${idx + 1}. ${e.title}
   - Cuisine: ${e.cuisine_type}
   - Location: ${e.location}
   - Date: ${e.date}
   - Price: $${e.price_per_person}
   - Description: ${e.description}
`,
  )
  .join("\n")}
`

    // Generate AI recommendations using Groq
    const { text } = await generateText({
      model: "groq/llama-3.3-70b-versatile",
      prompt: `You are a culinary experience advisor. Based on the user's profile and available events, recommend the top 3 events that would be the best fit.

${userContext}

Provide your recommendations in the following JSON format:
{
  "recommendations": [
    {
      "eventIndex": <number>,
      "reason": "<brief explanation why this event is recommended>"
    }
  ]
}

Only recommend events that exist in the list. Be concise and personalized.`,
    })

    // Parse AI response
    let aiRecommendations
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiRecommendations = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error("[v0] Error parsing AI response:", parseError)
    }

    // Map recommendations to actual events
    const recommendedEvents =
      aiRecommendations?.recommendations?.map((rec: { eventIndex: number; reason: string }) => ({
        event: events[rec.eventIndex - 1],
        reason: rec.reason,
      })) || []

    return NextResponse.json({
      recommendations: recommendedEvents,
      message: "Recommendations generated successfully",
    })
  } catch (error) {
    console.error("[v0] Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

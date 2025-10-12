import { NextResponse } from "next/server"

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "demo-key"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "food"
    const perPage = searchParams.get("per_page") || "15"

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels")
    }

    const data = await response.json()

    return NextResponse.json({
      photos: data.photos.map(
        (photo: { id: number; src: { medium: string; large: string }; photographer: string }) => ({
          id: photo.id,
          url: photo.src.medium,
          largeUrl: photo.src.large,
          photographer: photo.photographer,
        }),
      ),
    })
  } catch (error) {
    console.error("[v0] Error fetching from Pexels:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

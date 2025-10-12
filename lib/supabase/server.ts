import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key: string) => {
            const cookie = cookieStore.get(key)
            return cookie?.value
          },
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set(key, value, {
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
              })
            } catch (error) {
              // Handle error silently - might be called from Server Component
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.delete(key)
            } catch (error) {
              // Handle error silently
            }
          },
        },
      },
    },
  )

  return supabase
}

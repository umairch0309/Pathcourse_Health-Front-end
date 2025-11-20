// lib/session.ts

import { headers } from "next/headers"
import { cache } from "react"
import auth from "@/lib/auth"

export const getCachedSession = cache(async () => {
  try {
    const headersList = await headers()
    
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const session = await auth.getSession({
        fetchOptions: {
          headers: headersList,
          signal: controller.signal,
        },
      })
      clearTimeout(timeoutId)
      return session
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    // If fetch fails (backend unavailable, network error, timeout, etc.), return empty session
    console.error("Failed to get session:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch session",
    }
  }
})
// lib/session.ts

import { headers } from "next/headers"
import { cache } from "react"
import auth from "@/lib/auth"

export const getCachedSession = cache(async () => {
  const headersList = await headers()
  return auth.getSession({
    fetchOptions: {
      headers: headersList,
    },
  })
})
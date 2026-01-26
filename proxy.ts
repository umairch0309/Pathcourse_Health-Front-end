import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Clone the request headers and set x-pathname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)
  requestHeaders.set("x-url", request.url)

  // Return early for static files and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Continue with modified headers for all other routes
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

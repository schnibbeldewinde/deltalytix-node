import { type NextRequest, NextResponse } from "next/server"
export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isServerAction =
    req.headers.get("next-action") ||
    req.headers.get("rsc-action") ||
    req.nextUrl.searchParams.has("__nextAction")

  // Let server actions pass through untouched
  if (isServerAction) {
    return NextResponse.next()
  }

  // Root redirect to auth (English only)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en/authentication", req.url))
  }
  if (pathname === "/en") {
    return NextResponse.redirect(new URL("/en/authentication", req.url))
  }

  // Let all other requests pass through unmodified
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - opengraph-image (Open Graph image generation)
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|api|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|mp4|webm|gif|html|webp)$).*)",
  ],
}

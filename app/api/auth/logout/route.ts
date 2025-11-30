import { NextResponse } from "next/server"

const SESSION_COOKIE_NAME = "deltalytix_session"

export async function POST() {
  const res = NextResponse.json({ success: true })
  // Expire the session cookie
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
  return res
}

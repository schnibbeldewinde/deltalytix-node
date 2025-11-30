import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SESSION_COOKIE_NAME = 'deltalytix_session'

export async function GET(request: Request) {
  const authSecret = process.env.AUTH_SECRET || 'change-me'
  const cookieHeader = request.headers.get('cookie') || ''
  const token = cookieHeader
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split('=')[1]

  if (!token) {
    return NextResponse.json({ user: null, session: null }, { status: 200 })
  }

  try {
    const decoded = jwt.verify(token, authSecret) as Record<string, unknown> | string
    if (typeof decoded !== 'object' || !decoded) {
      return NextResponse.json({ user: null, session: null }, { status: 401 })
    }

    const sub = decoded.sub as string | undefined
    const email = decoded.email as string | undefined
    if (!sub || !email) {
      return NextResponse.json({ user: null, session: null }, { status: 401 })
    }

    const session = {
      user: { id: sub, email },
      issuedAt: decoded.iat ? new Date((decoded.iat as number) * 1000) : null,
      expiresAt: decoded.exp ? new Date((decoded.exp as number) * 1000) : null,
      token,
    }

    return NextResponse.json({ user: session.user, session })
  } catch (error) {
    console.warn('[auth/session] invalid token', error)
    return NextResponse.json({ user: null, session: null, error: 'INVALID_TOKEN' }, { status: 401 })
  }
}

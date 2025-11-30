import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const SESSION_COOKIE_NAME = 'deltalytix_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
const JWT_SECRET = process.env.AUTH_SECRET || 'change-me'
const cookieSecure =
  process.env.COOKIE_SECURE === 'true'
    ? true
    : process.env.COOKIE_SECURE === 'false'
      ? false
      : process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_URL

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    const issuedAt = Math.floor(Date.now() / 1000)
    const token = jwt.sign(
      { sub: user.id, email: user.email, iat: issuedAt },
      JWT_SECRET,
      { expiresIn: SESSION_TTL_SECONDS }
    )
    const expiresAt = new Date((issuedAt + SESSION_TTL_SECONDS) * 1000)

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    })
    return res
  } catch (error) {
    console.error('[api/auth/login] error', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

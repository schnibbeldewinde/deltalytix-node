import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

const SESSION_COOKIE_NAME = 'deltalytix_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
const JWT_SECRET = process.env.AUTH_SECRET || 'change-me'
const cookieSecure: boolean =
  process.env.COOKIE_SECURE === 'true'
    ? true
    : process.env.COOKIE_SECURE === 'false'
      ? false
      : !!(process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_URL)

export async function POST(req: Request) {
  try {
    const { email, password, locale } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'ACCOUNT_EXISTS' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const userId = randomBytes(12).toString('hex')
    const user = await prisma.user.create({
      data: {
        id: userId,
        auth_user_id: userId,
        email,
        passwordHash,
        language: locale || 'en',
      },
    })

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
    console.error('[api/auth/signup] error', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

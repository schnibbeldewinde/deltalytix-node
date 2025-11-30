'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { AuthSession, AuthUser } from '@/types/auth'

const SESSION_COOKIE_NAME = 'deltalytix_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
const JWT_SECRET = process.env.AUTH_SECRET || 'change-me'
const cookieSecure: boolean =
  process.env.COOKIE_SECURE === 'true'
    ? true
    : process.env.COOKIE_SECURE === 'false'
      ? false
      : !!(process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_URL)

function toAuthUser(user: { id: string; email: string; language?: string; isFirstConnection?: boolean }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.email?.split('@')[0] || null,
  }
}

function signToken(user: AuthUser) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      iat: issuedAt,
    },
    JWT_SECRET,
    { expiresIn: SESSION_TTL_SECONDS }
  )

  const expiresAt = new Date((issuedAt + SESSION_TTL_SECONDS) * 1000)
  return {
    token,
    issuedAt: new Date(issuedAt * 1000),
    expiresAt,
  }
}

function decodeToken(token: string): AuthSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown> | string
    if (typeof decoded !== 'object' || !decoded) return null
    const sub = decoded.sub as string | undefined
    const email = decoded.email as string | undefined
    if (!sub || !email) return null
    return {
      user: { id: sub, email },
      issuedAt: decoded.iat ? new Date((decoded.iat as number) * 1000) : new Date(),
      expiresAt: decoded.exp ? new Date((decoded.exp as number) * 1000) : new Date(Date.now() + SESSION_TTL_SECONDS * 1000),
      token,
    }
  } catch (error) {
    console.warn('[auth] decodeToken failed', error)
    return null
  }
}

async function getCookieStore() {
  return await cookies()
}

async function persistSession(user: AuthUser): Promise<AuthSession> {
  const { token, expiresAt, issuedAt } = signToken(user)
  const cookieStore: any = await getCookieStore()
  if (cookieStore?.set) {
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    })
  } else {
    console.warn('[auth] cookies.set not available in this context; session cookie not set')
  }

  return {
    user,
    token,
    issuedAt,
    expiresAt,
  }
}

async function clearSessionCookie() {
  const cookieStore: any = await getCookieStore()
  if (cookieStore?.delete) {
    cookieStore.delete(SESSION_COOKIE_NAME)
  } else {
    // fallback: cannot clear, ignore
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore: any = await getCookieStore()
  let token: string | undefined

  if (cookieStore?.get) {
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  } else if (Array.isArray(cookieStore)) {
    const found = cookieStore.find((c: any) => c.name === SESSION_COOKIE_NAME)
    token = found?.value
  }

  if (!token) return null
  return decodeToken(token)
}

// Compatibility helper for legacy calls expecting a Supabase-like client
export async function createClient() {
  const session = await getSession()
  return {
    auth: {
      async getUser() {
        return {
          data: { user: session?.user ?? null },
          error: session?.user ? null : new Error('User not authenticated'),
        }
      },
      async getSession() {
        return { data: { session }, error: null }
      },
    },
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession()
  if (!session) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return null
  return toAuthUser(user)
}

export async function signUpWithPasswordAction(
  email: string,
  password: string,
  _next: string | null = null,
  locale?: string
) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('ACCOUNT_EXISTS: Ein Nutzer mit dieser E-Mail existiert bereits.')
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const userId = randomBytes(12).toString('hex') // valid Mongo ObjectId hex
  const user = await prisma.user.create({
    data: {
      id: userId,
      auth_user_id: userId,
      email,
      passwordHash,
      language: locale || 'en',
    },
  })

  await persistSession(toAuthUser(user))
  return { success: true }
}

export async function signInWithPasswordAction(
  email: string,
  password: string,
  next: string | null = null,
  _locale?: string
) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) {
    throw new Error('INVALID_CREDENTIALS: Ungültige Zugangsdaten.')
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS: Ungültige Zugangsdaten.')
  }

  await persistSession(toAuthUser(user))

  if (next) {
    redirect(next)
  }

  return { success: true, next }
}

export async function signOut() {
  clearSessionCookie()
  redirect('/')
}

export async function setPasswordAction(newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }
  const session = await getSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  })
  return { updated: true }
}

export async function getUserId(): Promise<string> {
  const session = await getSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return session.user.id
}

export async function updateUserLanguage(locale: string): Promise<{ updated: boolean }> {
  const allowedLocales = new Set(['en', 'fr', 'de', 'es', 'it', 'pt', 'vi', 'hi', 'ja', 'zh', 'yo'])
  if (!allowedLocales.has(locale)) {
    return { updated: false }
  }

  const session = await getSession()
  if (!session?.user?.id) {
    return { updated: false }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { language: locale },
  })
  return { updated: true }
}

export async function getUserEmail(): Promise<string> {
  const session = await getSession()
  return session?.user?.email || ''
}

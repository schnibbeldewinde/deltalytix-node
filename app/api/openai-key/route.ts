import { NextResponse } from 'next/server'
import { getUserId } from '@/server/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userId = await getUserId()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { openaiApiKey: true },
    })
    return NextResponse.json({ openaiApiKey: user?.openaiApiKey || '' })
  } catch (e) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    const body = await req.json().catch(() => ({}))
    const key = typeof body.key === 'string' ? body.key.trim() : ''

    await prisma.user.update({
      where: { id: userId },
      data: { openaiApiKey: key || null },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
}

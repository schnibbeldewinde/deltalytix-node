import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/server/auth'

export async function GET() {
  const userId = await getUserId()
  const [trades, tickDetails] = await Promise.all([
    prisma.trade.findMany({ where: { userId } }),
    prisma.tickDetails.findMany(),
  ])

  const snapshot = {
    version: 1,
    createdAt: new Date().toISOString(),
    userId,
    trades,
    tickDetails,
  }

  return NextResponse.json({ snapshot: JSON.stringify(snapshot, null, 2) })
}

export async function POST(req: Request) {
  const userId = await getUserId()
  const body = await req.json().catch(() => ({}))
  const snapshotString = body.snapshot

  if (!snapshotString) {
    return NextResponse.json({ error: 'No snapshot provided' }, { status: 400 })
  }

  let snapshot: any
  try {
    snapshot = JSON.parse(snapshotString)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid backup file' }, { status: 400 })
  }

  const trades = Array.isArray(snapshot.trades) ? snapshot.trades : []
  const tickDetails = Array.isArray(snapshot.tickDetails) ? snapshot.tickDetails : []

  // Clear data
  await prisma.trade.deleteMany({ where: { userId } })
  await prisma.tickDetails.deleteMany({})

  let restoredTrades = 0
  if (trades.length) {
    const normalized = trades.map((t: any) => ({ ...t, userId }))
    const res = await prisma.trade.createMany({ data: normalized })
    restoredTrades = res.count
  }

  let restoredTickDetails = 0
  if (tickDetails.length) {
    const res = await prisma.tickDetails.createMany({ data: tickDetails })
    restoredTickDetails = res.count
  }

  return NextResponse.json({ restoredTrades, restoredTickDetails })
}

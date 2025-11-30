import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/server/auth'

export async function POST() {
  const userId = await getUserId()
  const trades = await prisma.trade.findMany({
    where: { userId },
    select: {
      id: true,
      instrument: true,
      entryDate: true,
      closeDate: true,
      side: true,
      quantity: true,
      entryPrice: true,
      closePrice: true,
    },
  })

  const seen = new Set<string>()
  const toDelete: string[] = []
  for (const t of trades) {
    const key = [
      t.instrument,
      t.entryDate,
      t.closeDate,
      t.side ?? '',
      t.quantity,
      t.entryPrice,
      t.closePrice,
    ].join('|')
    if (seen.has(key)) {
      toDelete.push(t.id)
    } else {
      seen.add(key)
    }
  }

  if (toDelete.length) {
    await prisma.trade.deleteMany({ where: { id: { in: toDelete }, userId } })
  }

  return NextResponse.json({ removed: toDelete.length })
}

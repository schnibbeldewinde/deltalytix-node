import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Discord integration has been disabled." }, { status: 410 })
}

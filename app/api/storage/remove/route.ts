import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = await request.json()
  const bucket = body.bucket as string
  const paths = (body.paths as string[]) || []

  if (!bucket || paths.length === 0) {
    return NextResponse.json({ error: 'Bucket and paths are required' }, { status: 400 })
  }

  for (const relativePath of paths) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', bucket, relativePath)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      // ignore missing files
      console.warn(`[storage/remove] failed to remove ${filePath}`, error)
    }
  }

  return NextResponse.json({ success: true })
}

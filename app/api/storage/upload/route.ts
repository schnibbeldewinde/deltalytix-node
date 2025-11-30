import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  const bucket = formData.get('bucket')?.toString() || 'default'
  const targetPath = formData.get('path')?.toString()

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!targetPath) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', bucket)
  const fullPath = path.join(uploadDir, targetPath)

  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, buffer)

  const publicUrl = `/uploads/${bucket}/${targetPath}`.replace(/\\\\/g, '/').replace(/\/+/g, '/')

  return NextResponse.json({ path: `${bucket}/${targetPath}`, url: publicUrl })
}

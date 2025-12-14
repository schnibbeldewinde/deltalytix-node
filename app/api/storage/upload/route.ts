import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

const resolveBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.SITE_URL) return process.env.SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // Fallback to relative URLs so they survive tunnels/reverse proxies
  return ''
}

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

  const relativeUrl = `/uploads/${bucket}/${targetPath}`.replace(/\\\\/g, '/').replace(/\/+/g, '/')
  const baseUrl = resolveBaseUrl()
  const publicUrl = baseUrl ? new URL(relativeUrl, baseUrl).toString() : relativeUrl

  return NextResponse.json({ path: `${bucket}/${targetPath}`, url: publicUrl })
}

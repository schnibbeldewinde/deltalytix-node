import { NextResponse, type NextRequest } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export const dynamic = 'force-dynamic'

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

const sanitizePath = (parts: string[]) => {
  const joined = path.join(...parts)
  const normalized = path.normalize(joined)
  if (normalized.includes('..')) {
    throw new Error('Invalid path')
  }
  return normalized
}

export async function GET(_request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path: rawPath } = await context.params
    const safeRelativePath = sanitizePath(rawPath ?? [])
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeRelativePath)
    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    console.error('[uploads route] failed to serve file', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export { GET as HEAD }

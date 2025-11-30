type StorageResult<T> = { data: T | null; error: Error | null }

class LocalStorageBucket {
  constructor(private bucket: string) {}

  async upload(path: string, file: File | Blob, _options?: { cacheControl?: string; upsert?: boolean }): Promise<StorageResult<{ path: string; url: string }>> {
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', this.bucket)
      form.append('path', path)

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        return { data: null, error: new Error(await res.text()) }
      }

      const json = await res.json()
      return { data: json, error: null }
    } catch (error: any) {
      return { data: null, error: new Error(error?.message || 'Upload failed') }
    }
  }

  async remove(paths: string[]): Promise<StorageResult<null>> {
    try {
      const res = await fetch('/api/storage/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: this.bucket, paths }),
      })

      if (!res.ok) {
        return { data: null, error: new Error(await res.text()) }
      }

      return { data: null, error: null }
    } catch (error: any) {
      return { data: null, error: new Error(error?.message || 'Remove failed') }
    }
  }

  getPublicUrl(path: string) {
    return {
      data: { publicUrl: `/uploads/${this.bucket}/${path}` },
      error: null,
    }
  }
}

class LocalStorageClient {
  from(bucket: string) {
    return new LocalStorageBucket(bucket)
  }
}

class LocalAuthClient {
  async getUser() {
    const res = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!res.ok) {
      return { data: { user: null }, error: null }
    }
    const json = await res.json()
    return { data: { user: json.user }, error: null }
  }

  async getSession() {
    const res = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!res.ok) {
      return { data: { session: null }, error: null }
    }
    const json = await res.json()
    return { data: { session: json.session }, error: null }
  }

  onAuthStateChange(_callback: any) {
    return {
      data: {
        subscription: {
          unsubscribe() {},
        },
      },
    }
  }
}

export function createClient() {
  return {
    auth: new LocalAuthClient(),
    storage: new LocalStorageClient(),
  }
}

export const createBrowserClient = createClient

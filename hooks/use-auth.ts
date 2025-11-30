'use client'

import { createClient as createLocalClient } from '@/lib/supabase'

export function createClient() {
  return createLocalClient()
}

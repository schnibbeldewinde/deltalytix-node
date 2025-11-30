'use server'

import { prisma } from '@/lib/prisma'
import type { Subscription } from '@prisma/client'
import { getSession } from './auth'
import { AuthUser } from '@/types/auth'

export type UserProfileData = {
  supabaseUser: AuthUser | null
  subscription: Subscription | null
}

/**
 * Get user profile data including Supabase user and subscription.
 * This is a regular server action without caching - meant to be used
 * with Suspense boundaries for loading states.
 * 
 * Next.js will automatically handle request memoization during a single render.
 */
export async function getUserProfileAction(): Promise<UserProfileData> {
  const session = await getSession()

  if (!session?.user) {
    return {
      supabaseUser: null,
      subscription: null
    }
  }

  // Fetch subscription data if user exists
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  })

  return {
    supabaseUser: session.user,
    subscription
  }
}

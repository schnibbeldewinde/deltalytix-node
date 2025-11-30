'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { AuthSession } from '@/types/auth'
import { signOutClient } from '@/lib/client-auth'

interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  session: AuthSession | null
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  session: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<AuthSession | null>(null)
  const router = useRouter()

  useEffect(() => {
    const client = createClient()

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await client.auth.getSession()
        if (error) throw error
        setSession(initialSession)
      } catch (error) {
        console.error('Error checking session:', error)
        toast.error('Session Error', {
          description: 'Failed to check authentication status',
        })
        await signOutClient()
      } finally {
        setIsLoading(false)
      }
    }

    // Call initial session check
    checkSession()

    // Subscribe to auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(async () => {
      const { data } = await client.auth.getSession()
      setSession(data.session || null)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !!session,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 

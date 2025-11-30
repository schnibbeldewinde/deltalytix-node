import { create } from 'zustand'
import { SubscriptionWithPrice } from '@/app/[locale]/dashboard/actions/billing'

interface StripeSubscriptionStore {
  // Stripe subscription data (detailed billing info)
  stripeSubscription: SubscriptionWithPrice | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setStripeSubscription: (subscription: SubscriptionWithPrice | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSubscription: () => void
  refreshSubscription: () => Promise<void>
}

export const useStripeSubscriptionStore = create<StripeSubscriptionStore>()((set, get) => ({
  // Initial state
  stripeSubscription: null,
  isLoading: false,
  error: null,
  
  // Actions
  setStripeSubscription: (subscription) => set({ 
    stripeSubscription: subscription,
    error: null 
  }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearSubscription: () => set({ 
    stripeSubscription: null,
    error: null 
  }),
  
  refreshSubscription: async () => {
    set({ stripeSubscription: null, isLoading: false, error: null })
  }
}))

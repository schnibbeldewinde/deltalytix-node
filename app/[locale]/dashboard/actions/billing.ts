'use server'

export type SubscriptionWithPrice = {
  id: string
  status: string
  current_period_end?: number | null
  current_period_start?: number | null
  created?: number | null
  cancel_at_period_end?: boolean
  cancel_at?: number | null
  canceled_at?: number | null
  trial_end?: number | null
  trial_start?: number | null
  plan?: {
    id?: string
    name?: string
    amount?: number
    interval?: 'month' | 'quarter' | 'year' | 'lifetime'
  }
  promotion?: null
  invoices?: Array<{
    id: string
    amount_paid: number
    status: string
    created: number
    invoice_pdf: string | null
    hosted_invoice_url: string | null
  }>
} | null

export async function getSubscriptionData(): Promise<SubscriptionWithPrice> {
  return null
}

export async function refreshSubscriptionData(): Promise<SubscriptionWithPrice> {
  return null
}

export async function cancelSubscriptionAction() {
  return { success: false, error: 'Billing disabled' }
}

export async function resumeSubscriptionAction() {
  return { success: false, error: 'Billing disabled' }
}

export async function updateSubscriptionPlanAction() {
  return { success: false, error: 'Billing disabled' }
}

export type AuthUser = {
  id: string
  email: string
  name?: string | null
  createdAt?: Date
}

export type AuthSession = {
  user: AuthUser
  expiresAt: Date
  issuedAt: Date
  token: string
}

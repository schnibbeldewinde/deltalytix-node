'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "lucide-react"
import { useI18n } from "@/locales/client"
import { useUserStore } from "@/store/user-store"

export function LinkedAccounts() {
  const t = useI18n()
  const user = useUserStore(state => state.user)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          {t('auth.linkedAccounts')}
        </CardTitle>
        <CardDescription>
          {t('auth.linkedAccountsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between border rounded-lg p-3">
          <div>
            <p className="font-medium">{user?.email || t('auth.emailMethod')}</p>
            <p className="text-sm text-muted-foreground">{t('auth.primaryAccount')}</p>
          </div>
          <Badge variant="secondary">{t('auth.emailMethod')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Third-party account linking is disabled; use your email and password to sign in.
        </p>
      </CardContent>
    </Card>
  )
}

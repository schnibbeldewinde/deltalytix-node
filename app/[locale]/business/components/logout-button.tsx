'use client'

import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { signOutClient } from "@/lib/client-auth"
import { useI18n } from "@/locales/client"

export function LogoutButton() {
  const t = useI18n()
  
  return (
    <DropdownMenuItem 
      onClick={() => {
        signOutClient()
      }} 
      className="flex items-center"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{t('dashboard.logOut')}</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}

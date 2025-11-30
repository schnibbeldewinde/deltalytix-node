'use client'

import { useState, useRef } from 'react'
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from '@/components/logo'
import Link from 'next/link'
import ImportButton from './import/import-button'
import { useI18n } from "@/locales/client"
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts'
import { ActiveFilterTags } from './filters/active-filter-tags'
import { AnimatePresence } from 'framer-motion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FilterCommandMenu } from './filters/filter-command-menu'
import { UsersIcon, type UsersIconHandle } from '@/components/animated-icons/users'
import { useModalStateStore } from '@/store/modal-state-store'
import { useUserStore } from '@/store/user-store'
import UserMenu from './user-menu'

export default function Navbar() {
  const  user = useUserStore(state => state.supabaseUser)
  const t = useI18n()
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false)
  const [showAccountNumbers, setShowAccountNumbers] = useState(true)
  const usersIconRef = useRef<UsersIconHandle>(null)
  const { accountGroupBoardOpen } = useModalStateStore()

  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <>
      <nav className="fixed py-2 top-0 left-0 right-0 z-50 flex flex-col text-primary bg-background/80 backdrop-blur-md border-b shadow-xs w-screen">
        <div className="flex items-center justify-between px-10 h-16">
          <div className="flex items-center gap-x-4">
            <Link href="/dashboard" className="flex items-center gap-1 px-2">
              <Logo className='fill-black h-6 w-6 dark:fill-white' />
            </Link>
            <div className="hidden md:block">
              <FilterCommandMenu variant="navbar" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className='hidden md:flex gap-x-4'>
              <ImportButton />
            </div>
            <div className="flex items-center gap-2">
              <UserMenu />
            </div>
          </div>
        </div>
        <AnimatePresence>
          <ActiveFilterTags showAccountNumbers={showAccountNumbers} />
        </AnimatePresence>
      </nav>
      <div className="h-[72px]" />
    </>
  )
}

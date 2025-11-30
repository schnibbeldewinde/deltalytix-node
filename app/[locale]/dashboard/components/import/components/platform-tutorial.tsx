'use client'

import { AlertCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { PlatformConfig } from "../config/platforms"
import { useI18n } from "@/locales/client"
import { Button } from "@/components/ui/button"

interface PlatformTutorialProps {
  selectedPlatform: PlatformConfig | undefined
  setIsOpen: (isOpen: boolean) => void
}

export function PlatformTutorial({ selectedPlatform, setIsOpen }: PlatformTutorialProps) {
  const t = useI18n()
  if (!selectedPlatform) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('import.type.tutorial.title')}</h2>
        {selectedPlatform.tutorialLink && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(selectedPlatform.tutorialLink, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            {t('import.type.tutorial.viewDocs')}
          </Button>
        )}
      </div>
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 transition-transform duration-300 hover:scale-[1.02] flex items-center justify-center text-sm text-muted-foreground">
        {t('import.type.tutorial.notAvailable', { platform: selectedPlatform.type.split('-').join(' ') })}
      </div>

      {selectedPlatform.details && (
        <div className="text-sm text-muted-foreground flex items-start gap-2 bg-muted/50 p-4 rounded-lg transition-all duration-300 hover:bg-muted/70 animate-in slide-in-from-bottom-4">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500 animate-pulse" />
          <p>{t(selectedPlatform.details as keyof typeof t)}</p>
        </div>
      )}

      {selectedPlatform.isRithmic && (
        <div className="mt-6 text-xs text-muted-foreground space-y-2 border-t pt-4">
          <div className="flex items-center gap-4 mb-2">
            <Image 
              src="/RithmicArtwork/TradingPlatformByRithmic-Black.png"
              alt="Trading Platform by Rithmic"
              width={120}
              height={40}
              className="dark:hidden"
            />
            <Image 
              src="/RithmicArtwork/TradingPlatformByRithmic-Green.png"
              alt="Trading Platform by Rithmic"
              width={120}
              height={40}
              className="hidden dark:block"
            />
            <Image 
              src="/RithmicArtwork/Powered_by_Omne.png"
              alt="Powered by OMNE"
              width={120}
              height={40}
            />
          </div>
          <p>{t('import.type.copyright.platform')}</p>
          <p>{t('import.type.copyright.omne')}</p>
        </div>
      )}
    </div>
  )
} 

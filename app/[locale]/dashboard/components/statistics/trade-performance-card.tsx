'use client'

import { useData } from "@/context/data-provider"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react"
import { WidgetSize } from '../../types/dashboard'
import { useI18n } from '@/locales/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TradePerformanceCardProps {
  size?: WidgetSize
}

export default function TradePerformanceCard({ size = 'medium' }: TradePerformanceCardProps) {
  const { statistics: { nbWin, nbLoss, nbBe, nbTrades } } = useData()
  const t = useI18n()
  const title = 'Trade win %'

  // Calculate rates
  const winRate = Number((nbWin / nbTrades * 100).toFixed(2))
  const lossRate = Number((nbLoss / nbTrades * 100).toFixed(2))
  const beRate = Number((nbBe / nbTrades * 100).toFixed(2))
  const totalPct = Math.max(winRate + lossRate + beRate, 1)
  const winPct = (winRate / totalPct) * 100
  const bePct = (beRate / totalPct) * 100
  const lossPct = (lossRate / totalPct) * 100

  return (
    <Card className="h-full bg-card/80 border-border/70 shadow-sm">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{title}</span>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={5}
                className="max-w-[300px]"
              >
                {t('widgets.tradePerformance.tooltip')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="flex items-center gap-1 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span>{winRate}%</span>
          </div>
          <span className="text-muted-foreground/70">/</span>
          <div className="flex items-center gap-1 text-amber-300">
            <Minus className="h-4 w-4" />
            <span>{beRate}%</span>
          </div>
          <span className="text-muted-foreground/70">/</span>
          <div className="flex items-center gap-1 text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span>{lossRate}%</span>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="flex h-full w-full">
            <div className="bg-emerald-500" style={{ width: `${winPct}%` }} />
            <div className="bg-amber-400" style={{ width: `${bePct}%` }} />
            <div className="bg-red-500" style={{ width: `${lossPct}%` }} />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{nbTrades} {t('dashboard.statistics.trades') || 'trades'}</div>
      </CardContent>
    </Card>
  )
}

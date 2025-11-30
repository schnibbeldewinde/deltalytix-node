'use client'

import { useData } from '@/context/data-provider'
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftRight, ArrowUpFromLine, ArrowDownFromLine, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetSize } from '../../types/dashboard'
import { useI18n } from '@/locales/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LongShortPerformanceCardProps {
  size?: WidgetSize
}

export default function LongShortPerformanceCard({ size = 'medium' }: LongShortPerformanceCardProps) {
  const { calendarData } = useData()
  const  t  = useI18n()
  const title = 'Long vs Short'

  // Calculate long/short data
  const chartData = Object.entries(calendarData).map(([date, values]) => ({
    date,
    pnl: values.pnl,
    shortNumber: values.shortNumber,
    longNumber: values.longNumber,
  }))

  const longNumber = chartData.reduce((acc, curr) => acc + curr.longNumber, 0)
  const shortNumber = chartData.reduce((acc, curr) => acc + curr.shortNumber, 0)
  const totalTrades = longNumber + shortNumber
  const longRate = Number((longNumber / totalTrades * 100).toFixed(2))
  const shortRate = Number((shortNumber / totalTrades * 100).toFixed(2))

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
                {t('widgets.longShortPerformance.tooltip')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="flex items-center gap-1 text-emerald-400">
            <ArrowUpFromLine className="h-4 w-4" />
            <span>{longRate}%</span>
          </div>
          <span className="text-muted-foreground/70">/</span>
          <div className="flex items-center gap-1 text-red-400">
            <ArrowDownFromLine className="h-4 w-4" />
            <span>{shortRate}%</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {longNumber} {t('dashboard.statistics.long') || 'long'} / {shortNumber} {t('dashboard.statistics.short') || 'short'}
        </div>
      </CardContent>
    </Card>
  )
}

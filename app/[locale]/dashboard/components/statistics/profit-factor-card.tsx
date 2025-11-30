import { useData } from "@/context/data-provider"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetSize } from '../../types/dashboard'
import { useI18n } from '@/locales/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProfitFactorCardProps {
  size?: WidgetSize
}

export default function ProfitFactorCard({ size = 'medium' }: ProfitFactorCardProps) {
  const { statistics: { profitFactor, grossWin, grossLosses } } = useData()
  const t = useI18n()
  const title = 'Profit factor'

  const tone = profitFactor >= 1 ? "text-emerald-400" : "text-red-400"

  const total = Math.max(grossWin + grossLosses, 1)
  const winPct = Math.min(Math.max(grossWin / total, 0), 1)
  const lossPct = 1 - winPct
  const dashArray = `${(winPct * 100).toFixed(2)} ${(lossPct * 100).toFixed(2)}`

  return (
    <Card className="h-full bg-card/80 border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                  {t('widgets.profitFactor.tooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn("text-2xl font-semibold tracking-tight", tone)}>
              {profitFactor.toFixed(2)}
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative h-12 w-12">
                    <svg viewBox="0 0 36 36" className="h-12 w-12">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="3.5"
                        strokeDasharray="100 100"
                        strokeLinecap="round"
                        className="opacity-30"
                      />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="hsl(var(--emerald-400))"
                      strokeWidth="3.5"
                      strokeDasharray={`${winPct * 100} ${100 - winPct * 100}`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="3.5"
                      strokeDasharray={`${lossPct * 100} ${100 - lossPct * 100}`}
                      strokeLinecap="round"
                      transform={`rotate(${(winPct * 360) - 90} 18 18)`}
                    />
                    </svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className="text-xs space-y-1">
                  <div className="flex justify-between gap-4 min-w-[160px]">
                    <span className="text-muted-foreground">Total profit</span>
                    <span className="text-emerald-400 font-semibold">${grossWin.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between gap-4 min-w-[160px]">
                    <span className="text-muted-foreground">Total loss</span>
                    <span className="text-red-400 font-semibold">-${grossLosses.toFixed(2)}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

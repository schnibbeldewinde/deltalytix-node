import { useData } from "@/context/data-provider"
import { Card, CardContent } from "@/components/ui/card"
import { PiggyBank, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetSize } from '../../types/dashboard'
import { useI18n } from '@/locales/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CumulativePnlCardProps {
  size?: WidgetSize
}

export default function CumulativePnlCard({ size = 'medium' }: CumulativePnlCardProps) {
  const { statistics: { cumulativePnl, cumulativeFees } } = useData()
  const totalPnl = cumulativePnl - cumulativeFees
  const isPositive = totalPnl > 0
  const t = useI18n()
  // Hardcode title to avoid missing translations showing "Title"
  const title = 'Net P&L'
  const afterFeesLabel = 'After fees'

  return (
    <Card className="h-full bg-card/80 border-border/70 shadow-sm">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{title}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5} className="max-w-[300px]">
                {t('widgets.cumulativePnl.tooltip')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
          <span
            className={cn(
              "text-2xl font-semibold tracking-tight",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {isPositive ? '$' : '-$'}
            {Math.abs(totalPnl).toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {afterFeesLabel}: ${Math.abs(cumulativeFees).toFixed(2)}
        </div>
      </CardContent>
    </Card>
  )
}

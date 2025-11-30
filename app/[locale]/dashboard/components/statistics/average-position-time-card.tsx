import { useData } from "@/context/data-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetSize } from '../../types/dashboard'
import { useI18n } from '@/locales/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface AveragePositionTimeCardProps {
  size?: WidgetSize
}

export default function AveragePositionTimeCard({ size = 'medium' }: AveragePositionTimeCardProps) {
  const { statistics: { averagePositionTime } } = useData()
  const t = useI18n()
  const title = 'Avg position'

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
                {t('widgets.averagePositionTime.tooltip')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="text-2xl font-semibold tracking-tight">{averagePositionTime}</div>
        </div>
      </CardContent>
    </Card>
  )
}

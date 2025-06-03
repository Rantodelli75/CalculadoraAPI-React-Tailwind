import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonitorData {
  name: string
  currentPrice: number
  oldPrice: number
  change: number
  lastUpdate: string
  showNextPrice?: boolean
  symbol: string
  color: string
  showCalculator?: boolean
  calculatorPrice?: number
}

export const MonitorCard = ({
  name,
  currentPrice,
  oldPrice,
  change,
  lastUpdate,
  showNextPrice = false,
  symbol,
  color,
}: MonitorData) => {
  const isPositive = symbol === "+" || color === "green"
  const displayCurrentPrice = showNextPrice ? currentPrice : oldPrice
  const displayPreviousPrice = showNextPrice ? oldPrice : currentPrice

  // Separar fecha y hora
  const dateParts = lastUpdate.split(",")
  const updateDate = dateParts[0].trim()
  const updateTime = dateParts.length > 1 ? dateParts[1].trim() : ""

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-800">{name}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-semibold text-gray-500">Precio Actual</p>
              <p className={cn("text-3xl font-bold tracking-tight", isPositive ? "text-emerald-600" : "text-rose-600")}>{displayCurrentPrice.toLocaleString('es-Ve')} Bs.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Precio Anterior</p>
              <p className="text-xl font-semibold text-gray-600">{displayPreviousPrice.toLocaleString('es-Ve')} Bs.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div
              className={cn("flex items-center text-sm font-medium", isPositive ? "text-emerald-600" : "text-rose-600")}
            >
              {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              <span>
                {Math.abs(change)} {symbol}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Actualizado: {updateDate}, {updateTime}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"
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
  const isPositive = color === "green"
  const displayPrice = showNextPrice ? currentPrice : oldPrice
  const previousPrice = showNextPrice ? oldPrice : currentPrice

  const PriceSymbol = ({ symbol, color }: { symbol: string; color: string }) => (
    <span className={cn("font-medium", color === "green" ? "text-[#0ECB81]" : "text-[#F6465D]")}>{symbol}</span>
  )

  return (
    <Card className="bg-[#1E2329] border-[#2B3139] hover:border-[#F0B90B]/30 transition-all duration-200">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-sm font-medium",
                isPositive ? "bg-[#0ECB81]/10 text-[#0ECB81]" : "bg-[#F6465D]/10 text-[#F6465D]",
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}
              {change}
              <PriceSymbol symbol={symbol} color={color} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {displayPrice} <span className="text-lg text-[#848E9C]">Bs.</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#848E9C]">Variación del precio: </span>
            <span className={cn("font-semibold", isPositive ? "text-[#0ECB81]" : "text-[#F6465D]")}>
              {isPositive ? "+" : ""}
              {change}
            </span>
          </div>
          <div>
            <span className="text-[#848E9C]">Precio anterior: </span>
            <span className="text-white font-medium">{previousPrice}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#848E9C]" />
            <span className="text-[#848E9C]">Actualización: </span>
            <span className="text-white text-xs font-medium">{lastUpdate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

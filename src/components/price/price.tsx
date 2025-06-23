import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonitorCardProps {
  name: string;
  price: number;
  price_old: number;
  change: number;
  percent: number;
  last_update: string;
  symbol?: string;
  color: string;
  showNextPrice?: boolean;
  image?: string;
}

export const MonitorCard = ({
  name,
  price,
  price_old,
  change,
  percent,
  last_update,
  color = 'green',
  image
}: MonitorCardProps) => {
  // Asegurarse de que los valores numéricos sean números válidos
  const displayPrice = Number(price) || 0;
  const previousPrice = Number(price_old) || 0;
  const changeValue = Number(change) || 0;
  const percentValue = Number(percent) || 0;
  
  // Determinar si el cambio es positivo basado en el valor numérico
  const isPositive = (changeValue >= 0 && percentValue >= 0) || color === 'green' || color === 'green-500';

  return (
    <Card className="bg-[#1E2329] border-[#2B3139] hover:border-[#F0B90B]/30 transition-all duration-200">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {image && (
                <img 
                  src={image} 
                  alt={name} 
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    // Si hay un error al cargar la imagen, la reemplazamos con un icono por defecto
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/24';
                  }}
                />
              )}
              <h3 className="text-lg font-semibold text-white">{name}</h3>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 px-1 py-1 rounded text-sm font-medium",
                isPositive ? "bg-[#0ECB81]/10 text-[#0ECB81]" : "bg-[#F6465D]/10 text-[#F6465D]",
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}
              {Math.abs(percentValue || changeValue).toFixed(2)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {displayPrice} <span className="text-lg text-[#848E9C]">Bs.</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-[#848E9C]">Variación: </span>
            <span className={cn("font-semibold", isPositive ? "text-[#0ECB81]" : "text-[#F6465D]")}>
              {isPositive ? "+" : ""}{Math.abs(changeValue).toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-[#848E9C]">Anterior: </span>
            <span className="text-white font-medium">{previousPrice.toFixed(2)} Bs</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#848E9C]" />
            <span className="text-[#848E9C] text-xs">
              {last_update ? new Date(last_update).toLocaleTimeString('es-VE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

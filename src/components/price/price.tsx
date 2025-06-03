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
    
    const PriceSymbol = ({ symbol, color }: { symbol: string, color: string }) => (
        <span className={`${color === 'green' ? 'text-green-500' : 'text-red-500'}`}>
            {symbol}
        </span>
    );

    return (
        <Card className="shadow-xl">
            <CardHeader>
            <div className="flex">
                
                <div className="flex justify-between">
                    <span className="font-semibold text-lg">{name}</span>
                    <p className={`text-${color}-500 mr-0`}>
                        <span className="font-semibold text-lg ml-2 mr-0">
                            {showNextPrice ? currentPrice : oldPrice} Bs.
                        </span>
                    </p>
                </div>
            </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-gray-600 -mt-2">
                    <p className="text-gray-600">
                        <span>variacion del precio: </span>
                        <span className={`text-${color}-500`}>
                            <span className="font-semibold">{change}</span> <PriceSymbol symbol={symbol} color={color} />
                        </span>
                    </p>
                    <p>
                        <span>{showNextPrice ? 'precio anterior' : 'precio anterior'}: </span>
                        <span className='font-semibold'>
                            {showNextPrice ? oldPrice : currentPrice}
                        </span>
                    </p>
                    <p>
                        <span>{showNextPrice ? 'actualización' : 'actualización'}: </span>
                        <span className="font-semibold">
                            {lastUpdate}
                        </span>
                    </p>
                    
                </div>
            </CardContent>
        </Card>
    )
}

import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface MonitorData {
    name: string;
    currentPrice: number;
    oldPrice: number;
    change: number;
    lastUpdate: string;
    showNextPrice?: boolean;
}

export const MonitorCard = ({ 
    name, 
    currentPrice, 
    oldPrice, 
    change, 
    lastUpdate,
    showNextPrice = false 
}: MonitorData) => {
    const priceIncreased = currentPrice < oldPrice;
    
    return (
        <Card className="p-1 shadow-xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{name}</span>
                    <p className={priceIncreased ? 'text-red-500' : 'text-green-500'}>
                        <span className="font-semibold text-lg">
                            {showNextPrice ? oldPrice : currentPrice} Bs.
                        </span>
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-gray-600 -mt-2">
                    <p className="text-gray-600">
                        <span>variacion del precio: </span>
                        <span className={change > 0 ? 'text-red-500' : 'text-green-500'}>
                            {change} {change > 0 ? '↑' : '↓'}
                        </span>
                    </p>
                    <p>
                        <span>{showNextPrice ? 'próximo precio' : 'precio anterior'}: </span>
                        <span className={priceIncreased ? 'text-red-500' : 'text-green-500'}>
                            {showNextPrice ? currentPrice : oldPrice}
                        </span>
                    </p>
                    <p>
                        <span>{showNextPrice ? 'próxima actualización' : 'fecha de actualización'}: </span>
                        <span className="font-semibold">
                            {lastUpdate.split(' ')[0]}
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
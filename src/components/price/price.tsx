import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface MonitorData {
    name: string;
    currentPrice: number;
    oldPrice: number;
    change: number;
    lastUpdate: string;
    showNextPrice?: boolean;
    symbol: string;
    color: string;
}

export const MonitorCard = ({ 
    name, 
    currentPrice, 
    oldPrice, 
    change, 
    lastUpdate,
    showNextPrice = false,
    symbol,
    color
}: MonitorData) => {
    const priceIncreased = currentPrice < oldPrice;
    
    const PriceSymbol = ({ symbol, color }: { symbol: string, color: string }) => (
        <span className={`${color === 'green' ? 'text-green-500' : 'text-red-500'}`}>
            {symbol}
        </span>
    );

    return (
        <Card className="shadow-xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{name}</span>
                    <p className={priceIncreased ? 'text-red-500' : 'text-green-500'}>
                        <span className="font-semibold text-lg">
                            {showNextPrice ? currentPrice : oldPrice} Bs.
                        </span>
                    </p>
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
                        <span>{showNextPrice ? 'fecha de actualización' : 'fecha de actualización'}: </span>
                        <span className="font-semibold">
                            {lastUpdate.split(',')[0].trim()}
                        </span>
                    </p>
                    <p>
                        <span>hora de actualización: </span>
                        <span className="font-semibold">
                            {lastUpdate.split(',')[1].trim()}
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
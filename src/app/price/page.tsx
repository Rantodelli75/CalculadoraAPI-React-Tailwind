import { useEffect, useState } from 'react';
import { fetchDollarParallel } from '@/api/api';
import { MonitorCard } from '@/components/price/price';

// Define un tipo para la estructura de los datos que esperas
interface DollarParallel {
    monitors: {
        bcv: {
            price_old: number;
            change: number;
            last_update: string;
            price: number;
            symbol: string;
            color: string;
        };
        enparalelovzla: {
            price_old: number;
            change: number;
            last_update: string;
            price: number;
            symbol: string;
            color: string;
        };
    };
}

export default function Monitores() {
    const [dollarParallel, setDollarParallel] = useState<DollarParallel | null>(null);

    useEffect(() => {
        const getDollarParallel = async () => {
            try {
                const data = await fetchDollarParallel();
                setDollarParallel(data as DollarParallel);
            } catch (error) {
                console.error('Error fetching dollar parallel:', error);
            }
        };

        getDollarParallel();
    }, []);


    return dollarParallel ? (
        <div className="space-y-4 flex-grow">
            <MonitorCard 
                name="Dólar BCV"
                currentPrice={dollarParallel.monitors.bcv.price}
                oldPrice={dollarParallel.monitors.bcv.price_old}
                change={dollarParallel.monitors.bcv.change}
                lastUpdate={dollarParallel.monitors.bcv.last_update}
                showNextPrice={true}
                symbol={dollarParallel.monitors.bcv.symbol}
                color={dollarParallel.monitors.bcv.color}
            />
            
            <MonitorCard 
                name="Dólar EnParalelo"
                currentPrice={dollarParallel.monitors.enparalelovzla.price_old}
                oldPrice={dollarParallel.monitors.enparalelovzla.price}
                change={dollarParallel.monitors.enparalelovzla.change}
                lastUpdate={dollarParallel.monitors.enparalelovzla.last_update.trim().replace(/,$/, '')}
                symbol={dollarParallel.monitors.enparalelovzla.symbol}
                color={dollarParallel.monitors.enparalelovzla.color}
            />

            <MonitorCard 
                name="Dólar Promedio"
                currentPrice={Number(((dollarParallel.monitors.enparalelovzla.price_old + dollarParallel.monitors.bcv.price_old) / 2).toFixed(2))}
                oldPrice={Number(((dollarParallel.monitors.enparalelovzla.price + dollarParallel.monitors.bcv.price) / 2).toFixed(2))}
                change={Number(((dollarParallel.monitors.enparalelovzla.change + dollarParallel.monitors.bcv.change) / 2).toFixed(2))}
                lastUpdate={new Date().toLocaleString('es-VE')}
                symbol={dollarParallel.monitors.enparalelovzla.symbol}
                color={
                    ((dollarParallel.monitors.enparalelovzla.price_old + dollarParallel.monitors.bcv.price) / 2) >
                    ((dollarParallel.monitors.enparalelovzla.price + dollarParallel.monitors.bcv.price_old) / 2)
                    ? 'green'
                    : 'red'
                }
                showCalculator={true}
                calculatorPrice={Number(((dollarParallel.monitors.enparalelovzla.price_old + dollarParallel.monitors.bcv.price) / 2).toFixed(2))}
            />
        </div>
    ) : (
        <p className="text-center">Cargando datos...</p>
    );
}

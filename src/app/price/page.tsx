import { useEffect, useState } from 'react';
import { fetchDollarParallel } from '@/api/api';
import { NavigationTabs } from '@/components/global/tabs';
import { MonitorCard } from '@/components/price/price';

// Define un tipo para la estructura de los datos que esperas
interface DollarParallel {
    monitors: {
        bcv: {
            price_old: number;
            change: number;
            last_update: string;
            price: number;
        };
        enparalelovzla: {
            price_old: number;
            change: number;
            last_update: string;
            price: number;
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

    return (
        <div className="flex flex-col h-screen w-full mx-auto p-4 space-y-4 bg-[#f5f5f5] ">
            <NavigationTabs />
            {dollarParallel ? (
                <div className="space-y-4 flex-grow">
                    <MonitorCard 
                        name="Dólar BCV"
                        currentPrice={dollarParallel.monitors.bcv.price}
                        oldPrice={dollarParallel.monitors.bcv.price_old}
                        change={dollarParallel.monitors.bcv.change}
                        lastUpdate={dollarParallel.monitors.bcv.last_update}
                        showNextPrice={true}
                    />
                    
                    <MonitorCard 
                        name="Dólar EnParalelo"
                        currentPrice={dollarParallel.monitors.enparalelovzla.price_old}
                        oldPrice={dollarParallel.monitors.enparalelovzla.price}
                        change={dollarParallel.monitors.enparalelovzla.change}
                        lastUpdate={dollarParallel.monitors.enparalelovzla.last_update}
                    />
                </div>
            ) : (
                <p className="text-center">Cargando datos...</p>
            )}
        </div>
    );
}

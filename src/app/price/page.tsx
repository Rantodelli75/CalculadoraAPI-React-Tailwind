import { useEffect, useState } from 'react';
import { fetchDollarParallel } from '@/api/api';
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function Calculator() {
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
        <div className="w-full h-full mx-auto p-4 space-y-4">
        <Tabs defaultValue="monitores" className="w-full">
          <TabsList className="flex w-full bg-green-500 text-white hover:text-white">
            <TabsTrigger
              value="monitores"
              className="flex-1 bg-green-500 data-[state=active]:text-green-500 text-center"
            >
              Monitores
            </TabsTrigger>
            <TabsTrigger 
              value="calculadora"
              className="flex-1 bg-green-500 data-[state=active]:text-green-500 text-center"
            >
              Calculadora
            </TabsTrigger>
          </TabsList>
        </Tabs>
  
        {dollarParallel ? (
          <div className="space-y-4">
            <Card className="p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Dólar BCV</span>
                <span className="font-semibold text-lg">{dollarParallel.monitors.bcv.price_old}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>diferencia: {dollarParallel.monitors.bcv.change}</p>
                <p>actualización: {dollarParallel.monitors.bcv.last_update}</p>
                <p>proximo cambio: {dollarParallel.monitors.bcv.price}</p>
              </div>
            </Card>
  
            <Card className="p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Dólar EnParalelo</span>
                <span className="font-semibold text-lg">{dollarParallel.monitors.enparalelovzla.price_old}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>diferencia: {dollarParallel.monitors.enparalelovzla.change}</p>
                <p>actualización: {dollarParallel.monitors.enparalelovzla.last_update}</p>
                <p>proximo cambio: {dollarParallel.monitors.enparalelovzla.price}</p>
              </div>
            </Card>
  
            <Card className="p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Euro BCV</span>
                <span className="font-semibold text-lg">64.00</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>Aumento de: 0.40</p>
                <p>actualización: 16/12/2024</p>
              </div>
            </Card>
          </div>
        ) : (
          <p className="text-center">Cargando datos...</p>
        )}
      </div>
    );
}

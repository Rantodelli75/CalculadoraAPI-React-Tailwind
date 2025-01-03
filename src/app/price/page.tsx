import { useEffect, useState } from 'react';
import { fetchDollarParallel } from '@/api/api';
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Calculator() {
    const [dollarParallel, setDollarParallel] = useState<any>(null);

    useEffect(() => {
        const getDollarParallel = async () => {
            try {
                const data = await fetchDollarParallel();
                setDollarParallel(data);
            } catch (error) {
                console.error('Error fetching dollar parallel:', error);
            }
        };

        getDollarParallel();
    }, []);

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
        <Tabs defaultValue="monitores" className="w-fit mx-auto">
          <TabsList className="bg-green-500 text-white hover:text-white">
            <TabsTrigger 
              value="monitores"
              className="data-[state=active]:bg-white data-[state=active]:text-green-500"
            >
              Monitores
            </TabsTrigger>
            <TabsTrigger 
              value="calculadora"
              className="data-[state=active]:bg-white data-[state=active]:text-green-500"
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
                <span className="font-semibold text-lg">{dollarParallel.monitors.bcv.price}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>Aumento de: 0.40</p>
                <p>actualización: {dollarParallel.monitors.bcv.last_update}</p>
              </div>
            </Card>
  
            <Card className="p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Dólar EnParalelo</span>
                <span className="font-semibold text-lg">{dollarParallel.monitors.enparalelovzla.price}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>Aumento de: 0.40</p>
                <p>actualización: {dollarParallel.monitors.enparalelovzla.last_update}</p>
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

import { useEffect, useState } from 'react';
import { fetchDollarParallel } from '@/api/api';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
        <div className="flex flex-col h-screen w-full mx-auto p-4 space-y-4">
            <Tabs defaultValue="monitores" className="w-full">
                <TabsList className="flex w-full bg-green-500 text-white hover:text-white">
                    <TabsTrigger value="monitores" className="flex-1 bg-green-500 data-[state=active]:text-green-500 text-center">
                        Monitores
                    </TabsTrigger>
                    <TabsTrigger value="calculadora" className="flex-1 bg-green-500 data-[state=active]:text-green-500 text-center">
                        Calculadora
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {dollarParallel ? (
              <>
                <div className="space-y-4 flex-grow">
              
                    <Card className="p-1 shadow-xl">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Dólar BCV</span>
                            <span className="font-semibold text-lg">{dollarParallel.monitors.bcv.price_old}$</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600 -mt-2">
                            <p className="text-gray-600">
                                <span>diferencia: </span>
                                <span className={dollarParallel.monitors.bcv.change > 0 ? 'text-red-500' : 'text-green-500'}>
                                    {dollarParallel.monitors.bcv.change} {dollarParallel.monitors.bcv.change > 0 ? '↑' : '↓'}
                                </span>
                            </p>
                            <p>próxima actualización: {dollarParallel.monitors.bcv.last_update}</p>
                            <p>
                              <span>próximo precio: </span>
                              <span className={dollarParallel.monitors.bcv.price > dollarParallel.monitors.bcv.price_old ? 'text-red-500' : 'text-green-500'}>
                                {dollarParallel.monitors.bcv.price}
                              </span>
                            </p>
                        </div>
                      </CardContent>
                    </Card>


                    <Card className="p-1 shadow-xl">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Dólar EnParalelo</span>
                            <span className="font-semibold text-lg">{dollarParallel.monitors.enparalelovzla.price_old}$</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600 -mt-2">
                            <p>
                                <span>diferencia: </span>
                                <span className={dollarParallel.monitors.enparalelovzla.change > 0 ? 'text-red-500' : 'text-green-500'}>
                                    {dollarParallel.monitors.enparalelovzla.change} {dollarParallel.monitors.enparalelovzla.change > 0 ? '↑' : '↓'}
                                </span>
                            </p>
                            <p>próxima actualización: {dollarParallel.monitors.enparalelovzla.last_update}</p>
                            <p>
                              <span>próximo precio: </span>
                              <span className={dollarParallel.monitors.enparalelovzla.price > dollarParallel.monitors.enparalelovzla.price_old ? 'text-red-500' : 'text-green-500'}>
                                {dollarParallel.monitors.enparalelovzla.price}
                              </span>
                            </p>
                        </div>
                      </CardContent>
                    </Card>

                </div>

                {/*<footer className="mt-auto justify-end">
                <Card className=''>
                  <CardContent>
                      <h2>
                        Para solicitudes o reportes de errores contactar al 
                      </h2>
                      <h3>
                        Create by Rafael
                      </h3>
                  </CardContent>
                </Card>
            </footer>*/}
            </>

            ) : (
                <p className="text-center">Cargando datos...</p>
            )}
        </div>
    );
}

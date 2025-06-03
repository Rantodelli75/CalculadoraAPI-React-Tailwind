import { useEffect, useState } from "react";

import { fetchDollarParallel } from "@/api/api";

import { MonitorCard } from "@/components/price/price";

import { Loader } from "lucide-react";

// Definicion de la interfaz de los datos que llegan de la API

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
  const [dollarParallel, setDollarParallel] = useState<DollarParallel | null>(
    null
  );

  useEffect(() => {
    const getDollarParallel = async () => {
      try {
        const data = await fetchDollarParallel();

        setDollarParallel(data as DollarParallel);
      } catch (error) {
        console.error("Error fetching dollar parallel:", error);
      }
    };

    getDollarParallel();
  }, []);

  // Verificamos que dollarParallel no sea nulo antes de acceder a sus propiedades

  if (!dollarParallel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="absolute" />

        <p className="text-center mt-12">Cargando datos...</p>
      </div>
    );
  }

  // Extraemos los precios y otros datos para las tarjetas

  const bcv = dollarParallel.monitors.bcv;

  const enParalelo = dollarParallel.monitors.enparalelovzla;

  const currentPriceBCV = bcv.price;

  const oldPriceBCV = bcv.price_old;

  const currentPriceEnParalelo = enParalelo.price_old;

  const oldPriceEnParalelo = enParalelo.price;

  const averageCurrentPrice = Number(
    ((oldPriceEnParalelo + oldPriceBCV) / 2).toFixed(2)
  );

  const averageOldPrice = Number(
    ((currentPriceEnParalelo + currentPriceBCV) / 2).toFixed(2)
  );

  const averageChange = Number(
    ((enParalelo.change + bcv.change) / 2).toFixed(2)
  );

  const averageColor = averageCurrentPrice > averageOldPrice ? "green" : "red";

  return (
    <div className="space-y-4 flex-grow">
      <MonitorCard
        name="Dólar BCV"
        currentPrice={currentPriceBCV}
        oldPrice={oldPriceBCV}
        change={bcv.change}
        lastUpdate={bcv.last_update}
        showNextPrice={true}
        symbol={""}
        color={bcv.color}
      />

      <MonitorCard
        name="Dólar EnParalelo"
        currentPrice={currentPriceEnParalelo}
        oldPrice={oldPriceEnParalelo}
        change={enParalelo.change}
        lastUpdate={enParalelo.last_update.trim().replace(/,$/, "")}
        symbol={""}
        color={enParalelo.color}
      />

      <MonitorCard
        name="Dólar Promedio"
        currentPrice={averageCurrentPrice}
        oldPrice={averageOldPrice}
        change={averageChange}
        lastUpdate={new Date().toLocaleString("es-VE")}
        symbol={""}
        color={averageColor}
        showCalculator={true}
        calculatorPrice={averageCurrentPrice}
      />
    </div>
  );
}

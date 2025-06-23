import { useEffect, useState } from "react";
import { MonitorCard } from "@/components/price/price";
import { Loader } from "lucide-react";
import { MonitorData, fetchCurrencyData } from "@/api/apiDollar";

export default function Monitores() {
  const [monitorData, setMonitorData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos la función importada de apiDollar.ts
        const data = await fetchCurrencyData(); // true para usar datos de prueba
        setMonitorData(data);
      } catch (err) {
        setError("Error al cargar los datos de monedas");
        console.error("Error fetching currency data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0B0E11]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="animate-spin h-12 w-12 text-[#F0B90B]" />
          <p className="text-white text-lg">Cargando datos de monedas...</p>
        </div>
      </div>
    );
  }


  if (error || !monitorData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || "No se pudieron cargar los datos"}</p>
      </div>
    );
  }

  // Verificamos la estructura de los datos recibidos
  console.log('=== DATOS RECIBIDOS ===');
  console.log('monitorData:', JSON.stringify(monitorData, null, 2));
  
  if (!monitorData.monitors) {
    console.error('No se encontró la propiedad monitors en los datos');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: Estructura de datos inesperada</p>
      </div>
    );
  }
  
  const monitorKeys = Object.keys(monitorData.monitors);
  console.log('Monitores disponibles:', monitorKeys);
  
  if (monitorKeys.length === 0) {
    console.warn('No hay monedas disponibles en los datos');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-yellow-500">No hay datos de monedas disponibles</p>
      </div>
    );
  }
  
  // Ordenamos las monedas para mostrarlas en el orden deseado
  const currencyOrder = ['usd', 'eur'];
  const sortedCurrencies = currencyOrder
    .filter(key => {
      const exists = monitorData.monitors && monitorData.monitors[key];
      console.log(`Moneda ${key} existe:`, exists);
      return exists;
    })
    .map(key => {
      const currencyData = monitorData.monitors[key];
      console.log(`Procesando moneda ${key}:`, currencyData);
      
      // Validar datos requeridos
      const price = Number(currencyData?.price) || 0;
      const price_old = Number(currencyData?.price_old) || price * 0.99;
      const change = Number(currencyData?.change) || 0;
      const percent = Number(currencyData?.percent) || 0;
      
      return {
        id: key,
        name: key.toUpperCase(),
        price,
        price_old,
        change,
        percent,
        last_update: currencyData?.last_update || new Date().toLocaleString('es-VE'),
        symbol: currencyData?.symbol || (change >= 0 ? '▲' : '▼'),
        color: currencyData?.color || (change >= 0 ? 'green' : 'red'),
        image: currencyData?.image || `https://via.placeholder.com/24?text=${key.toUpperCase()}`
      };
    });
    
  console.log('=== MONEDAS PROCESADAS ===');
  console.log('Monedas ordenadas:', JSON.stringify(sortedCurrencies, null, 2));
  
  if (sortedCurrencies.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-yellow-500">No hay monedas disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className="h-[100vh] h-full min-h-screen bg-[#0B0E11] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto h-full">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Monitores de Monedas</h1>
          <p className="text-[#848E9C] text-center">
            Actualizado el {monitorData.datetime.date} a las {monitorData.datetime.time}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCurrencies.map((currency) => {
            const { id, name, price, price_old, change, percent, last_update, color, image } = currency;
            return (
              <MonitorCard
                key={id}
                name={name}
                price={price}
                price_old={price_old}
                change={change}
                percent={percent}
                last_update={last_update}
                color={color}
                image={image}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

import axios from 'axios';

// Definición de la interfaz para los datos de monedas
export interface MonitorData {
  datetime: {
    date: string;
    time: string;
  };
  monitors: {
    [key: string]: {
      change: number;
      color: string;
      image: string;
      last_update: string;
      percent: number;
      price: number;
      price_old: number;
      symbol: string;
      title: string;
    };
  };
}

// No necesitamos la interfaz ApiResponse ya que usamos el tipo genérico de Axios

const BASE_URL_TIPO_CAMBIO = 'https://pydolarve.org/api/v2/tipo-cambio';

// Interfaz para la respuesta de la API
interface ApiResponse {
  [key: string]: {
    price: string | number;
    price_old?: string | number;
    change?: string | number;
    percent?: string | number;
    color?: string;
    symbol?: string;
    title?: string;
    last_update?: string;
  };
}

// Función para formatear la fecha
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('es-ES', options);
};

// Función para obtener el valor numérico de un campo
const getNumericValue = (value: any): number => {
  if (value === undefined || value === null) return 0;
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : Number(value);
  return isNaN(num) ? 0 : num;
};

// Función para determinar el color basado en el cambio
const getColorFromChange = (change: number): string => {
  if (change > 0) return 'green-500';
  if (change < 0) return 'red-500';
  return 'gray-500';
};

// Función para obtener el símbolo basado en el cambio
const getSymbolFromChange = (change: number): string => {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '=';
};

/**
 * Obtiene los datos de monedas desde la API de tipo de cambio
 */
export const fetchCurrencyData = async (): Promise<MonitorData> => {
  console.log('Iniciando fetchCurrencyData...');
  
  try {
    // Hacer la petición a la API
    console.log(`Haciendo petición a: ${BASE_URL_TIPO_CAMBIO}`);
    const response = await axios.get<ApiResponse>(BASE_URL_TIPO_CAMBIO, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000 // 10 segundos de timeout
    });
    
    console.log('Respuesta recibida, status:', response.status);
    const data = response.data;

    if (!data) {
      console.error('La respuesta de la API está vacía');
      throw new Error('No se pudieron obtener los datos de la API');
    }

    console.log('Datos obtenidos de la API (primeros 500 caracteres):', JSON.stringify(data).substring(0, 500));

    // Obtener la fecha y hora actual
    const now = new Date();
    const formattedDate = formatDate(now);
    
    // Interfaz para los datos de moneda de la API
    interface CurrencyApiData {
      price: string | number;
      price_old?: string | number;
      change?: string | number;
      percent?: string | number;
      color?: string;
      symbol?: string;
      title?: string;
      last_update?: string;
      image?: string;
    }

    // Tipo para el objeto de monitores
    type MonitorsData = {
      [key: string]: CurrencyApiData;
    };

    // Función para encontrar una moneda por su código o título
    const findCurrencyData = (code: string, titleMatch: string): CurrencyApiData | null => {
      // Verificar si data.monitors existe y es un objeto
      if (data.monitors && typeof data.monitors === 'object') {
        // Hacer un type assertion seguro
        const monitors = data.monitors as unknown as MonitorsData;
        
        // Intentar acceder por código
        if (monitors[code]) {
          return monitors[code];
        }
        
        // Si no encontramos por código, buscar por título
        for (const key in monitors) {
          const monitor = monitors[key];
          if (monitor.title && 
              typeof monitor.title === 'string' && 
              monitor.title.toLowerCase().includes(titleMatch)) {
            return monitor;
          }
        }
      }
      
      return null;
    };

    // Procesar los datos de la API
    const processCurrency = (currency: string) => {
      // Mapeo de códigos de moneda a títulos de búsqueda
      const currencyMap: Record<string, {code: string, title: string, defaultTitle: string}> = {
        'usd': {code: 'usd', title: 'dólar', defaultTitle: 'Dólar estadounidense'},
        'eur': {code: 'eur', title: 'euro', defaultTitle: 'Euro'}
      };
      
      const currencyInfo = currencyMap[currency];
      if (!currencyInfo) return null;
      
      const currencyData = findCurrencyData(currencyInfo.code, currencyInfo.title);
      if (!currencyData) {
        console.warn(`No se encontraron datos para la moneda: ${currency}`);
        return null;
      }

      console.log(`Datos procesados para ${currency}:`, currencyData);
      
      const price = getNumericValue(currencyData.price);
      const priceOld = getNumericValue(currencyData.price_old || 0);
      const change = getNumericValue(currencyData.change || 0);
      const percent = getNumericValue(currencyData.percent || 0);
      
      return {
        price,
        price_old: priceOld || price * 0.99,
        change,
        percent,
        color: currencyData.color || getColorFromChange(change),
        symbol: currencyData.symbol || getSymbolFromChange(change),
        title: currencyData.title || currencyInfo.defaultTitle,
        image: currencyData.image || (currency === 'usd' 
          ? 'https://res.cloudinary.com/dcpyfqx87/image/upload/v1729921477/monitors/public_id:united-states.webp'
          : 'https://res.cloudinary.com/dcpyfqx87/image/upload/v1729921474/monitors/public_id:european-union.webp'),
        last_update: currencyData.last_update || now.toLocaleString('es-VE')
      };
    };

    // Obtener datos para USD y EUR
    console.log('Procesando datos para USD y EUR...');
    const usdData = processCurrency('usd');
    const eurData = processCurrency('eur');

    console.log('Datos procesados - USD:', usdData);
    console.log('Datos procesados - EUR:', eurData);

    // Crear el objeto de respuesta con el formato esperado
    const result: MonitorData = {
      datetime: {
        date: formattedDate.split(',')[0],
        time: now.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        })
      },
      monitors: {}
    };

    // Agregar solo las monedas que tengan datos
    if (usdData) {
      console.log('Agregando datos de USD al resultado');
      result.monitors.usd = usdData;
    } else {
      console.warn('No se encontraron datos para USD');
    }
    
    if (eurData) {
      console.log('Agregando datos de EUR al resultado');
      result.monitors.eur = eurData;
    } else {
      console.warn('No se encontraron datos para EUR');
    }

    console.log('Resultado final:', result);
    return result;
    
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    throw new Error('No se pudieron obtener los datos de las monedas. Por favor, intente más tarde.');
  }
};


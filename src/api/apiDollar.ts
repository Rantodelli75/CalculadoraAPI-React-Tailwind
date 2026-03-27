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

const BASE_URL_TIPO_CAMBIO = '/api/rates';

// Interfaz para la respuesta del endpoint de tasas
interface ApiResponse {
  usd?: {
    rate: string | number;
    date?: string;
    bcv_date?: string;
  };
  eur?: {
    rate: string | number;
    date?: string;
    bcv_date?: string;
  };
}

interface HistoryRateItem {
  date: string;
  rate: string | number;
  bcv_date?: string;
}

const getHistoryEndpoint = (currency: 'USD' | 'EUR') =>
  `/api/rates/history?currency=${currency}&days=30`;

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
  try {
    const [currentRatesResponse, usdHistoryResponse, eurHistoryResponse] = await Promise.all([
      axios.get<ApiResponse>(BASE_URL_TIPO_CAMBIO, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000 // 10 segundos de timeout
      }),
      axios.get<HistoryRateItem[]>(getHistoryEndpoint('USD'), {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      }),
      axios.get<HistoryRateItem[]>(getHistoryEndpoint('EUR'), {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      })
    ]);

    const data = currentRatesResponse.data;
    const usdHistory = usdHistoryResponse.data || [];
    const eurHistory = eurHistoryResponse.data || [];

    if (!data) {
      throw new Error('No se pudieron obtener los datos de la API');
    }

    const getYesterdayRate = (history: HistoryRateItem[], currentRate: number): number => {
      if (!Array.isArray(history) || history.length === 0) return currentRate;
      const normalizedCurrent = Number(currentRate.toFixed(8));

      for (const item of history) {
        const rate = getNumericValue(item.rate);
        if (rate > 0 && Number(rate.toFixed(8)) !== normalizedCurrent) {
          return rate;
        }
      }

      if (history.length > 1) {
        const fallbackPrevious = getNumericValue(history[1]?.rate);
        return fallbackPrevious > 0 ? fallbackPrevious : currentRate;
      }

      return currentRate;
    };

    const getLastUpdate = (history: HistoryRateItem[], fallbackDate?: string): string => {
      const first = history[0];
      return first?.bcv_date || first?.date || fallbackDate || new Date().toISOString();
    };

    // Obtener la fecha y hora actual
    const now = new Date();
    const formattedDate = formatDate(now);
    const usdPrice = getNumericValue(data.usd?.rate);
    const eurPrice = getNumericValue(data.eur?.rate);

    const buildCurrencyMonitor = (
      currentPrice: number,
      previousPrice: number,
      title: string,
      image: string,
      lastUpdateRaw: string
    ) => {
      const safePrevious = previousPrice > 0 ? previousPrice : currentPrice;
      const changeAmount = currentPrice - safePrevious;
      const percent = safePrevious > 0 ? (changeAmount / safePrevious) * 100 : 0;

      // Se mantiene "change" en porcentaje porque la UI actual lo presenta como %.
      return {
        price: currentPrice,
        price_old: safePrevious,
        change: percent,
        percent,
        color: getColorFromChange(changeAmount),
        symbol: getSymbolFromChange(changeAmount),
        title,
        image,
        last_update: lastUpdateRaw
      };
    };

    const usdPreviousPrice = getYesterdayRate(usdHistory, usdPrice);
    const eurPreviousPrice = getYesterdayRate(eurHistory, eurPrice);

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
      monitors: {
        usd: buildCurrencyMonitor(
          usdPrice,
          usdPreviousPrice,
          'USD',
          'https://res.cloudinary.com/dcpyfqx87/image/upload/v1729921477/monitors/public_id:united-states.webp',
          getLastUpdate(usdHistory, data.usd?.date)
        ),
        eur: buildCurrencyMonitor(
          eurPrice,
          eurPreviousPrice,
          'EUR',
          'https://res.cloudinary.com/dcpyfqx87/image/upload/v1729921474/monitors/public_id:european-union.webp',
          getLastUpdate(eurHistory, data.eur?.date)
        )
      }
    };

    if (!usdPrice && !eurPrice) {
      throw new Error('No se pudieron obtener tasas válidas de USD/EUR');
    }

    return result;
    
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    throw new Error('No se pudieron obtener los datos de las monedas. Por favor, intente más tarde.');
  }
};


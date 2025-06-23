import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchCurrencyData } from '@/api/apiDollar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons'



interface CurrencyRates {
  usd: number;
  eur: number;
  lastUpdate: string;
}

export default function Calculator() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("VES")
  const [toCurrency, setToCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [rates, setRates] = useState<CurrencyRates>({
    usd: 0,
    eur: 0,
    lastUpdate: ""
  })
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCurrencyData();
        
        // Obtener tasas de cambio de la API
        const usdRate = data.monitors.usd.price;
        const eurRate = data.monitors.eur.price;
        const lastUpdate = data.monitors.usd.last_update;
        
        setRates({
          usd: usdRate,
          eur: eurRate,
          lastUpdate
        });
        
      } catch (error) {
        console.error('Error al obtener tasas de cambio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getExchangeRates();
    
    // Actualizar cada minuto
    const interval = setInterval(getExchangeRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const convertAmount = (value: string, from: string, to: string) => {
    if (!value || !rates.usd || !rates.eur) return "";
    
    const numericValue = parseFloat(value.replace(/,/g, "."));
    if (isNaN(numericValue)) return "";
    
    // Si las monedas son iguales, devolver el mismo valor
    if (from === to) return numericValue.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Convertir a VES primero si es necesario
    let vesAmount = numericValue;
    if (from === "USD") {
      vesAmount = numericValue * rates.usd;
    } else if (from === "EUR") {
      vesAmount = numericValue * rates.eur;
    }
    
    // Convertir a la moneda destino
    let result = vesAmount;
    if (to === "USD") {
      result = vesAmount / rates.usd;
    } else if (to === "EUR") {
      result = vesAmount / rates.eur;
    }
    
    return result.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, "");
    setAmount(value);
    
    if (!value) {
      setConvertedAmount("");
      return;
    }
    
    const result = convertAmount(value, fromCurrency, toCurrency);
    setConvertedAmount(result);
  }

  const handleCurrencyChange = (currency: string, type: 'from' | 'to') => {
    // Actualizar el estado de la moneda
    if (type === 'from') {
      setFromCurrency(currency);
    } else {
      setToCurrency(currency);
    }
    
    // Si hay un monto, recalcular la conversión
    if (amount) {
      const newFrom = type === 'from' ? currency : fromCurrency;
      const newTo = type === 'to' ? currency : toCurrency;
      const result = convertAmount(amount, newFrom, newTo);
      setConvertedAmount(result);
    }
  }

  const handleCurrencySwitch = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    // Intercambiar los montos
    if (amount && convertedAmount) {
      setAmount(convertedAmount.replace(/[^0-9.,]/g, ""));
      setConvertedAmount(amount);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 overflow-hidden">
      <Card className="w-full max-w-xl shadow-xl bg-[#1E2329]">
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Selecciona el tipo de moneda</label>
                <div className="relative">
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring text-white">
                    <span className="pl-3 text-xl text-white">{fromCurrency === 'USD' ? '$' : fromCurrency === 'EUR' ? '€' : 'Bs'}</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      className="flex h-14 w-full text-white rounded-md bg-transparent px-3 py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Select value={fromCurrency} onValueChange={(value) => handleCurrencyChange(value, 'from')}>
                      <SelectTrigger className="w-[110px] border-0 focus:ring-0 text-white">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-white">{fromCurrency === 'USD' ? '🇺🇸' : fromCurrency === 'EUR' ? '🇪🇺' : '🇻🇪'}</span>
                            <span className="text-white">{fromCurrency === 'USD' ? 'USD' : fromCurrency === 'EUR' ? 'EUR' : 'VES'}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">
                          <div className="flex items-center gap-2">
                            <span>🇺🇸</span>
                            <span>USD</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center gap-2">
                            <span>🇪🇺</span>
                            <span>EUR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="VES">
                          <div className="flex items-center gap-2">
                            <span>🇻🇪</span>
                            <span>VES</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button 
                    className="w-full bg-[#f0b90b] hover:bg-[#f0b90b]"
                    size="icon"
                    onClick={handleCurrencySwitch}
                >
                    <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4 text-black" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Convertido a</label>
                <div className="relative">
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                    <span className="pl-3 text-xl text-white">{toCurrency === 'USD' ? '$' : toCurrency === 'EUR' ? '€' : 'Bs'}</span>
                    <input
                      type="text"
                      value={convertedAmount}
                      readOnly
                      className="text-white flex h-14 w-full rounded-md bg-transparent px-3 py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Select value={toCurrency} onValueChange={(value) => handleCurrencyChange(value, 'to')}>
                      <SelectTrigger className="w-[110px] border-0 focus:ring-0 text-white">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-white">{toCurrency === 'USD' ? '🇺🇸' : toCurrency === 'EUR' ? '🇪🇺' : '🇻🇪'}</span>
                            <span className="text-white">{toCurrency === 'USD' ? 'USD' : toCurrency === 'EUR' ? 'EUR' : 'VES'}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">
                          <div className="flex items-center gap-2">
                            <span>🇺🇸</span>
                            <span>USD</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center gap-2">
                            <span>🇪🇺</span>
                            <span>EUR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="VES">
                          <div className="flex items-center gap-2">
                            <span>🇻🇪</span>
                            <span>VES</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-white">1 USD = </span>
                  <span className="text-primary font-medium text-white">{rates.usd.toLocaleString("es-VE")} </span>
                  <span className="font-medium text-white">VES</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-white">1 EUR = </span>
                  <span className="text-primary font-medium text-white">{rates.eur.toLocaleString("es-VE")} </span>
                  <span className="font-medium text-white">VES</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Tipo de valorización en la fecha {new Date(rates.lastUpdate).toLocaleString('es-VE')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



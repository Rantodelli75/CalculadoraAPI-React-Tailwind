import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchDollarParallel } from '@/api/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons'



interface DollarParallel {
  monitors: {
    bcv: {
      price: number;
      last_update: string;
    }
    enparalelovzla: {
      price: number;
      last_update: string;
    }
  }
}

export default function Calculator() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("VES")
  const [toCurrency, setToCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [lastUpdate, setLastUpdate] = useState("")
  const [selectedMonitor, setSelectedMonitor] = useState("bcv")

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const data = await fetchDollarParallel() as DollarParallel;
        setExchangeRate(selectedMonitor === 'bcv' ? 
          data.monitors.bcv.price : 
          data.monitors.enparalelovzla.price
        );
        setLastUpdate(selectedMonitor === 'bcv' ? 
          data.monitors.bcv.last_update : 
          data.monitors.enparalelovzla.last_update
        );
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    getExchangeRate();
  }, [selectedMonitor]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,]/g, "")
    setAmount(value)
    
    if (!value) {
      setConvertedAmount("")
      return
    }
    
    const numericValue = Number(value.replace(/,/g, ""))
    if (fromCurrency === "USD") {
      const result = (numericValue * exchangeRate).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      setConvertedAmount(result)
    } else {
      const result = (numericValue / exchangeRate).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      setConvertedAmount(result)
    }
  }

  const handleCurrencyChange = (currency: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromCurrency(currency)
      setToCurrency(currency === 'USD' ? 'VES' : 'USD')
    } else {
      setToCurrency(currency)
      setFromCurrency(currency === 'USD' ? 'VES' : 'USD')
    }
    
    const numericValue = Number(amount.replace(/,/g, ""))
    if (currency === "USD") {
      const result = (numericValue / exchangeRate).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      setConvertedAmount(result)
    } else {
      const result = (numericValue * exchangeRate).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      setConvertedAmount(result)
    }
  }

  const handleCurrencySwitch = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    // Recalcular con la nueva dirección de conversión
    const numericValue = Number(amount.replace(/,/g, ""))
    if (toCurrency === "USD") { // Si USD está arriba, multiplicamos
        const result = (numericValue * exchangeRate).toLocaleString("es-VE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        setConvertedAmount(result);
    } else { // Si VES está arriba, dividimos
        const result = (numericValue / exchangeRate).toLocaleString("es-VE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        setConvertedAmount(result);
    }
  };

  const monitores = [
    { value: 'bcv', label: 'BCV' },
    { value: 'enparalelovzla', label: 'EnParalelo' }
  ]

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 overflow-hidden">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Selecciona el tipo de monitor</label>
                <Select value={selectedMonitor} onValueChange={setSelectedMonitor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar monitor">
                      {monitores.find(m => m.value === selectedMonitor)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {monitores.map((monitor) => (
                      <SelectItem key={monitor.value} value={monitor.value}>
                        {monitor.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                    <span className="pl-3 text-xl">{fromCurrency === 'USD' ? '$' : 'Bs'}</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      className="flex h-14 w-full rounded-md bg-transparent px-3 py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Select value={fromCurrency} onValueChange={(value) => handleCurrencyChange(value, 'from')}>
                      <SelectTrigger className="w-[110px] border-0 focus:ring-0">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{fromCurrency === 'USD' ? '🇺🇸' : '🇻🇪'}</span>
                            <span>{fromCurrency === 'USD' ? 'USD' : 'VES'}</span>
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
                    className="w-full"
                    size="icon"
                    onClick={handleCurrencySwitch}
                >
                    <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Convertido a</label>
                <div className="relative">
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                    <span className="pl-3 text-xl">{toCurrency === 'USD' ? '$' : 'Bs'}</span>
                    <input
                      type="text"
                      value={convertedAmount}
                      readOnly
                      className="flex h-14 w-full rounded-md bg-transparent px-3 py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Select value={toCurrency} onValueChange={(value) => handleCurrencyChange(value, 'to')}>
                      <SelectTrigger className="w-[110px] border-0 focus:ring-0">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{toCurrency === 'USD' ? '🇺🇸' : '🇻🇪'}</span>
                            <span>{toCurrency === 'USD' ? 'USD' : 'VES'}</span>
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
                  <span className="font-medium">1 USD = </span>
                  <span className="text-primary font-medium">{exchangeRate.toLocaleString("es-VE")} </span>
                  <span className="font-medium">VES</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Tipo de valorización en la fecha {lastUpdate}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



import axios from 'axios';

const BASE_URL = 'https://pydolarve.org/api/v1/dollar';

export const fetchDollarParallel = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        console.log('Respuesta de la API:', response.data);
        if (response.data && typeof response.data === 'object') {
            return response.data; // Devuelve toda la respuesta
        } else {
            throw new Error('La respuesta no contiene datos válidos.');
        }
    } catch (error) {
        console.error('Error fetching dollar parallel:', error);
        throw error;
    }
};

export const fetchExchangeRates = async (base: string, symbols: string[]) => {
    try {
        const response = await axios.get(`${BASE_URL}/exchange?base=${base}&symbols=${symbols.join(',')}`);
        return response.data; // Devuelve las tasas de cambio
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
    }
};
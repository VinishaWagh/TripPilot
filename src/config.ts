// This selects the correct backend automatically
const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL // In production (Vercel), use the real backend
  : 'http://localhost:8000';     // In development (Local), use localhost

// Google Weather API Key
export const GOOGLE_WEATHER_API_KEY = import.meta.env.VITE_GOOGLE_WEATHER_API_KEY || '';

// Log API key status on startup (first 5 chars for security)
if (typeof window !== 'undefined') {
  const keyStatus = GOOGLE_WEATHER_API_KEY 
    ? `✅ API Key found (${GOOGLE_WEATHER_API_KEY.substring(0, 5)}...)`
    : '❌ API Key NOT found - Check .env.local';
  console.log('[Weather API]', keyStatus);
  console.log('[Debug] Raw VITE_GOOGLE_WEATHER_API_KEY:', JSON.stringify(import.meta.env.VITE_GOOGLE_WEATHER_API_KEY));
}

// Google Weather API Endpoint
export const GOOGLE_WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default API_URL;
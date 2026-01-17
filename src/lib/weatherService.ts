import { GOOGLE_WEATHER_API_KEY, GOOGLE_WEATHER_API_URL } from '@/config';
import { Weather, WeatherSeverity } from '@/data/weather';

// Map weather conditions to severity levels
const getWeatherSeverity = (condition: string, temperature: number, windSpeed: number, visibility: number): WeatherSeverity => {
  if (visibility < 500 || condition.toLowerCase().includes('fog')) return 'red';
  if (condition.toLowerCase().includes('storm') || windSpeed > 40) return 'red';
  if (condition.toLowerCase().includes('rain') || windSpeed > 25 || visibility < 2000) return 'yellow';
  return 'green';
};

// Map weather condition to emoji icon
const getWeatherIcon = (condition: string): string => {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sunny')) return '☀️';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈️';
  if (c.includes('fog') || c.includes('mist')) return '🌫️';
  if (c.includes('haze')) return '🌥️';
  return '⛅';
};

// Map OpenWeatherMap condition codes to readable conditions
const mapWeatherCondition = (description: string): string => {
  const d = description.toLowerCase();
  if (d.includes('clear')) return 'Clear';
  if (d.includes('cloud')) return 'Cloudy';
  if (d.includes('rain') || d.includes('drizzle')) return 'Rainy';
  if (d.includes('snow')) return 'Snowy';
  if (d.includes('storm') || d.includes('thunder')) return 'Stormy';
  if (d.includes('fog') || d.includes('mist')) return 'Foggy';
  if (d.includes('haze') || d.includes('dust') || d.includes('sand')) return 'Hazy';
  return 'Cloudy';
};

export interface AirportCoordinates {
  lat: number;
  lng: number;
}

// Get API key with debugging
const getApiKey = (): string => {
  const key = GOOGLE_WEATHER_API_KEY;
  if (!key || key.trim() === '') {
    console.error('API Key is empty. Check .env.local file');
    return '';
  }
  return key;
};

// Fetch weather data from OpenWeatherMap API
export const fetchAirportWeather = async (
  airportCode: string,
  city: string,
  coordinates: AirportCoordinates
): Promise<Weather | null> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn('Google Weather API key not configured');
    return null;
  }

  try {
    const params = new URLSearchParams({
      lat: coordinates.lat.toString(),
      lon: coordinates.lng.toString(),
      appid: apiKey,
      units: 'metric' // Use Celsius
    });

    const url = `${GOOGLE_WEATHER_API_URL}?${params}`;
    console.log(`Fetching weather for ${airportCode} from:`, url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch weather for ${airportCode}:`, response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log(`Weather data received for ${airportCode}:`, data);

    const condition = mapWeatherCondition(data.weather[0]?.main || 'Cloudy');
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const visibility = data.visibility || 10000;
    const severity = getWeatherSeverity(condition, temperature, windSpeed, visibility);

    // Map wind direction from degrees to cardinal direction
    const windDegrees = data.wind.deg || 0;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const windDirection = directions[Math.round(windDegrees / 22.5) % 16];

    // Determine if there's a weather alert
    let alert: string | null = null;
    if (severity === 'red') {
      if (visibility < 500) alert = 'Dense fog/mist - Visibility critically low. Expect significant delays.';
      else if (windSpeed > 40) alert = 'Severe wind warning - Expect flight cancellations or delays.';
      else alert = 'Severe weather alert - Check flight status.';
    } else if (severity === 'yellow') {
      if (windSpeed > 25) alert = 'Strong wind advisory - Some flights may experience delays.';
      else if (visibility < 2000) alert = 'Reduced visibility - Expect possible delays.';
      else if (condition === 'Rainy') alert = 'Heavy rain expected - Possible flight delays.';
    }

    return {
      city,
      airportCode,
      temperature,
      condition: condition as any,
      humidity,
      windSpeed,
      windDirection,
      visibility,
      alert,
      severity,
      icon: getWeatherIcon(condition)
    };
  } catch (error) {
    console.error(`Error fetching weather for ${airportCode}:`, error);
    return null;
  }
};

// Fetch weather for multiple airports
export const fetchMultipleAirportsWeather = async (
  airports: Array<{ code: string; city: string; lat: number; lng: number }>
): Promise<Weather[]> => {
  const weatherPromises = airports.map(airport =>
    fetchAirportWeather(airport.code, airport.city, { lat: airport.lat, lng: airport.lng })
  );

  const results = await Promise.all(weatherPromises);
  return results.filter((weather): weather is Weather => weather !== null);
};

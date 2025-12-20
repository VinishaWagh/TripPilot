export type WeatherSeverity = 'green' | 'yellow' | 'red';
export type WeatherCondition = 'Clear' | 'Cloudy' | 'Rainy' | 'Foggy' | 'Stormy' | 'Hazy';

export interface Weather {
  city: string;
  airportCode: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  alert: string | null;
  severity: WeatherSeverity;
  icon: string;
}

export const weatherData: Weather[] = [
  {
    city: "Delhi",
    airportCode: "DEL",
    temperature: 12,
    condition: "Foggy",
    humidity: 92,
    windSpeed: 5,
    windDirection: "NW",
    visibility: 200,
    alert: "Dense fog advisory - Visibility below 200m. Expect delays.",
    severity: "red",
    icon: "🌫️"
  },
  {
    city: "Mumbai",
    airportCode: "BOM",
    temperature: 28,
    condition: "Rainy",
    humidity: 85,
    windSpeed: 25,
    windDirection: "SW",
    visibility: 3000,
    alert: "Heavy monsoon rain expected. Some flights may be delayed.",
    severity: "yellow",
    icon: "🌧️"
  },
  {
    city: "Bangalore",
    airportCode: "BLR",
    temperature: 24,
    condition: "Cloudy",
    humidity: 65,
    windSpeed: 12,
    windDirection: "E",
    visibility: 8000,
    alert: null,
    severity: "green",
    icon: "⛅"
  },
  {
    city: "Chennai",
    airportCode: "MAA",
    temperature: 32,
    condition: "Clear",
    humidity: 70,
    windSpeed: 18,
    windDirection: "SE",
    visibility: 10000,
    alert: null,
    severity: "green",
    icon: "☀️"
  },
  {
    city: "Kolkata",
    airportCode: "CCU",
    temperature: 26,
    condition: "Hazy",
    humidity: 78,
    windSpeed: 8,
    windDirection: "S",
    visibility: 4000,
    alert: "Moderate haze. Visibility reduced.",
    severity: "yellow",
    icon: "🌥️"
  },
  {
    city: "Hyderabad",
    airportCode: "HYD",
    temperature: 30,
    condition: "Clear",
    humidity: 55,
    windSpeed: 10,
    windDirection: "W",
    visibility: 10000,
    alert: null,
    severity: "green",
    icon: "☀️"
  },
  {
    city: "Ahmedabad",
    airportCode: "AMD",
    temperature: 34,
    condition: "Clear",
    humidity: 45,
    windSpeed: 15,
    windDirection: "NW",
    visibility: 10000,
    alert: null,
    severity: "green",
    icon: "☀️"
  },
  {
    city: "Pune",
    airportCode: "PNQ",
    temperature: 26,
    condition: "Cloudy",
    humidity: 72,
    windSpeed: 14,
    windDirection: "W",
    visibility: 7000,
    alert: null,
    severity: "green",
    icon: "⛅"
  },
  {
    city: "Kochi",
    airportCode: "COK",
    temperature: 29,
    condition: "Rainy",
    humidity: 88,
    windSpeed: 20,
    windDirection: "SW",
    visibility: 5000,
    alert: "Intermittent heavy showers. Minor delays possible.",
    severity: "yellow",
    icon: "🌧️"
  },
  {
    city: "Goa",
    airportCode: "GOI",
    temperature: 31,
    condition: "Cloudy",
    humidity: 75,
    windSpeed: 16,
    windDirection: "W",
    visibility: 8000,
    alert: null,
    severity: "green",
    icon: "⛅"
  }
];

export const getWeatherByAirport = (code: string): Weather | undefined => {
  return weatherData.find(w => w.airportCode === code);
};

export const getWeatherAlerts = (): Weather[] => {
  return weatherData.filter(w => w.alert !== null);
};

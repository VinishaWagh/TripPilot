import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Airport } from '@/data/airports';
import { Weather } from '@/data/weather';
import { getWeatherByAirport } from '@/data/weather';
import { cn } from '@/lib/utils';
import allAirportsData from '@/data/airports.json';
import { fetchAirportWeather } from '@/lib/weatherService';

interface AirportListWidgetProps {
  onAirportSelect: (airport: Airport) => void;
  selectedAirportCode: string | null;
}

// Filter and convert Indian airports from JSON
const getIndianAirports = (): Airport[] => {
  return (allAirportsData as any[])
    .filter(airport => airport.country === 'India')
    .map(airport => ({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      lat: parseFloat(airport.lat),
      lng: parseFloat(airport.lon),
      terminal: 1,
      amenities: { restaurants: 0, lounges: 0, shops: 0, services: 0 }
    }))
    .sort((a, b) => a.city.localeCompare(b.city));
};

export const AirportListWidget = ({ onAirportSelect, selectedAirportCode }: AirportListWidgetProps) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, Weather | null>>({});
  const [loading, setLoading] = useState(true);
  const [currentAirportIndex, setCurrentAirportIndex] = useState(0);

  // Initial load - get airports
  useEffect(() => {
    const indianAirports = getIndianAirports();
    setAirports(indianAirports);
    console.log(`Loaded ${indianAirports.length} Indian airports`);
    setLoading(false);
  }, []);

  // Fetch weather data in batches - 1 airport per minute to avoid rate limit
  useEffect(() => {
    if (airports.length === 0) return;

    const fetchNextAirportWeather = async () => {
      const airport = airports[currentAirportIndex];
      if (!airport) return;

      console.log(`[${currentAirportIndex + 1}/${airports.length}] Fetching weather for ${airport.code}...`);
      const weather = await fetchAirportWeather(airport.code, airport.city, {
        lat: airport.lat,
        lng: airport.lng
      });
      
      const weatherData = weather || getWeatherByAirport(airport.code) || null;
      console.log(`Weather for ${airport.code}:`, weatherData);
      
      setWeatherMap(prev => ({
        ...prev,
        [airport.code]: weatherData
      }));

      // Move to next airport
      if (currentAirportIndex < airports.length - 1) {
        setCurrentAirportIndex(prev => prev + 1);
      } else {
        // Reset to start fetching updates again after 1 minute
        console.log('Completed weather fetch cycle. Will refresh in 1 minute...');
        setTimeout(() => setCurrentAirportIndex(0), 60000);
      }
    };

    // Fetch weather for current airport
    fetchNextAirportWeather();

    // Set interval to fetch next airport every 30 seconds
    const interval = setInterval(fetchNextAirportWeather, 30000);
    return () => clearInterval(interval);
  }, [airports, currentAirportIndex]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'red': return 'border-destructive/50 bg-destructive/5';
      case 'yellow': return 'border-warning/50 bg-warning/5';
      default: return 'border-border/50';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-xl border border-border/50 overflow-hidden"
      >
        <div className="p-3 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Airports
          </h3>
        </div>
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading airports...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-xl border border-border/50 overflow-hidden"
    >
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Airports
        </h3>
        <span className="text-xs text-muted-foreground">{airports.length} total</span>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {airports.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No airports found
          </div>
        ) : (
          airports.map((airport, index) => {
            const weather = weatherMap[airport.code];
            const severity = weather?.severity || 'green';
            
            return (
              <motion.button
                key={airport.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAirportSelect(airport)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30 last:border-0",
                  selectedAirportCode === airport.code && "bg-primary/10",
                  getSeverityColor(severity)
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm">{airport.code}</span>
                    {weather && (
                      <span className="text-lg" title={weather.condition}>
                        {weather.icon}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{airport.name}</p>
                  <p className="text-xs text-muted-foreground">{airport.city}</p>
                </div>
                {weather && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium">{weather.temperature}°C</p>
                    <p className="text-xs text-muted-foreground">{weather.condition}</p>
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};


import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/effects/FadeIn';
import { StarBorder } from '@/components/effects/StarBorder';
import 'leaflet/dist/leaflet.css';

// Mock flight data
const mockFlights = [
  { id: 1, from: [40.6413, -73.7781], to: [51.4700, -0.4543], progress: 0, callsign: 'BA178', altitude: '38,000 ft', speed: '520 kts' },
  { id: 2, from: [33.9425, -118.4081], to: [35.5494, 139.7798], progress: 0, callsign: 'JL61', altitude: '41,000 ft', speed: '545 kts' },
  { id: 3, from: [25.2532, 55.3657], to: [1.3644, 103.9915], progress: 0, callsign: 'EK404', altitude: '36,000 ft', speed: '510 kts' },
  { id: 4, from: [49.0097, 2.5479], to: [40.6413, -73.7781], progress: 0, callsign: 'AF001', altitude: '39,000 ft', speed: '530 kts' },
  { id: 5, from: [-33.9461, 151.1772], to: [1.3644, 103.9915], progress: 0, callsign: 'SQ232', altitude: '37,000 ft', speed: '515 kts' },
];

export const FlightMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [flights, setFlights] = useState(mockFlights);
  const [selectedFlight, setSelectedFlight] = useState<typeof mockFlights[0] | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');

      // Custom plane icon
      const planeIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-30"></div>
            <div class="w-4 h-4 bg-primary rounded-full border-2 border-primary-foreground shadow-lg relative z-10"></div>
          </div>
        `,
        className: 'plane-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      // Initialize map
      const map = L.map(mapRef.current, {
        center: [30, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      // Dark map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add flight markers
      flights.forEach((flight) => {
        const currentPos = interpolatePosition(flight.from, flight.to, flight.progress);
        const marker = L.marker(currentPos as [number, number], { icon: planeIcon })
          .addTo(map)
          .on('click', () => setSelectedFlight(flight));
        markersRef.current.push({ marker, flight });
      });

      // Add zoom controls
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Animate flights
  useEffect(() => {
    const interval = setInterval(() => {
      setFlights((prev) =>
        prev.map((flight) => ({
          ...flight,
          progress: (flight.progress + 0.002) % 1,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Update marker positions
  useEffect(() => {
    markersRef.current.forEach(({ marker, flight: origFlight }) => {
      const updatedFlight = flights.find((f) => f.id === origFlight.id);
      if (updatedFlight) {
        const pos = interpolatePosition(updatedFlight.from, updatedFlight.to, updatedFlight.progress);
        marker.setLatLng(pos);
      }
    });
  }, [flights]);

  return (
    <div className="relative h-[500px] rounded-xl overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />

      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background/50 via-transparent to-background/50" />

      {/* Flight info overlay */}
      {selectedFlight && (
        <div className="absolute top-4 left-4 glass rounded-lg p-4 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-display font-bold text-primary">{selectedFlight.callsign}</span>
            <button
              onClick={() => setSelectedFlight(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Altitude:</span>
              <span className="text-foreground">{selectedFlight.altitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speed:</span>
              <span className="text-foreground">{selectedFlight.speed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          <span>{flights.length} Active Flights</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to interpolate between two positions
function interpolatePosition(from: number[], to: number[], progress: number): [number, number] {
  const lat = from[0] + (to[0] - from[0]) * progress;
  const lng = from[1] + (to[1] - from[1]) * progress;
  return [lat, lng];
}

export default FlightMap;

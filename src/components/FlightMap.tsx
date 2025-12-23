import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { flights, Flight } from '@/data/flights';
import { airports, getAirportByCode } from '@/data/airports';
import { getWeatherByAirport } from '@/data/weather';

interface FlightMapProps {
  selectedFlight: Flight | null;
  onFlightSelect: (flight: Flight) => void;
  selectedAirportCode: string | null;
}

interface AnimatedFlight extends Flight {
  progress: number;
  animatedLat: number;
  animatedLng: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Air': return '#3b82f6';
    case 'Delayed': return '#f59e0b';
    case 'On Time': return '#22c55e';
    case 'Boarding': return '#06b6d4';
    default: return '#6b7280';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'red': return '#ef4444';
    case 'yellow': return '#f59e0b';
    default: return '#22c55e';
  }
};

// Calculate bearing between two points
const calculateBearing = (startLat: number, startLng: number, endLat: number, endLng: number): number => {
  const startLatRad = startLat * Math.PI / 180;
  const startLngRad = startLng * Math.PI / 180;
  const endLatRad = endLat * Math.PI / 180;
  const endLngRad = endLng * Math.PI / 180;

  const dLng = endLngRad - startLngRad;

  const x = Math.sin(dLng) * Math.cos(endLatRad);
  const y = Math.cos(startLatRad) * Math.sin(endLatRad) -
            Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(dLng);

  let bearing = Math.atan2(x, y) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

// Interpolate position along great circle path
const interpolatePosition = (
  startLat: number, startLng: number,
  endLat: number, endLng: number,
  progress: number
): { lat: number; lng: number } => {
  // Simple linear interpolation for demo
  return {
    lat: startLat + (endLat - startLat) * progress,
    lng: startLng + (endLng - startLng) * progress
  };
};

export function FlightMap({ selectedFlight, onFlightSelect, selectedAirportCode }: FlightMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const airportMarkersRef = useRef<maplibregl.Marker[]>([]);
  const animationRef = useRef<number | null>(null);
  
  const [animatedFlights, setAnimatedFlights] = useState<AnimatedFlight[]>([]);

  const inAirFlights = useMemo(() => flights.filter(f => f.status === 'In Air'), []);

  // Initialize animated flights with progress
  useEffect(() => {
    const initialFlights = inAirFlights.map(flight => {
      const origin = getAirportByCode(flight.origin);
      const destination = getAirportByCode(flight.destination);
      if (!origin || !destination) return null;

      // Calculate initial progress based on current position
      const totalDist = Math.sqrt(
        Math.pow(destination.lat - origin.lat, 2) + 
        Math.pow(destination.lng - origin.lng, 2)
      );
      const traveledDist = Math.sqrt(
        Math.pow(flight.currentLat - origin.lat, 2) + 
        Math.pow(flight.currentLng - origin.lng, 2)
      );
      const progress = Math.min(0.95, Math.max(0.05, traveledDist / totalDist));

      return {
        ...flight,
        progress,
        animatedLat: flight.currentLat,
        animatedLng: flight.currentLng
      };
    }).filter(Boolean) as AnimatedFlight[];

    setAnimatedFlights(initialFlights);
  }, [inAirFlights]);

  // Real-time flight animation
  useEffect(() => {
    const animateFlights = () => {
      setAnimatedFlights(prev => prev.map(flight => {
        const origin = getAirportByCode(flight.origin);
        const destination = getAirportByCode(flight.destination);
        if (!origin || !destination) return flight;

        // Increment progress (simulate real-time movement)
        const newProgress = (flight.progress + 0.0005) % 1;
        const resetProgress = newProgress < flight.progress ? 0.05 : newProgress;

        const newPos = interpolatePosition(
          origin.lat, origin.lng,
          destination.lat, destination.lng,
          resetProgress
        );

        return {
          ...flight,
          progress: resetProgress,
          animatedLat: newPos.lat,
          animatedLng: newPos.lng
        };
      }));

      animationRef.current = requestAnimationFrame(animateFlights);
    };

    animationRef.current = requestAnimationFrame(animateFlights);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '&copy; CARTO, &copy; OpenStreetMap contributors'
          }
        },
        layers: [{
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19
        }],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
      },
      center: [78.9629, 20.5937],
      zoom: 4.5,
      pitch: 0,
      bearing: 0,
      maxBounds: [[60, 5], [100, 40]] // Restrict to India region
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    // Add atmosphere/glow effect when map loads
    map.current.on('load', () => {
      // Add a subtle grid overlay
      if (map.current?.getSource('grid')) return;
      
      // Create grid lines for aviation feel
      const gridFeatures: GeoJSON.Feature[] = [];
      
      // Add latitude lines
      for (let lat = 10; lat <= 35; lat += 5) {
        gridFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[68, lat], [98, lat]]
          }
        });
      }
      
      // Add longitude lines
      for (let lng = 70; lng <= 95; lng += 5) {
        gridFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[lng, 8], [lng, 37]]
          }
        });
      }

      map.current?.addSource('grid', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: gridFeatures
        }
      });

      map.current?.addLayer({
        id: 'grid-lines',
        type: 'line',
        source: 'grid',
        paint: {
          'line-color': '#1e40af',
          'line-width': 0.5,
          'line-opacity': 0.15
        }
      });
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      airportMarkersRef.current.forEach(m => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add airport markers (static)
  useEffect(() => {
    if (!map.current) return;

    // Clear existing airport markers
    airportMarkersRef.current.forEach(m => m.remove());
    airportMarkersRef.current = [];

    airports.forEach((airport) => {
      const weather = getWeatherByAirport(airport.code);
      const severity = weather?.severity || 'green';
      const borderColor = getSeverityColor(severity);
      const pulseColor = severity === 'red' ? 'rgba(239, 68, 68, 0.4)' : 
                        severity === 'yellow' ? 'rgba(245, 158, 11, 0.3)' : 
                        'rgba(34, 197, 94, 0.2)';

      const el = document.createElement('div');
      el.className = 'airport-marker-container';
      el.innerHTML = `
        <div class="airport-marker-wrapper" style="position:relative;width:40px;height:40px;">
          <div class="airport-pulse" style="
            position:absolute;
            inset:0;
            background:${pulseColor};
            border-radius:50%;
            animation:radar-pulse 2s ease-out infinite;
          "></div>
          <div style="
            position:absolute;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
            width:24px;height:24px;
            background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border:2px solid ${borderColor};
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 20px ${borderColor}40, inset 0 1px 0 rgba(255,255,255,0.1);
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="${borderColor}">
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ 
        offset: 25,
        className: 'flight-popup'
      }).setHTML(`
        <div style="
          padding:12px;
          background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color:white;
          border-radius:12px;
          font-family:system-ui;
          min-width:180px;
          border:1px solid rgba(59, 130, 246, 0.3);
          box-shadow:0 10px 40px rgba(0,0,0,0.5);
        ">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="
              font-size:16px;font-weight:700;
              background:linear-gradient(135deg, #3b82f6, #60a5fa);
              -webkit-background-clip:text;
              -webkit-text-fill-color:transparent;
              font-family:monospace;
            ">${airport.code}</span>
            <span style="font-size:13px;color:#94a3b8;">${airport.city}</span>
          </div>
          ${weather ? `
            <div style="display:flex;align-items:center;gap:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;">
              <span style="font-size:20px;">${weather.icon}</span>
              <div>
                <div style="font-size:16px;font-weight:600;">${weather.temperature}°C</div>
                <div style="font-size:11px;color:#94a3b8;">${weather.condition}</div>
              </div>
            </div>
            ${weather.alert ? `
              <div style="margin-top:8px;padding:6px 8px;background:rgba(239,68,68,0.2);border-radius:6px;border-left:3px solid #ef4444;">
                <div style="font-size:10px;color:#fca5a5;">⚠️ ${weather.alert}</div>
              </div>
            ` : ''}
          ` : ''}
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([airport.lng, airport.lat])
        .setPopup(popup)
        .addTo(map.current!);

      airportMarkersRef.current.push(marker);
    });
  }, []);

  // Update flight markers in real-time
  useEffect(() => {
    if (!map.current) return;

    animatedFlights.forEach((flight) => {
      const origin = getAirportByCode(flight.origin);
      const destination = getAirportByCode(flight.destination);
      const bearing = origin && destination 
        ? calculateBearing(flight.animatedLat, flight.animatedLng, destination.lat, destination.lng)
        : flight.heading;

      const color = getStatusColor(flight.status);
      const isSelected = selectedFlight?.id === flight.id;

      if (markersRef.current.has(flight.id)) {
        // Update existing marker position
        const marker = markersRef.current.get(flight.id)!;
        marker.setLngLat([flight.animatedLng, flight.animatedLat]);
        
        // Update rotation
        const el = marker.getElement();
        const planeEl = el.querySelector('.plane-icon') as HTMLElement;
        if (planeEl) {
          planeEl.style.transform = `rotate(${bearing - 90}deg)`;
        }
        
        // Update selected state
        const wrapper = el.querySelector('.flight-marker-wrapper') as HTMLElement;
        if (wrapper) {
          wrapper.style.transform = isSelected ? 'scale(1.3)' : 'scale(1)';
        }
      } else {
        // Create new marker
        const el = document.createElement('div');
        el.className = 'flight-marker';
        el.style.cursor = 'pointer';
        el.innerHTML = `
          <div class="flight-marker-wrapper" style="
            position:relative;
            width:48px;height:48px;
            transition:transform 0.3s ease;
            ${isSelected ? 'transform:scale(1.3);' : ''}
          ">
            <div class="flight-trail" style="
              position:absolute;
              top:50%;left:50%;
              width:60px;height:4px;
              background:linear-gradient(90deg, transparent, ${color}40, ${color}80);
              transform-origin:right center;
              transform:translate(-100%, -50%) rotate(${bearing + 90}deg);
              border-radius:2px;
              filter:blur(2px);
            "></div>
            <div class="flight-glow" style="
              position:absolute;
              inset:-8px;
              background:radial-gradient(circle, ${color}30 0%, transparent 70%);
              animation:pulse 1.5s ease-in-out infinite;
            "></div>
            <div class="plane-icon" style="
              position:absolute;
              top:50%;left:50%;
              transform:translate(-50%,-50%) rotate(${bearing - 90}deg);
              width:32px;height:32px;
              display:flex;align-items:center;justify-content:center;
              filter:drop-shadow(0 0 8px ${color}) drop-shadow(0 2px 4px rgba(0,0,0,0.5));
              transition:transform 0.1s linear;
            ">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="${color}">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div style="
              position:absolute;
              bottom:-18px;left:50%;
              transform:translateX(-50%);
              font-size:9px;
              font-family:monospace;
              font-weight:600;
              color:${color};
              text-shadow:0 1px 2px rgba(0,0,0,0.8);
              white-space:nowrap;
              background:rgba(0,0,0,0.6);
              padding:2px 4px;
              border-radius:3px;
            ">${flight.flightNumber}</div>
          </div>
        `;

        el.addEventListener('click', () => onFlightSelect(flight));

        const popup = new maplibregl.Popup({ 
          offset: 25,
          className: 'flight-popup'
        }).setHTML(`
          <div style="
            padding:12px;
            background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color:white;
            border-radius:12px;
            font-family:system-ui;
            min-width:200px;
            border:1px solid ${color}50;
            box-shadow:0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${color}20;
          ">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="
                font-size:18px;font-weight:700;
                color:${color};
                font-family:monospace;
              ">${flight.flightNumber}</span>
              <span style="
                font-size:10px;
                padding:3px 8px;
                background:${color}30;
                color:${color};
                border-radius:12px;
                font-weight:600;
              ">${flight.status}</span>
            </div>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">${flight.airline}</div>
            <div style="
              display:flex;align-items:center;gap:8px;
              padding:8px;
              background:rgba(0,0,0,0.3);
              border-radius:8px;
              margin-bottom:8px;
            ">
              <span style="font-family:monospace;font-weight:600;">${flight.origin}</span>
              <div style="flex:1;height:2px;background:linear-gradient(90deg,${color},${color}40);position:relative;">
                <div style="position:absolute;left:${Math.round(flight.progress * 100)}%;top:-4px;transform:translateX(-50%);">✈️</div>
              </div>
              <span style="font-family:monospace;font-weight:600;">${flight.destination}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;">
              <div style="background:rgba(0,0,0,0.2);padding:6px;border-radius:6px;">
                <div style="color:#64748b;font-size:9px;">ALTITUDE</div>
                <div style="color:white;font-weight:600;">${flight.altitude.toLocaleString()} ft</div>
              </div>
              <div style="background:rgba(0,0,0,0.2);padding:6px;border-radius:6px;">
                <div style="color:#64748b;font-size:9px;">SPEED</div>
                <div style="color:white;font-weight:600;">${flight.speed} kts</div>
              </div>
            </div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([flight.animatedLng, flight.animatedLat])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.set(flight.id, marker);
      }
    });

    // Remove markers for flights no longer in air
    markersRef.current.forEach((marker, id) => {
      if (!animatedFlights.find(f => f.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [animatedFlights, selectedFlight, onFlightSelect]);

  // Fly to selected flight or airport
  useEffect(() => {
    if (!map.current) return;

    if (selectedFlight && selectedFlight.status === 'In Air') {
      map.current.flyTo({
        center: [selectedFlight.currentLng, selectedFlight.currentLat],
        zoom: 6,
        duration: 1500,
        essential: true
      });
    } else if (selectedAirportCode) {
      const airport = getAirportByCode(selectedAirportCode);
      if (airport) {
        map.current.flyTo({
          center: [airport.lng, airport.lat],
          zoom: 9,
          duration: 1500,
          essential: true
        });
      }
    }
  }, [selectedFlight, selectedAirportCode]);

  // Draw flight path for selected flight
  useEffect(() => {
    if (!map.current) return;

    const sourceId = 'flight-path';
    const glowLayerId = 'flight-path-glow';
    const traveledLayerId = 'flight-path-traveled';
    const remainingLayerId = 'flight-path-remaining';

    // Remove existing layers and source
    [glowLayerId, traveledLayerId, remainingLayerId].forEach(id => {
      if (map.current?.getLayer(id)) map.current.removeLayer(id);
    });
    if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

    if (!selectedFlight) return;

    const origin = getAirportByCode(selectedFlight.origin);
    const destination = getAirportByCode(selectedFlight.destination);
    if (!origin || !destination) return;

    const animatedFlight = animatedFlights.find(f => f.id === selectedFlight.id);
    const currentLat = animatedFlight?.animatedLat || selectedFlight.currentLat;
    const currentLng = animatedFlight?.animatedLng || selectedFlight.currentLng;

    // Create curved path points
    const numPoints = 50;
    const traveledPoints: [number, number][] = [];
    const remainingPoints: [number, number][] = [];
    
    const progress = animatedFlight?.progress || 0.5;
    const progressIndex = Math.floor(progress * numPoints);

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const lat = origin.lat + (destination.lat - origin.lat) * t;
      const lng = origin.lng + (destination.lng - origin.lng) * t;
      
      // Add slight curve for visual appeal
      const curve = Math.sin(t * Math.PI) * 0.5;
      const adjustedLat = lat + curve;

      if (i <= progressIndex) {
        traveledPoints.push([lng, adjustedLat]);
      }
      if (i >= progressIndex) {
        remainingPoints.push([lng, adjustedLat]);
      }
    }

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { type: 'traveled' },
            geometry: { type: 'LineString', coordinates: traveledPoints }
          },
          {
            type: 'Feature',
            properties: { type: 'remaining' },
            geometry: { type: 'LineString', coordinates: remainingPoints }
          }
        ]
      }
    });

    // Glow layer
    map.current.addLayer({
      id: glowLayerId,
      type: 'line',
      source: sourceId,
      filter: ['==', ['get', 'type'], 'traveled'],
      paint: {
        'line-color': '#3b82f6',
        'line-width': 12,
        'line-opacity': 0.15,
        'line-blur': 8
      }
    });

    // Traveled path
    map.current.addLayer({
      id: traveledLayerId,
      type: 'line',
      source: sourceId,
      filter: ['==', ['get', 'type'], 'traveled'],
      paint: {
        'line-color': '#3b82f6',
        'line-width': 3,
        'line-opacity': 0.9
      }
    });

    // Remaining path (dashed)
    map.current.addLayer({
      id: remainingLayerId,
      type: 'line',
      source: sourceId,
      filter: ['==', ['get', 'type'], 'remaining'],
      paint: {
        'line-color': '#3b82f6',
        'line-width': 2,
        'line-opacity': 0.4,
        'line-dasharray': [4, 4]
      }
    });
  }, [selectedFlight, animatedFlights]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Radar overlay effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 right-20 w-32 h-32 opacity-20">
          <div className="absolute inset-0 border border-primary/30 rounded-full" />
          <div className="absolute inset-4 border border-primary/20 rounded-full" />
          <div className="absolute inset-8 border border-primary/10 rounded-full" />
          <div 
            className="absolute inset-0 origin-center"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(59, 130, 246, 0.3) 30deg, transparent 60deg)',
              animation: 'radar-sweep 4s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-8 left-4 glass rounded-lg p-3 text-xs space-y-2">
        <div className="font-semibold text-foreground/80 mb-2">Flight Status</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
          <span className="text-muted-foreground">In Air</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          <span className="text-muted-foreground">On Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
          <span className="text-muted-foreground">Delayed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
          <span className="text-muted-foreground">Boarding</span>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 flex items-center gap-2">
        <div className="relative">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-mono font-semibold text-foreground/80">LIVE TRACKING</span>
      </div>

      <style>{`
        @keyframes radar-pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-popup-tip {
          display: none !important;
        }
        .maplibregl-ctrl-group {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
        }
        .maplibregl-ctrl-group button {
          background: transparent !important;
        }
        .maplibregl-ctrl-group button:hover {
          background: rgba(59, 130, 246, 0.2) !important;
        }
        .maplibregl-ctrl-group button span {
          filter: invert(1) !important;
        }
      `}</style>
    </div>
  );
}
import { motion } from 'framer-motion';
import { Plane, Clock } from 'lucide-react';
import { flights, Flight } from '@/data/flights';
import { cn } from '@/lib/utils';

interface FlightListWidgetProps {
  onFlightSelect: (flight: Flight) => void;
  selectedFlightId: string | null;
}

export const FlightListWidget = ({ onFlightSelect, selectedFlightId }: FlightListWidgetProps) => {
  const inAirFlights = flights.filter(f => f.status === 'In Air');
  
  const getStatusDot = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-success';
      case 'Delayed': return 'bg-warning';
      case 'In Air': return 'bg-primary animate-pulse';
      case 'Boarding': return 'bg-accent';
      case 'Landed': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-xl border border-border/50 overflow-hidden"
    >
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Plane className="w-4 h-4 text-primary" />
          Live Flights
        </h3>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {inAirFlights.map((flight, index) => (
          <motion.button
            key={flight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onFlightSelect(flight)}
            className={cn(
              "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30 last:border-0",
              selectedFlightId === flight.id && "bg-primary/10"
            )}
          >
            <div className="relative">
              <div className={cn("w-2 h-2 rounded-full", getStatusDot(flight.status))} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-sm">{flight.flightNumber}</span>
                <span className="text-xs text-muted-foreground">{flight.airline}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{flight.origin}</span>
                <span>→</span>
                <span>{flight.destination}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium">{flight.altitude.toLocaleString()} ft</p>
              <p className="text-xs text-muted-foreground">{flight.speed} kts</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FlightMap } from '@/components/FlightMap';
import { FlightInfoPanel } from '@/components/FlightInfoPanel';
import { WeatherWidget } from '@/components/WeatherWidget';
import { AIChatbot } from '@/components/AIChatbot';
import { AirportAmenitiesPanel } from '@/components/AirportAmenitiesPanel';
import { FlightListWidget } from '@/components/FlightListWidget';
import { Flight } from '@/data/flights';
import { Airport } from '@/data/airports';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedAirportCode, setSelectedAirportCode] = useState<string | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowAmenities(false);
    setSelectedAirportCode(null);
  };

  const handleAirportSelect = (airport: Airport) => {
    setSelectedAirportCode(airport.code);
    setShowAmenities(true);
    setSelectedFlight(null);
  };

  const handleClosePanel = () => {
    setSelectedFlight(null);
    setShowAmenities(false);
    setSelectedAirportCode(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

      {/* Map takes full screen */}
      <div className="fixed inset-0 pt-14">
        <FlightMap
          selectedFlight={selectedFlight}
          onFlightSelect={handleFlightSelect}
          selectedAirportCode={selectedAirportCode}
        />
      </div>

      {/* Floating UI */}
      <div className="fixed top-20 left-4 z-20 flex flex-col gap-4 max-w-xs">
        <SearchBar onFlightSelect={handleFlightSelect} onAirportSelect={handleAirportSelect} />
        <FlightListWidget onFlightSelect={handleFlightSelect} selectedFlightId={selectedFlight?.id || null} />
        <WeatherWidget />
      </div>

      <AnimatePresence>
        {selectedFlight && !showAmenities && (
          <FlightInfoPanel flight={selectedFlight} onClose={handleClosePanel} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAmenities && selectedAirportCode && (
          <AirportAmenitiesPanel airportCode={selectedAirportCode} onClose={handleClosePanel} />
        )}
      </AnimatePresence>

      <AIChatbot />
    </div>
  );
};

export default Index;

export interface Hotel {
  id: string;
  name: string;
  airportCode: string;
  distanceKm: number;
  rating: number;
  priceFrom: number;
  description: string;
}

export const hotels: Hotel[] = [
  { id: 'bom-h1', name: 'Taj Santacruz', airportCode: 'BOM', distanceKm: 2.1, rating: 4.6, priceFrom: 8500, description: 'Luxury hotel near the airport with shuttle.' },
  { id: 'del-h1', name: 'Holiday Inn New Delhi Intl.', airportCode: 'DEL', distanceKm: 1.5, rating: 4.2, priceFrom: 5200, description: 'Comfortable stay with 24/7 service.' },
  { id: 'blr-h1', name: 'The Lalit Ashok', airportCode: 'BLR', distanceKm: 6.8, rating: 4.4, priceFrom: 6200, description: 'City hotel with airport transfer.' },
  { id: 'hyd-h1', name: 'ITC Kakatiya', airportCode: 'HYD', distanceKm: 4.3, rating: 4.5, priceFrom: 7000, description: 'Premium hotel with great dining options.' },
  { id: 'ccu-h1', name: 'The Park Kolkata', airportCode: 'CCU', distanceKm: 11.2, rating: 4.1, priceFrom: 4800, description: 'Boutique hotel in the city.' }
];

export const getHotelsByAirport = (code: string) => hotels.filter(h => h.airportCode === code);

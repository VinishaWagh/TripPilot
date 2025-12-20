export interface Amenity {
  id: string;
  name: string;
  type: 'restaurant' | 'lounge' | 'shop' | 'service';
  airportCode: string;
  terminal: string;
  rating: number;
  description: string;
  hours: string;
  icon: string;
}

export const amenities: Amenity[] = [
  // Delhi Airport
  { id: "del-1", name: "Maharaja Lounge", type: "lounge", airportCode: "DEL", terminal: "T3", rating: 4.8, description: "Premium lounge with spa services", hours: "24/7", icon: "🛋️" },
  { id: "del-2", name: "Punjab Grill", type: "restaurant", airportCode: "DEL", terminal: "T3", rating: 4.5, description: "Authentic North Indian cuisine", hours: "6AM - 11PM", icon: "🍛" },
  { id: "del-3", name: "Café Coffee Day", type: "restaurant", airportCode: "DEL", terminal: "T1", rating: 4.0, description: "Coffee and quick bites", hours: "5AM - 12AM", icon: "☕" },
  { id: "del-4", name: "DFS Duty Free", type: "shop", airportCode: "DEL", terminal: "T3", rating: 4.3, description: "Luxury brands and spirits", hours: "24/7", icon: "🛍️" },
  { id: "del-5", name: "Currency Exchange", type: "service", airportCode: "DEL", terminal: "T3", rating: 4.1, description: "Thomas Cook forex services", hours: "24/7", icon: "💱" },
  
  // Mumbai Airport
  { id: "bom-1", name: "GVK Lounge", type: "lounge", airportCode: "BOM", terminal: "T2", rating: 4.7, description: "Art-themed premium lounge", hours: "24/7", icon: "🛋️" },
  { id: "bom-2", name: "Masala Library", type: "restaurant", airportCode: "BOM", terminal: "T2", rating: 4.6, description: "Modern Indian molecular gastronomy", hours: "7AM - 11PM", icon: "🍽️" },
  { id: "bom-3", name: "Starbucks", type: "restaurant", airportCode: "BOM", terminal: "T2", rating: 4.2, description: "Premium coffee and pastries", hours: "5AM - 11PM", icon: "☕" },
  { id: "bom-4", name: "WHSmith", type: "shop", airportCode: "BOM", terminal: "T2", rating: 4.0, description: "Books, magazines, travel essentials", hours: "24/7", icon: "📚" },
  
  // Bangalore Airport
  { id: "blr-1", name: "Plaza Premium Lounge", type: "lounge", airportCode: "BLR", terminal: "T1", rating: 4.5, description: "Modern lounge with shower facilities", hours: "24/7", icon: "🛋️" },
  { id: "blr-2", name: "Karavalli", type: "restaurant", airportCode: "BLR", terminal: "T1", rating: 4.4, description: "Coastal Karnataka cuisine", hours: "6AM - 10PM", icon: "🦐" },
  { id: "blr-3", name: "The Beer Café", type: "restaurant", airportCode: "BLR", terminal: "T2", rating: 4.3, description: "Craft beers and pub food", hours: "11AM - 11PM", icon: "🍺" },
  
  // Chennai Airport
  { id: "maa-1", name: "Travel Club Lounge", type: "lounge", airportCode: "MAA", terminal: "T1", rating: 4.2, description: "Business lounge with WiFi", hours: "24/7", icon: "🛋️" },
  { id: "maa-2", name: "Saravana Bhavan", type: "restaurant", airportCode: "MAA", terminal: "T1", rating: 4.5, description: "Authentic South Indian vegetarian", hours: "5AM - 11PM", icon: "🥘" },
  
  // Kolkata Airport
  { id: "ccu-1", name: "Kaya Kalp Lounge", type: "lounge", airportCode: "CCU", terminal: "T2", rating: 4.3, description: "Spa and relaxation lounge", hours: "6AM - 12AM", icon: "🛋️" },
  { id: "ccu-2", name: "Oh! Calcutta", type: "restaurant", airportCode: "CCU", terminal: "T2", rating: 4.4, description: "Bengali cuisine specialties", hours: "7AM - 10PM", icon: "🍛" },
  
  // Hyderabad Airport
  { id: "hyd-1", name: "Encalm Lounge", type: "lounge", airportCode: "HYD", terminal: "T1", rating: 4.6, description: "Premium lounge with Hyderabadi cuisine", hours: "24/7", icon: "🛋️" },
  { id: "hyd-2", name: "Paradise Biryani", type: "restaurant", airportCode: "HYD", terminal: "T1", rating: 4.7, description: "Famous Hyderabadi biryani", hours: "6AM - 11PM", icon: "🍚" },
  
  // Common services across airports
  { id: "srv-1", name: "SBI ATM", type: "service", airportCode: "DEL", terminal: "All", rating: 4.0, description: "24-hour banking services", hours: "24/7", icon: "🏧" },
  { id: "srv-2", name: "Medical Center", type: "service", airportCode: "BOM", terminal: "T2", rating: 4.5, description: "Emergency medical services", hours: "24/7", icon: "🏥" },
  { id: "srv-3", name: "Prayer Room", type: "service", airportCode: "DEL", terminal: "T3", rating: 4.8, description: "Multi-faith prayer facility", hours: "24/7", icon: "🙏" },
];

export const getAmenitiesByAirport = (airportCode: string): Amenity[] => {
  return amenities.filter(a => a.airportCode === airportCode);
};

export const getAmenitiesByType = (airportCode: string, type: Amenity['type']): Amenity[] => {
  return amenities.filter(a => a.airportCode === airportCode && a.type === type);
};

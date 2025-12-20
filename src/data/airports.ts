export interface Airport {
  code: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  terminal: number;
  amenities: {
    restaurants: number;
    lounges: number;
    shops: number;
    services: number;
  };
}

export const airports: Airport[] = [
  {
    code: "DEL",
    name: "Indira Gandhi International Airport",
    city: "Delhi",
    lat: 28.5562,
    lng: 77.1000,
    terminal: 3,
    amenities: { restaurants: 45, lounges: 12, shops: 80, services: 25 }
  },
  {
    code: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    lat: 19.0896,
    lng: 72.8656,
    terminal: 2,
    amenities: { restaurants: 38, lounges: 10, shops: 65, services: 20 }
  },
  {
    code: "BLR",
    name: "Kempegowda International Airport",
    city: "Bangalore",
    lat: 13.1986,
    lng: 77.7066,
    terminal: 2,
    amenities: { restaurants: 32, lounges: 8, shops: 55, services: 18 }
  },
  {
    code: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    lat: 12.9941,
    lng: 80.1709,
    terminal: 1,
    amenities: { restaurants: 25, lounges: 6, shops: 40, services: 15 }
  },
  {
    code: "CCU",
    name: "Netaji Subhas Chandra Bose International Airport",
    city: "Kolkata",
    lat: 22.6547,
    lng: 88.4467,
    terminal: 2,
    amenities: { restaurants: 22, lounges: 5, shops: 35, services: 12 }
  },
  {
    code: "HYD",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    lat: 17.2403,
    lng: 78.4294,
    terminal: 1,
    amenities: { restaurants: 28, lounges: 7, shops: 45, services: 16 }
  },
  {
    code: "AMD",
    name: "Sardar Vallabhbhai Patel International Airport",
    city: "Ahmedabad",
    lat: 23.0772,
    lng: 72.6347,
    terminal: 2,
    amenities: { restaurants: 18, lounges: 4, shops: 30, services: 10 }
  },
  {
    code: "PNQ",
    name: "Pune International Airport",
    city: "Pune",
    lat: 18.5822,
    lng: 73.9197,
    terminal: 1,
    amenities: { restaurants: 12, lounges: 3, shops: 20, services: 8 }
  },
  {
    code: "COK",
    name: "Cochin International Airport",
    city: "Kochi",
    lat: 10.1520,
    lng: 76.4019,
    terminal: 3,
    amenities: { restaurants: 20, lounges: 5, shops: 35, services: 12 }
  },
  {
    code: "GOI",
    name: "Goa International Airport",
    city: "Goa",
    lat: 15.3808,
    lng: 73.8314,
    terminal: 1,
    amenities: { restaurants: 15, lounges: 4, shops: 25, services: 10 }
  }
];

export const getAirportByCode = (code: string): Airport | undefined => {
  return airports.find(a => a.code === code);
};

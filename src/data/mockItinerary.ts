export interface ItineraryItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity';
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  details?: {
    flightNumber?: string;
    airline?: string;
    from?: string;
    to?: string;
    hotelName?: string;
    checkIn?: string;
    checkOut?: string;
  };
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  items: ItineraryItem[];
}

export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    name: 'Goa Beach Vacation',
    destination: 'Goa, India',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    status: 'upcoming',
    items: [
      {
        id: 'item-1',
        type: 'flight',
        title: 'Flight to Goa',
        description: 'Departure from Mumbai',
        date: '2025-01-15',
        time: '08:30',
        location: 'Mumbai Airport (BOM)',
        status: 'confirmed',
        details: {
          flightNumber: 'AI-505',
          airline: 'Air India',
          from: 'Mumbai (BOM)',
          to: 'Goa (GOI)',
        },
      },
      {
        id: 'item-2',
        type: 'hotel',
        title: 'Hotel Check-in',
        description: 'Taj Exotica Resort & Spa',
        date: '2025-01-15',
        time: '14:00',
        location: 'Benaulim, South Goa',
        status: 'confirmed',
        details: {
          hotelName: 'Taj Exotica Resort & Spa',
          checkIn: '2025-01-15',
          checkOut: '2025-01-20',
        },
      },
      {
        id: 'item-3',
        type: 'activity',
        title: 'Sunset Beach Tour',
        description: 'Guided tour of famous Goa beaches',
        date: '2025-01-16',
        time: '16:00',
        location: 'Calangute Beach',
        status: 'pending',
      },
    ],
  },
  {
    id: 'trip-2',
    name: 'Delhi Heritage Tour',
    destination: 'Delhi, India',
    startDate: '2025-02-10',
    endDate: '2025-02-14',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    status: 'upcoming',
    items: [
      {
        id: 'item-4',
        type: 'flight',
        title: 'Flight to Delhi',
        description: 'Departure from Bangalore',
        date: '2025-02-10',
        time: '06:00',
        location: 'Bangalore Airport (BLR)',
        status: 'confirmed',
        details: {
          flightNumber: '6E-201',
          airline: 'IndiGo',
          from: 'Bangalore (BLR)',
          to: 'Delhi (DEL)',
        },
      },
    ],
  },
  {
    id: 'trip-3',
    name: 'Kerala Backwaters',
    destination: 'Alleppey, Kerala',
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    status: 'completed',
    items: [],
  },
];

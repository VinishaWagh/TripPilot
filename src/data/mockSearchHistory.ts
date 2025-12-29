export interface SearchHistoryItem {
  id: string;
  type: 'flight' | 'airport';
  query: string;
  timestamp: string;
  details: {
    from?: string;
    to?: string;
    date?: string;
    flightNumber?: string;
    airportCode?: string;
    airportName?: string;
  };
  resultCount?: number;
}

export const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: 'search-1',
    type: 'flight',
    query: 'Mumbai to Delhi flights',
    timestamp: '2024-12-28T14:30:00Z',
    details: {
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      date: '2025-01-15',
    },
    resultCount: 24,
  },
  {
    id: 'search-2',
    type: 'airport',
    query: 'DEL airport',
    timestamp: '2024-12-28T12:15:00Z',
    details: {
      airportCode: 'DEL',
      airportName: 'Indira Gandhi International Airport',
    },
    resultCount: 1,
  },
  {
    id: 'search-3',
    type: 'flight',
    query: 'AI-505',
    timestamp: '2024-12-27T18:45:00Z',
    details: {
      flightNumber: 'AI-505',
      from: 'Mumbai (BOM)',
      to: 'Goa (GOI)',
    },
    resultCount: 1,
  },
  {
    id: 'search-4',
    type: 'flight',
    query: 'Bangalore to Chennai',
    timestamp: '2024-12-27T10:00:00Z',
    details: {
      from: 'Bangalore (BLR)',
      to: 'Chennai (MAA)',
      date: '2025-02-01',
    },
    resultCount: 18,
  },
  {
    id: 'search-5',
    type: 'airport',
    query: 'BOM terminal info',
    timestamp: '2024-12-26T16:30:00Z',
    details: {
      airportCode: 'BOM',
      airportName: 'Chhatrapati Shivaji Maharaj International Airport',
    },
    resultCount: 1,
  },
  {
    id: 'search-6',
    type: 'flight',
    query: 'IndiGo 6E-201',
    timestamp: '2024-12-26T09:20:00Z',
    details: {
      flightNumber: '6E-201',
      from: 'Bangalore (BLR)',
      to: 'Delhi (DEL)',
    },
    resultCount: 1,
  },
  {
    id: 'search-7',
    type: 'airport',
    query: 'Hyderabad airport lounges',
    timestamp: '2024-12-25T20:00:00Z',
    details: {
      airportCode: 'HYD',
      airportName: 'Rajiv Gandhi International Airport',
    },
    resultCount: 5,
  },
  {
    id: 'search-8',
    type: 'flight',
    query: 'Kolkata to Mumbai tomorrow',
    timestamp: '2024-12-25T11:45:00Z',
    details: {
      from: 'Kolkata (CCU)',
      to: 'Mumbai (BOM)',
      date: '2024-12-26',
    },
    resultCount: 12,
  },
];

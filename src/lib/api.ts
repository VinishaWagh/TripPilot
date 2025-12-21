import { flights, searchFlights, getFlightById } from '@/data/flights';
import { getWeatherByAirport } from '@/data/weather';
import { getAmenitiesByAirport } from '@/data/amenities';
import { getHotelsByAirport } from '@/data/hotels';

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms + Math.random() * 300));

export async function searchFlight(query: string) {
  await wait();
  const results = searchFlights(query);
  return results;
}

export async function getFlightLocation(flightId: string) {
  await wait();
  const flight = getFlightById(flightId);
  if (!flight) throw new Error('Flight not found');
  return {
    lat: flight.currentLat,
    lng: flight.currentLng,
    altitude: flight.altitude,
    speed: flight.speed,
    heading: flight.heading,
  };
}

export async function getWeather(airportCode: string) {
  await wait();
  return getWeatherByAirport(airportCode);
}

export async function getAmenities(airportCode: string) {
  await wait();
  return getAmenitiesByAirport(airportCode);
}

export async function getHotels(airportCode: string) {
  await wait();
  return getHotelsByAirport(airportCode);
}

export async function getFlightByCodeOrNumber(code: string) {
  await wait();
  const q = code.trim().toLowerCase();
  const found = flights.find(f => f.flightNumber.toLowerCase() === q || f.id === q);
  return found || null;
}

export default {
  searchFlight,
  getFlightLocation,
  getWeather,
  getAmenities,
  getFlightByCodeOrNumber,
};

import type { Property } from '../features/properties/types';

export const mockProperties: Property[] = [
  {
    id: '1',
    location: 'Bogotá',
    address: 'Cra 15 #45-23',
    neighborhood: 'Chapinero',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    operation: 'Rent',
    price: 2500000,
    squareMeters: 80,
    description: 'Modern apartment close to universities and public transport.',
    img: 'https://placehold.co/400x300?text=Property+1'
  },
  {
    id: '2',
    location: 'Medellín',
    address: 'Calle 33 #66-12',
    neighborhood: 'El Poblado',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    operation: 'Sale',
    price: 850000000,
    squareMeters: 180,
    description: 'Spacious house with garden and garage in a quiet area.',
    img: 'https://placehold.co/400x300?text=Property+2'
  },
  {
    id: '3',
    location: 'Cali',
    address: 'Av 6N #12-34',
    neighborhood: 'Granada',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    operation: 'Sale',
    price: 450000000,
    squareMeters: 100,
    description: 'Well-lit apartment with balcony and view of the city.',
    img: 'https://placehold.co/400x300?text=Property+3'
  },
  {
    id: '4',
    location: 'Barranquilla',
    address: 'Cra 54 #76-45',
    neighborhood: 'Alto Prado',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    operation: 'Rent',
    price: 1200000,
    squareMeters: 45,
    description: 'Perfect for singles or couples, near shopping centers.',
    img: 'https://placehold.co/400x300?text=Property+4'
  },
  {
    id: '5',
    location: 'Bogotá',
    address: 'Calle 100 #8A-20',
    neighborhood: 'Santa Bárbara',
    type: 'House',
    bedrooms: 5,
    bathrooms: 4,
    operation: 'Sale',
    price: 1200000000,
    squareMeters: 240,
    description: 'Luxury house with private parking and terrace.',
    img: 'https://placehold.co/400x300?text=Property+5'
  }
];
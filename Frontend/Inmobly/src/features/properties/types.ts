export type Property = {
  id: number;
  department: { id: number; name: string };
  city: { id: number; name: string };
  address: string;
  neighborhood: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  operation: string;
  price: number;
  area: number;
  description: string;
  pictures: string[];
};

/** Backend property contract representation. */
export type ApiProperty = {
  registryNumber: number;
  operationType: string;
  address: string;
  price: number;
  area: number;
  images: string[] | null;
  numberOfBathrooms: number;
  numberOfBedrooms: number; // nombre correcto según backend
  numberOfBedRooms?: number; // deprecated: eliminar cuando no haya usos
  city: { id: number; name: string };
  ownerEmail: string;
  ownerPhoneNumber: number;
  propertyType: string;
};

/** Returns bedroom count supporting deprecated field fallback. */
export function getBedrooms(p: ApiProperty): number {
  return p.numberOfBedrooms ?? p.numberOfBedRooms ?? 0;
}


export type ApiProperty = {
  registryNumber: number;
  operationType: string;
  address: string;
  price: number;
  area: number;
  images: string[] | null;  
  numberOfBathrooms: number;
  getNumberOfBedRooms: number;
  city: { id: number; name: string };
  ownerEmail: string;
  ownerPhoneNumber: number;
  propertyType: string;
};

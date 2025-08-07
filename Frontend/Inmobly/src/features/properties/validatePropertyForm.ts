import type { City } from "./api";

export type PropertyFormData = {
  price: string;
  operationType: "BUY" | "LEASE" | "";
  propertyType: string;
  city: City | null;
  address: string;
  area: string;
  rooms: string;
  bathrooms: string;
  images: File[];
};

export type PropertyFormErrors = {
  price?: string;
  operationType?: string;
  propertyType?: string;
  city?: string;
  address?: string;
  area?: string;
  rooms?: string;
  bathrooms?: string;
  images?: string;
  auth?: string;
};

export const validatePropertyForm = (
  formData: PropertyFormData,
  token?: string | null
): PropertyFormErrors => {
  const errors: PropertyFormErrors = {};

  // Authentication validation
  if (!token) {
    errors.auth = "Authentication required";
  }

  // Required fields validation
  if (!formData.operationType) {
    errors.operationType = "Operation type is required";
  } else if (!["BUY", "LEASE"].includes(formData.operationType)) {
    errors.operationType = "Please select a valid operation type";
  }

  if (!formData.propertyType) {
    errors.propertyType = "Property type is required";
  }

  if (!formData.city) {
    errors.city = "City is required";
  }

  if (!formData.address) {
    errors.address = "Address is required";
  }

  // Price validation
  if (!formData.price) {
    errors.price = "Price is required";
  } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    errors.price = "Invalid price";
  }

  // Area validation
  if (!formData.area) {
    errors.area = "Area is required";
  } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
    errors.area = "Invalid area";
  }

  // Rooms validation
  if (!formData.rooms) {
    errors.rooms = "Number of bedrooms is required";
  } else if (
    isNaN(Number(formData.rooms)) ||
    Number(formData.rooms) <= 0 ||
    !Number.isInteger(Number(formData.rooms))
  ) {
    errors.rooms = "Invalid number of bedrooms";
  }

  // Bathrooms validation
  if (!formData.bathrooms) {
    errors.bathrooms = "Number of bathrooms is required";
  } else if (
    isNaN(Number(formData.bathrooms)) ||
    Number(formData.bathrooms) <= 0 ||
    !Number.isInteger(Number(formData.bathrooms))
  ) {
    errors.bathrooms = "Invalid number of bathrooms";
  }

  // Images validation
  if (formData.images.length === 0) {
    errors.images = "Please upload at least one image";
  } else if (formData.images.length > 4) {
    errors.images = "Please upload 1-4 images";
  }

  return errors;
};

export const generateRegistryNumber = (): number => {
  // Generate a valid registry number up to 10 digits
  const now = Date.now();
  return Number(String(now).slice(-10));
};

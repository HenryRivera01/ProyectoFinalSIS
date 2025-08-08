/** Client-side validation for filter inputs (numeric ranges, enums, city IDs). */
export type FilterValues = {
  department: string;
  city: string;
  type: string;
  operation: string;
  bedrooms: string;
  bathrooms: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
};

type City = { id: number; name: string };

/** Returns a map of field errors if any filter value is invalid. */
export function validateFilters(
  filters: FilterValues,
  validCities?: City[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Price
  if (filters.priceMax && Number(filters.priceMax) <= 0) {
    errors.price = "Max price must be greater than zero";
  }
  if (!errors.price && filters.priceMin && Number(filters.priceMin) < 0) {
    errors.price = "Price must be greater than zero";
  }
  if (
    !errors.price &&
    filters.priceMin &&
    filters.priceMax &&
    Number(filters.priceMin) > Number(filters.priceMax)
  ) {
    errors.price = "Min price cannot be greater than max price";
  }

  // Area
  if (filters.areaMax && Number(filters.areaMax) <= 0) {
    errors.area = "Max area must be greater than zero";
  }
  if (!errors.area && filters.areaMin && Number(filters.areaMin) < 0) {
    errors.area = "Area must be greater than zero";
  }
  if (
    !errors.area &&
    filters.areaMin &&
    filters.areaMax &&
    Number(filters.areaMin) > Number(filters.areaMax)
  ) {
    errors.area = "Min area cannot be greater than max area";
  }

  // City validations
  if (
    filters.city &&
    (isNaN(Number(filters.city)) ||
      Number(filters.city) < 1 ||
      filters.city.length > 8)
  ) {
    errors.city = "Invalid city";
  } else if (filters.city && validCities) {
    const cityId = Number(filters.city);
    if (!validCities.some((c) => c.id === cityId)) {
      errors.city = "City not found";
    }
  }

  // Operation type validation
  if (filters.operation && !["BUY", "LEASE"].includes(filters.operation)) {
    errors.operation = "Invalid operation type";
  }

  // Property type validation
  const validTypes = [
    "",
    "BUILDING",
    "HOUSE",
    "OFFICE",
    "STUDIO_APARTMENT",
    "WAREHOUSE",
    "MEDICAL_OFFICE",
    "COMMERCIAL_SPACE",
    "LOT",
    "FARM",
    "OFFICE_BUILDING",
    "APARTMENT_BUILDING",
  ];
  if (filters.type && !validTypes.includes(filters.type)) {
    errors.type = "Invalid property type";
  }

  // Bathrooms validation
  if (
    filters.bathrooms &&
    (isNaN(Number(filters.bathrooms)) ||
      Number(filters.bathrooms) < 1 ||
      !Number.isInteger(Number(filters.bathrooms)))
  ) {
    errors.bathrooms = "Invalid number of bathrooms";
  }

  // Bedrooms validation
  if (
    filters.bedrooms &&
    (isNaN(Number(filters.bedrooms)) ||
      Number(filters.bedrooms) < 1 ||
      !Number.isInteger(Number(filters.bedrooms)))
  ) {
    errors.bedrooms = "Invalid number of bedrooms";
  }

  return errors;
}

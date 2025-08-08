import type { ApiProperty } from "./types";

/**
 * getBedrooms (legacy duplicate): prefer the version exported in types.ts.
 * Kept for backward compatibility with older imports.
 *
 * Obtiene el número de dormitorios usando la propiedad correcta y
 * manteniendo compatibilidad temporal con la deprecada.
 */
export function getBedrooms(
  p: Pick<ApiProperty, "numberOfBedrooms" | "numberOfBedRooms">
): number {
  if (typeof p.numberOfBedrooms === "number") return p.numberOfBedrooms;
  if (typeof p.numberOfBedRooms === "number") return p.numberOfBedRooms;
  return 0;
}

import type { ApiProperty } from "./types";

export type Department = { id: number; name: string };
export type City = { id: number; name: string };

export async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch("http://localhost:8080/api/v1/location/departments");
  if (!res.ok) throw new Error("Error loading departments");
  return res.json();
}

export async function fetchCitiesByDepartment(
  departmentId: string | number
): Promise<City[]> {
  const res = await fetch(
    `http://localhost:8080/api/v1/location/departments/${departmentId}/cities`
  );
  if (!res.ok) throw new Error("Error loading cities");
  return res.json();
}

export async function fetchProperties(params?: {
  departmentId?: string | number;
  cityId?: string | number;
}): Promise<ApiProperty[]> {
  let url = "http://localhost:8080/api/v1/properties";
  const qs = new URLSearchParams();
  if (params?.departmentId)
    qs.append("departmentId", String(params.departmentId));
  if (params?.cityId) qs.append("cityId", String(params.cityId));
  if (qs.toString()) url += `?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error loading properties");
  return res.json();
}

export async function fetchPropertyById(id: string | number) {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) throw new Error("Error obteniendo propiedad");
  return res.json();
}

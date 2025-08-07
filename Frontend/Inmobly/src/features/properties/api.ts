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

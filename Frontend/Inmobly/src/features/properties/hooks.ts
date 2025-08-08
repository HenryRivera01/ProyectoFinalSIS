/** Reusable data-fetch hooks for department and city catalogs. */
import { useEffect, useState } from "react";
import {
  fetchDepartments,
  fetchCitiesByDepartment,
  type Department,
  type City,
} from "./api";

/** Loads departments on mount and returns them with loading state. */
export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments()
      .then((data) => setDepartments(data))
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading };
}

/** Loads cities whenever departmentId changes or clears when null/undefined. */
export function useCitiesByDepartment(departmentId: string | number | null) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (departmentId) {
      setLoading(true);
      fetchCitiesByDepartment(departmentId)
        .then((data) => setCities(data))
        .catch(() => setCities([]))
        .finally(() => setLoading(false));
    } else {
      setCities([]);
    }
  }, [departmentId]);

  return { cities, loading };
}

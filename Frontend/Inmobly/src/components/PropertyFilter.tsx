import React, { useState, useEffect } from "react";
import {
  useDepartments,
  useCitiesByDepartment,
} from "../features/properties/hooks";
import { validateFilters } from "../features/properties/validateFilters";

type FilterValues = {
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

type Props = {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
};

export const PropertyFilter = ({ filters, onChange }: Props) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const { departments } = useDepartments();
  const { cities } = useCitiesByDepartment(localFilters.department);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{
    type: "idle" | "applying" | "applied" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "All" ? "" : value,
      ...(name === "department" ? { city: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "applying", message: "Applying filters..." });
    const validationErrors = validateFilters(localFilters);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onChange(localFilters);
      setStatus({ type: "applied", message: "Filters applied" });
    } else {
      setStatus({
        type: "error",
        message: "Fix errors before applying",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Property Filter Form">
      <fieldset>
        <legend>Location Filters</legend>

        <label htmlFor="department">Department</label>
        <select
          id="department"
          name="department"
          value={localFilters.department}
          onChange={handleChange}
        >
          <option value="">All departments</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>

        <label htmlFor="city">City</label>
        <select
          id="city"
          name="city"
          value={localFilters.city}
          onChange={handleChange}
          disabled={!localFilters.department}
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend>Property Characteristics</legend>

        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={localFilters.type}
          onChange={handleChange}
        >
          <option value="">All types</option>
          <option value="BUILDING">Building</option>
          <option value="HOUSE">House</option>
          <option value="OFFICE">Office</option>
          <option value="STUDIO_APARTMENT">Studio Apartment</option>
          <option value="WAREHOUSE">Warehouse</option>
          <option value="MEDICAL_OFFICE">Medical Office</option>
          <option value="COMMERCIAL_SPACE">Commercial Space</option>
          <option value="LOT">Lot</option>
          <option value="FARM">Farm</option>
          <option value="OFFICE_BUILDING">Office Building</option>
          <option value="APARTMENT_BUILDING">Apartment Building</option>
        </select>

        <label htmlFor="operation">Operation</label>
        <select
          id="operation"
          name="operation"
          value={localFilters.operation}
          onChange={handleChange}
        >
          <option value="">All operations</option>
          <option value="BUY">Buy</option>
          <option value="LEASE">Rent</option>
        </select>

        <label htmlFor="bedrooms">Bedrooms</label>
        <select
          id="bedrooms"
          name="bedrooms"
          value={localFilters.bedrooms}
          onChange={handleChange}
        >
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <label htmlFor="bathrooms">Bathrooms</label>
        <select
          id="bathrooms"
          name="bathrooms"
          value={localFilters.bathrooms}
          onChange={handleChange}
        >
          <option value="">Bathrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </fieldset>

      <fieldset>
        <legend>Price and Area</legend>

        <label htmlFor="priceMin">Min Price</label>
        <input
          type="number"
          id="priceMin"
          name="priceMin"
          placeholder="Min Price"
          value={localFilters.priceMin}
          onChange={handleChange}
        />

        <label htmlFor="priceMax">Max Price</label>
        <input
          type="number"
          id="priceMax"
          name="priceMax"
          placeholder="Max Price"
          value={localFilters.priceMax}
          onChange={handleChange}
        />

        <label htmlFor="areaMin">Min Area (m²)</label>
        <input
          type="number"
          id="areaMin"
          name="areaMin"
          placeholder="Min m²"
          value={localFilters.areaMin}
          onChange={handleChange}
        />

        <label htmlFor="areaMax">Max Area (m²)</label>
        <input
          type="number"
          id="areaMax"
          name="areaMax"
          placeholder="Max m²"
          value={localFilters.areaMax}
          onChange={handleChange}
        />

        {errors.price && <span style={{ color: "red" }}>{errors.price}</span>}
        {errors.area && <span style={{ color: "red" }}>{errors.area}</span>}
      </fieldset>
      <button type="submit">Apply Filters</button>
      {status.type === "applying" && (
        <p style={{ color: "#555" }}>{status.message}</p>
      )}
      {status.type === "applied" && (
        <p style={{ color: "green" }}>{status.message}</p>
      )}
      {status.type === "error" && (
        <p style={{ color: "red" }}>{status.message}</p>
      )}
    </form>
  );
};

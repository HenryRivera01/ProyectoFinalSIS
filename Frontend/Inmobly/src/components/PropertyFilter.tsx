import React, { useState, useEffect } from "react";

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

type Department = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};

export const PropertyFilter = ({ filters, onChange }: Props) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/location/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error loading departments", err));
  }, []);

  useEffect(() => {
    if (localFilters.department) {
      fetch(
        `http://localhost:8080/api/v1/location/departments/${localFilters.department}/cities`
      )
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Error loading cities", err));
    } else {
      setCities([]);
    }
  }, [localFilters.department]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { city: "" } : {}), // reset city if department changes
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange(localFilters);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select
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

        <select
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

        <select name="type" value={localFilters.type} onChange={handleChange}>
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

        <select
          name="operation"
          value={localFilters.operation}
          onChange={handleChange}
        >
          <option value="">All operations</option>
          <option value="Sale">Buy</option>
          <option value="Rent">Rent</option>
        </select>

        <select
          name="bedrooms"
          value={localFilters.bedrooms}
          onChange={handleChange}
        >
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <select
          name="bathrooms"
          value={localFilters.bathrooms}
          onChange={handleChange}
        >
          <option value="">Bathrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={localFilters.priceMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={localFilters.priceMax}
          onChange={handleChange}
        />

        <input
          type="number"
          name="areaMin"
          placeholder="Min m²"
          value={localFilters.areaMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="areaMax"
          placeholder="Max m²"
          value={localFilters.areaMax}
          onChange={handleChange}
        />

        <button type="submit">Apply Filters</button>
      </form>
    </div>
  );
};

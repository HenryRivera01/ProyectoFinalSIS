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

export const PropertyFilter = ({ filters, onChange }: Props) => {
  const [localFilters, setLocalFilters] = useState(filters);

    
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange(localFilters);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <select name="department" value={localFilters.department} onChange={handleChange}>
          <option value="">All departments</option>
          <option value="Cundinamarca">Cundinamarca</option>
          <option value="Antioquia">Antioquia</option>
        </select>

        <select name="city" value={localFilters.city} onChange={handleChange}>
          <option value="">All cities</option>
          <option value="Bogotá">Bogotá</option>
          <option value="Medellín">Medellín</option>
          <option value="Cali">Cali</option>
        </select>

        <select name="type" value={localFilters.type} onChange={handleChange}>
          <option value="">All types</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
        </select>

        <select name="operation" value={localFilters.operation} onChange={handleChange}>
          <option value="">All operations</option>
          <option value="Sale">Buy</option>
          <option value="Rent">Rent</option>
        </select>

        <select name="bedrooms" value={localFilters.bedrooms} onChange={handleChange}>
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <select name="bathrooms" value={localFilters.bathrooms} onChange={handleChange}>
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

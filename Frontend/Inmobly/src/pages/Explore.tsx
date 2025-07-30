import { Navbar } from "../components/Navbar";
import { PropertyFilter } from "../components/PropertyFilter";
import { mockProperties } from "../data/mockProperties"; // Assuming this is where mock properties are defined
import { PropertyCard } from "../components/PropertyCard";
import { useState } from "react";

const initialFilters = {
  location: "",
  type: "",
  operation: "",
};

export const Explore = () => {
  const [filters, setFilters] = useState(initialFilters);

  const filteredProperties = mockProperties.filter((p) => {
    return (
      (!filters.location || p.location === filters.location) &&
      (!filters.type || p.type === filters.type) &&
      (!filters.operation || p.operation === filters.operation)
    );
  });

  return (
    <div>
      <Navbar />
      <h1>Explore Properties</h1>
      <PropertyFilter filters={filters} onChange={setFilters} />

      <div>
        {filteredProperties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
};

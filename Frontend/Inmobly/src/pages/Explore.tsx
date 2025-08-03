import { Navbar } from "../components/Navbar";
import { PropertyFilter } from "../components/PropertyFilter";
import { mockProperties } from "../data/mockProperties";
import { PropertyCard } from "../components/PropertyCard";
import { useState } from "react";

const initialFilters = {
  department: "",
  city: "",
  type: "",
  operation: "",
  bedrooms: "",
  bathrooms: "",
  priceMin: "",
  priceMax: "",
  areaMin: "",
  areaMax: "",
};

export const Explore = () => {
  const [filters, setFilters] = useState(initialFilters);

  const filteredProperties = mockProperties.filter((p) => {
    return (
      (!filters.department || String(p.department.id) === filters.department) &&
      (!filters.city || String(p.city.id) === filters.city) &&
      (!filters.type || p.type === filters.type) &&
      (!filters.operation || p.operation === filters.operation) &&
      (!filters.bedrooms || p.bedrooms >= parseInt(filters.bedrooms)) &&
      (!filters.bathrooms || p.bathrooms >= parseInt(filters.bathrooms)) &&
      (!filters.priceMin || p.price >= parseInt(filters.priceMin)) &&
      (!filters.priceMax || p.price <= parseInt(filters.priceMax)) &&
      (!filters.areaMin || p.area >= parseInt(filters.areaMin)) &&
      (!filters.areaMax || p.area <= parseInt(filters.areaMax))
    );
  });

  return (
    <main>
      <Navbar />
      <h1>Explorar propiedades</h1>

      <section>
        <PropertyFilter filters={filters} onChange={setFilters} />
        <div>
          <button onClick={() => setFilters(initialFilters)}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <section>
        {filteredProperties.length > 0 ? (
          filteredProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onClick={() => console.log("Property clicked:", p.id)}
            />
          ))
        ) : (
          <p>No se encontraron propiedades que coincidan con los filtros.</p>
        )}
      </section>
    </main>
  );
};

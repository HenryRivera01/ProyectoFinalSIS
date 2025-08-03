import { Navbar } from "../components/Navbar";
import { PropertyFilter } from "../components/PropertyFilter";
import { PropertyCard } from "../components/PropertyCard";
import { useState, useEffect } from "react";
import type { ApiProperty } from "../features/properties/types";

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
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => {
        console.error("Error cargando propiedades", err);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProperties = properties.filter((p) => {
    return (
      // (!filters.department ||
      //   String(p.city?.id).startsWith(filters.department)) && // Elimina o corrige esto si tienes la relación
      (!filters.city || String(p.city?.id) === filters.city) &&
      (!filters.type || p.propertyType === filters.type) &&
      (!filters.operation || p.operationType === filters.operation) &&
      (!filters.bedrooms ||
        p.getNumberOfBedRooms >= parseInt(filters.bedrooms)) &&
      (!filters.bathrooms ||
        p.numberOfBathrooms >= parseInt(filters.bathrooms)) &&
      (!filters.priceMin || p.price >= parseInt(filters.priceMin)) &&
      (!filters.priceMax || p.price <= parseInt(filters.priceMax)) &&
      (!filters.areaMin || p.area >= parseInt(filters.areaMin)) &&
      (!filters.areaMax || p.area <= parseInt(filters.areaMax))
    );
  });

  return (
    <main>
      <Navbar />
      <h1>Explore Properties</h1>

      <section>
        <PropertyFilter filters={filters} onChange={setFilters} />
        <div>
          <button onClick={() => setFilters(initialFilters)}>
            Clear filters
          </button>
        </div>
      </section>

      <section>
        {loading ? (
          <p>Loading properties...</p>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((p) => {
            const property = {
              id: p.registryNumber,
              department: { id: 0, name: "" },
              city: p.city,
              address: p.address,
              neighborhood: "",
              type: p.propertyType,
              bedrooms: p.getNumberOfBedRooms,
              bathrooms: p.numberOfBathrooms,
              operation: p.operationType,
              price: p.price,
              area: p.area,
              description: "",
              pictures: p.images ?? [],
            };
            return (
              <PropertyCard
                key={p.registryNumber}
                property={property}
                onClick={() =>
                  console.log("Property clicked:", p.registryNumber)
                }
              />
            );
          })
        ) : (
          <p>No properties found matching the filters.</p>
        )}
      </section>
    </main>
  );
};

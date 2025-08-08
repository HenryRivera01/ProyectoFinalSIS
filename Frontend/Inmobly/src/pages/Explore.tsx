import { Navbar } from "../components/Navbar";
import { PropertyFilter } from "../components/PropertyFilter";
import { PropertyCard } from "../components/PropertyCard";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import type { ApiProperty } from "../features/properties/types";
import { fetchProperties } from "../features/properties/api";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const opParam = searchParams.get("operation");
  const opValue = opParam === "BUY" || opParam === "LEASE" ? opParam : "";
  const [filters, setFilters] = useState({
    ...initialFilters,
    operation: opValue,
  });
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<ApiProperty[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");

  // Carga inicial (todas las propiedades)
  useEffect(() => {
    setLoading(true);
    fetchProperties()
      .then((data) => setProperties(data))
      .catch((err) => {
        console.error("Error cargando propiedades", err);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Refetch cuando cambia department o city
  useEffect(() => {
    // Si no hay department y no hay city => cargar todo (reset)
    if (!filters.department && !filters.city) {
      setLoading(true);
      fetchProperties()
        .then((data) => setProperties(data))
        .catch(() => setProperties([]))
        .finally(() => setLoading(false));
      return;
    }

    // Si hay department (y opcionalmente city) => pedir al backend con filtros server-side
    setLoading(true);
    fetchProperties({
      departmentId: filters.department || undefined,
      cityId: filters.city || undefined,
    })
      .then((data) => setProperties(data))
      .catch((err) => {
        console.error("Error filtrando por department/city", err);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, [filters.department, filters.city]);

  // Filtrado adicional en cliente (resto de filtros)
  useEffect(() => {
    setFilteredProperties(
      properties.filter((p) => {
        return (
          (!filters.type || p.propertyType === filters.type) &&
          (!filters.operation || p.operationType === filters.operation) &&
          (!filters.bedrooms ||
            p.numberOfBedRooms >= parseInt(filters.bedrooms)) &&
          (!filters.bathrooms ||
            p.numberOfBathrooms >= parseInt(filters.bathrooms)) &&
          (!filters.priceMin || p.price >= parseInt(filters.priceMin)) &&
          (!filters.priceMax || p.price <= parseInt(filters.priceMax)) &&
          (!filters.areaMin || p.area >= parseInt(filters.areaMin)) &&
          (!filters.areaMax || p.area <= parseInt(filters.areaMax))
        );
      })
    );
  }, [
    filters.type,
    filters.operation,
    filters.bedrooms,
    filters.bathrooms,
    filters.priceMin,
    filters.priceMax,
    filters.areaMin,
    filters.areaMax,
    properties,
  ]);

  useEffect(() => {
    if (loading) {
      setInfoMessage("Loading properties...");
    } else {
      setInfoMessage(`${filteredProperties.length} properties found`);
    }
  }, [loading, filteredProperties]);

  const navigate = useNavigate();

  useEffect(() => {
    if (opValue && opValue !== filters.operation) {
      setFilters((f) => ({ ...f, operation: opValue }));
    }
  }, [opValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main>
      <Navbar />
      <div className="explore-container">
        <header className="explore-header">
          <h1>Explore properties</h1>
          <p className="explore-tagline">
            Find the property of your dreams. Filter and discover your next
            home.
          </p>
        </header>
        <section className="explore-filters">
          <PropertyFilter filters={filters} onChange={setFilters} />
          {infoMessage && (
            <p style={{ marginTop: 6 }} className="results-info">
              {infoMessage}
            </p>
          )}
        </section>

        <section className="property-grid">
          {loading ? (
            <p>Loading properties...</p>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((p) => (
              <PropertyCard
                key={p.registryNumber}
                property={p}
                onClick={() =>
                  navigate(`/property/${p.registryNumber}`, {
                    state: { property: p },
                  })
                }
              />
            ))
          ) : (
            <p>No properties found matching the filters.</p>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
};

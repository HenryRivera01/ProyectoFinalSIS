/** Explore page: combines server-side (location) and client-side filters for properties. */
import { Navbar } from "../components/Navbar";
import { PropertyFilter } from "../components/PropertyFilter";
import { PropertyCard } from "../components/PropertyCard";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import type { ApiProperty } from "../features/properties/types";
import { fetchProperties } from "../features/properties/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBedrooms } from "../features/properties/types";

/** Baseline (empty) filter state. */
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
  /** Active filters including possible operation preset from query string. */
  const [searchParams] = useSearchParams();
  const opParam = searchParams.get("operation");
  const opValue = opParam === "BUY" || opParam === "LEASE" ? opParam : "";
  const [filters, setFilters] = useState({
    ...initialFilters,
    operation: opValue,
  });
  /** Properties retrieved from backend (refreshed on department/city change). */
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  /** Client-side filtered subset (other criteria). */
  const [filteredProperties, setFilteredProperties] = useState<ApiProperty[]>(
    []
  );
  /** Loading state for fetches. */
  const [loading, setLoading] = useState(true);
  /** Info message (count or loading text). */
  const [infoMessage, setInfoMessage] = useState("");

  // Carga inicial (todas las propiedades)
  useEffect(() => {
    /** Initial load: fetches all properties without location filters. */
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
    /** When location filters change: fetch from backend (or reset to all if cleared). */
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
    /** Applies remaining (non-location) filters locally: type, operation, ranges, beds/baths. */
    setFilteredProperties(
      properties.filter((p) => {
        const minBedrooms = filters.bedrooms ? Number(filters.bedrooms) : 0;
        const minBathrooms = filters.bathrooms ? Number(filters.bathrooms) : 0;
        const priceMin = filters.priceMin ? Number(filters.priceMin) : 0;
        const priceMax = filters.priceMax ? Number(filters.priceMax) : Infinity;
        const areaMin = filters.areaMin ? Number(filters.areaMin) : 0;
        const areaMax = filters.areaMax ? Number(filters.areaMax) : Infinity;

        return (
          (!filters.type || p.propertyType === filters.type) &&
          (!filters.operation || p.operationType === filters.operation) &&
          (!minBedrooms || getBedrooms(p) >= minBedrooms) &&
          (!minBathrooms || p.numberOfBathrooms >= minBathrooms) &&
          (!filters.priceMin || p.price >= priceMin) &&
          (!filters.priceMax || p.price <= priceMax) &&
          (!filters.areaMin || p.area >= areaMin) &&
          (!filters.areaMax || p.area <= areaMax)
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
    /** Updates informational message based on loading state and filtered result count. */
    if (loading) {
      setInfoMessage("Loading properties...");
    } else {
      setInfoMessage(`${filteredProperties.length} properties found`);
    }
  }, [loading, filteredProperties]);

  const navigate = useNavigate();

  useEffect(() => {
    /** Ensures operation query param stays in sync with internal state if changed externally. */
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

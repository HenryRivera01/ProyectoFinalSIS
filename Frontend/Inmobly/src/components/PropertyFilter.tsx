import React, { useState, useEffect, useRef } from "react";
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
  const [showPrice, setShowPrice] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const priceBtnRef = useRef<HTMLButtonElement | null>(null);
  const areaBtnRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverAreaRef = useRef<HTMLDivElement | null>(null);
  const [priceLeft, setPriceLeft] = useState(0);
  const [areaLeft, setAreaLeft] = useState(0);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Cierre por click fuera
  useEffect(() => {
    if (!showPrice && !showArea) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && popoverRef.current.contains(target)) return;
      if (popoverAreaRef.current && popoverAreaRef.current.contains(target))
        return;
      if (priceBtnRef.current && priceBtnRef.current.contains(target)) return;
      if (areaBtnRef.current && areaBtnRef.current.contains(target)) return;
      setShowPrice(false);
      setShowArea(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [showPrice, showArea]);

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

  const togglePrice = () => {
    setShowArea(false);
    setShowPrice((p) => {
      const next = !p;
      if (next && filterBarRef.current && priceBtnRef.current) {
        const parentRect = filterBarRef.current.getBoundingClientRect();
        const btnRect = priceBtnRef.current.getBoundingClientRect();
        setPriceLeft(btnRect.left - parentRect.left);
      }
      return next;
    });
  };
  const toggleArea = () => {
    setShowPrice(false);
    setShowArea((p) => {
      const next = !p;
      if (next && filterBarRef.current && areaBtnRef.current) {
        const parentRect = filterBarRef.current.getBoundingClientRect();
        const btnRect = areaBtnRef.current.getBoundingClientRect();
        setAreaLeft(btnRect.left - parentRect.left);
      }
      return next;
    });
  };

  const applyPriceRange = () => {
    const vErrors = validateFilters(localFilters);
    setErrors(vErrors);
    if (!vErrors.price) {
      onChange(localFilters);
      setStatus({ type: "applied", message: "Price range applied" });
      setShowPrice(false);
    } else {
      setStatus({ type: "error", message: "Invalid price range" });
    }
  };

  const applyAreaRange = () => {
    const vErrors = validateFilters(localFilters);
    setErrors(vErrors);
    if (!vErrors.area) {
      onChange(localFilters);
      setStatus({ type: "applied", message: "Area range applied" });
      setShowArea(false);
    } else {
      setStatus({ type: "error", message: "Invalid area range" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Property Filter Form"
      className={`filter-bar-wrapper ${mobileFiltersOpen ? "open" : ""}`}
    >
      <button
        type="button"
        className="filter-mobile-toggle"
        onClick={() => setMobileFiltersOpen((o) => !o)}
        aria-expanded={mobileFiltersOpen}
        aria-controls="filters-panel"
      >
        <span className="filter-mobile-text">Filters</span>
        <span className="filter-mobile-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <circle cx="10" cy="6" r="2" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle cx="14" cy="12" r="2" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="18" r="2" />
          </svg>
        </span>
      </button>

      <div className="filter-bar" ref={filterBarRef} id="filters-panel">
        <select
          className="filter-pill"
          name="department"
          value={localFilters.department}
          onChange={handleChange}
        >
          <option value="">Department</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>

        <select
          className="filter-pill"
          name="city"
          value={localFilters.city}
          onChange={handleChange}
          disabled={!localFilters.department}
        >
          <option value="">City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          className="filter-pill"
          name="operation"
          value={localFilters.operation}
          onChange={handleChange}
        >
          <option value="">Buy / Rent</option>
          <option value="BUY">Buy</option>
          <option value="LEASE">Rent</option>
        </select>

        <select
          className="filter-pill"
          name="type"
          value={localFilters.type}
          onChange={handleChange}
        >
          <option value="">Type</option>
          <option value="HOUSE">House</option>
          <option value="STUDIO_APARTMENT">Studio Apartment</option>
          <option value="APARTMENT_BUILDING">Apartment Building</option>
          <option value="BUILDING">Building</option>
          <option value="OFFICE">Office</option>
          <option value="WAREHOUSE">Warehouse</option>
          <option value="MEDICAL_OFFICE">Medical Office</option>
          <option value="COMMERCIAL_SPACE">Commercial Space</option>
          <option value="LOT">Lot</option>
          <option value="FARM">Farm</option>
          <option value="OFFICE_BUILDING">Office Building</option>
        </select>

        <select
          className="filter-pill"
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
          className="filter-pill"
          name="bathrooms"
          value={localFilters.bathrooms}
          onChange={handleChange}
        >
          <option value="">Bathrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <button
          type="button"
          ref={priceBtnRef}
          className={`filter-pill pill-toggle ${showPrice ? "active" : ""}`}
          onClick={togglePrice}
        >
          Price
        </button>
        <button
          type="button"
          ref={areaBtnRef}
          className={`filter-pill pill-toggle ${showArea ? "active" : ""}`}
          onClick={toggleArea}
        >
          Area
        </button>
        <button type="submit" className="apply-filters-btn">
          Apply Filters
        </button>
        <button
          type="button"
          className="clear-filters-btn"
          onClick={() => {
            const empty = {
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
            setLocalFilters(empty);
            onChange(empty);
            setErrors({});
            setStatus({ type: "idle", message: "" });
          }}
        >
          Clear
        </button>
      </div>

      {showPrice && (
        <div
          className="range-popover enlarged"
          style={{ left: priceLeft }}
          ref={popoverRef}
        >
          <button
            type="button"
            className="popover-close"
            aria-label="Close price popover"
            onClick={() => setShowPrice(false)}
          >
            ×
          </button>
          <div className="range-header">Price range</div>
          <div className="range-row">
            <input
              type="number"
              name="priceMin"
              className="range-input"
              placeholder="Min $"
              value={localFilters.priceMin}
              onChange={handleChange}
            />
            <span className="range-sep">-</span>
            <input
              type="number"
              name="priceMax"
              className="range-input"
              placeholder="Max $"
              value={localFilters.priceMax}
              onChange={handleChange}
            />
          </div>
          {errors.price && <div className="range-error">{errors.price}</div>}
          <button
            type="button"
            className="range-apply-btn"
            onClick={applyPriceRange}
          >
            Apply range
          </button>
        </div>
      )}

      {showArea && (
        <div
          className="range-popover enlarged"
          style={{ left: areaLeft }}
          ref={popoverAreaRef}
        >
          <button
            type="button"
            className="popover-close"
            aria-label="Close area popover"
            onClick={() => setShowArea(false)}
          >
            ×
          </button>
          <div className="range-header">Area range (m²)</div>
          <div className="range-row">
            <input
              type="number"
              name="areaMin"
              className="range-input"
              placeholder="Min m²"
              value={localFilters.areaMin}
              onChange={handleChange}
            />
            <span className="range-sep">-</span>
            <input
              type="number"
              name="areaMax"
              className="range-input"
              placeholder="Max m²"
              value={localFilters.areaMax}
              onChange={handleChange}
            />
          </div>
          {errors.area && <div className="range-error">{errors.area}</div>}
          <button
            type="button"
            className="range-apply-btn"
            onClick={applyAreaRange}
          >
            Apply range
          </button>
        </div>
      )}

      {status.type === "error" && (
        <p className="filters-status error">{status.message}</p>
      )}
      {status.type === "applied" && (
        <p className="filters-status success">{status.message}</p>
      )}
      {status.type === "applying" && (
        <p className="filters-status neutral">{status.message}</p>
      )}
    </form>
  );
};

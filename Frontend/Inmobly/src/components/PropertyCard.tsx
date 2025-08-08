/** Visual card to display summary info about a property (used in grids/listings). */
import type { ApiProperty } from "../features/properties/types";

type Props = {
  property: ApiProperty;
  onClick?: () => void;
};

/** Normalizes raw enum-like property type to a human readable label. */
function formatPropertyType(raw: string) {
  return raw
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const PropertyCard = ({ property, onClick }: Props) => {
  /** First available image or a placeholder fallback. */
  const firstImage =
    (property.images && property.images[0]) ||
    "https://via.placeholder.com/600x360?text=No+Image";
  /** Human readable property type label. */
  const typeLabel = formatPropertyType(property.propertyType);
  /** Whether the property is for lease (vs buy). */
  const isLease = property.operationType === "LEASE";
  /** Optional department name if API injects that structure. */
  const deptName = (property as unknown as { department?: { name: string } })
    ?.department?.name;
  /** Bedrooms value supporting legacy optional field. */
  const bedrooms = property.numberOfBedrooms ?? property.numberOfBedRooms ?? 0;

  return (
    <article className="property-card" onClick={onClick}>
      <div className="property-image-wrapper">
        <span className="property-type-badge">{typeLabel}</span>
        <img
          className="property-image"
          src={firstImage}
          alt={`${typeLabel} in ${property.city.name}`}
          loading="lazy"
        />
      </div>

      <div className="property-body">
        <header className="property-header">
          <h3 className="property-location">
            {property.city.name}
            {deptName ? ` - ${deptName}` : ""}
          </h3>
          <p className="property-address">{property.address}</p>
        </header>

        <ul className="property-features">
          <li className="feature-item area">
            <span className="feature-label">{property.area} m²</span>
          </li>
          <li className="feature-item baths">
            <span className="feature-label">
              {property.numberOfBathrooms} baths
            </span>
          </li>
          <li className="feature-item beds">
            <span className="feature-label">{bedrooms} bedrooms</span>
          </li>
        </ul>

        <div className="property-price-row">
          <strong className="property-price">
            ${property.price.toLocaleString()} COP
          </strong>
        </div>

        <button
          type="button"
          className={`property-cta ${isLease ? "lease" : "buy"}`}
        >
          {isLease ? "Rent now" : "Buy now"}
        </button>
      </div>
    </article>
  );
};

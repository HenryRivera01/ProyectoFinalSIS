/** Property detail page including image gallery and related property suggestions. */
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import type { ApiProperty } from "../features/properties/types";
import { fetchPropertyById, fetchProperties } from "../features/properties/api";
import { PropertyCard } from "../components/PropertyCard";
import type { Location } from "react-router-dom";

interface PropertyLocationState {
  property?: ApiProperty;
}

export const PropertyPage = () => {
  /** Property object (from navigation state or fetched on mount). */
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as Location & {
    state?: PropertyLocationState;
  };
  const navigate = useNavigate();
  const stateProp = location.state?.property;

  /** Property object (from navigation state or fetched on mount). */
  const [property, setProperty] = useState<ApiProperty | undefined>(stateProp);
  /** Currently displayed main image. */
  const [mainImage, setMainImage] = useState<string | undefined>(
    stateProp?.images?.[0]
  );
  /** Index of the current image in the gallery. */
  const [currentIndex, setCurrentIndex] = useState(0);
  /** Loading flag (true if a fetch is needed). */
  const [loading, setLoading] = useState(!stateProp);
  /** Error message if fetch fails. */
  const [error, setError] = useState("");
  /** Related properties (same propertyType). */
  const [related, setRelated] = useState<ApiProperty[]>([]);

  useEffect(() => {
    /** If no property passed via router state, fetch it by id. */
    if (!property && id) {
      setLoading(true);
      fetchPropertyById(id)
        .then((data) => {
          setProperty(data);
          setMainImage(data.images?.[0]);
          setCurrentIndex(0);
        })
        .catch(() => setError("No se pudo cargar la propiedad"))
        .finally(() => setLoading(false));
    }
  }, [id, property]);

  useEffect(() => {
    /** Fetch related properties limited to same type (excluding itself). */
    if (!property) return;
    fetchProperties()
      .then((all) => {
        const rel = all
          .filter(
            (p) =>
              p.propertyType === property.propertyType &&
              p.registryNumber !== property.registryNumber
          )
          .slice(0, 3);
        setRelated(rel);
      })
      .catch(() => setRelated([]));
  }, [property]);

  /** Navigate to previous gallery image (wrap-around). */
  const goPrev = () => {
    if (!totalImages) return;
    setCurrentIndex((i) => {
      const ni = (i - 1 + totalImages) % totalImages;
      setMainImage(images![ni]);
      return ni;
    });
  };
  /** Navigate to next gallery image (wrap-around). */
  const goNext = () => {
    if (!totalImages) return;
    setCurrentIndex((i) => {
      const ni = (i + 1) % totalImages;
      setMainImage(images![ni]);
      return ni;
    });
  };

  if (loading) return <p>Loading property...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return <p>Property not found.</p>;

  const {
    operationType,
    address,
    price,
    area,
    images = [],
    numberOfBathrooms,
    city,
    ownerEmail,
    ownerPhoneNumber,
    propertyType,
  } = property;
  const bedrooms = property.numberOfBedrooms ?? property.numberOfBedRooms ?? 0;

  const totalImages = images?.length || 0;

  return (
    <main>
      <Navbar />
      <div className="property-page-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="property-page-layout">
          {/* Gallery */}
          <div className="gallery-column">
            <div className="main-image-wrapper">
              {mainImage ? (
                <img src={mainImage} alt="Property" className="main-image" />
              ) : (
                <span className="no-image">No image</span>
              )}
              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    className="nav-arrow prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="nav-arrow next"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {totalImages > 0 && (
              <div className="thumbs-row">
                {images!.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb-btn ${
                      i === currentIndex ? "active" : ""
                    }`}
                    onClick={() => {
                      setCurrentIndex(i);
                      setMainImage(img);
                    }}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={img} alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>
            )}

            <section className="property-section">
              <h3 className="section-heading">Description</h3>
              <p className="section-text">
                Placeholder description. Add real content when backend supports
                it.
              </p>
            </section>
          </div>

          {/* Info */}
          <aside className="info-column">
            <p className="prop-type">{propertyType?.replace(/_/g, " ")}</p>
            <h1 className="prop-title">
              {city?.name} - {address}
            </h1>
            <h2 className="prop-price">
              {operationType === "LEASE" ? "Rent" : "Sale"}: $
              {price.toLocaleString()} COP
            </h2>

            <ul className="property-features">
              <li className="feature-item area">
                <span>{area} m²</span>
              </li>
              <li className="feature-item baths">
                <span>{numberOfBathrooms} baths</span>
              </li>
              <li className="feature-item beds">
                <span>{bedrooms} bedrooms</span>
              </li>
            </ul>

            <div className="contact-block">
              <div className="avatar">
                {(ownerEmail || "U")[0].toUpperCase()}
              </div>
              <div className="contact-data">
                <strong>Contact</strong>
                <div>{ownerEmail}</div>
                <div>{ownerPhoneNumber}</div>
              </div>
            </div>

            <button
              className="primary-action"
              onClick={() =>
                alert(
                  `Contact: ${ownerEmail} - ${ownerPhoneNumber} (to implement)`
                )
              }
            >
              {operationType === "LEASE" ? "Rent now" : "Buy now"}
            </button>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="property-section">
            <h3 className="section-heading">Related properties</h3>
            <div className="related-grid property-grid">
              {related.map((r) => (
                <PropertyCard
                  key={r.registryNumber}
                  property={r}
                  onClick={() =>
                    navigate(`/property/${r.registryNumber}`, {
                      state: { property: r },
                    })
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

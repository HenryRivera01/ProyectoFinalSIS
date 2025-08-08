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
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as Location & {
    state?: PropertyLocationState;
  };
  const navigate = useNavigate();
  const stateProp = location.state?.property;

  const [property, setProperty] = useState<ApiProperty | undefined>(stateProp);
  const [mainImage, setMainImage] = useState<string | undefined>(
    stateProp?.images?.[0]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!stateProp);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<ApiProperty[]>([]);

  useEffect(() => {
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
    numberOfBedRooms,
    city,
    ownerEmail,
    ownerPhoneNumber,
    propertyType,
  } = property;

  const totalImages = images?.length || 0;

  const goPrev = () => {
    if (!totalImages) return;
    setCurrentIndex((i) => {
      const ni = (i - 1 + totalImages) % totalImages;
      setMainImage(images![ni]);
      return ni;
    });
  };
  const goNext = () => {
    if (!totalImages) return;
    setCurrentIndex((i) => {
      const ni = (i + 1) % totalImages;
      setMainImage(images![ni]);
      return ni;
    });
  };

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
                <span>{numberOfBedRooms} bedrooms</span>
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

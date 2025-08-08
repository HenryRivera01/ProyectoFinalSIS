import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import type { ApiProperty } from "../features/properties/types";
import { fetchPropertyById } from "../features/properties/api";
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
  const [loading, setLoading] = useState(!stateProp);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!property && id) {
      setLoading(true);
      fetchPropertyById(id)
        .then((data) => {
          setProperty(data);
          setMainImage(data.images?.[0]);
        })
        .catch(() => setError("No se pudo cargar la propiedad"))
        .finally(() => setLoading(false));
    }
  }, [id, property]);

  if (loading) return <p>Cargando propiedad...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return <p>Propiedad no encontrada.</p>;

  const {
    registryNumber,
    operationType,
    address,
    price,
    area,
    images = [],
    numberOfBathrooms,
    getNumberOfBedRooms,
    city,
    ownerEmail,
    ownerPhoneNumber,
    propertyType,
  } = property;

  return (
    <main style={{ fontFamily: "sans-serif" }}>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          ← Volver
        </button>
        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Galería */}
          <div style={{ flex: 2 }}>
            <div
              style={{
                border: "1px solid #ccc",
                height: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                overflow: "hidden",
              }}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="principal"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <span>Sin imagen</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  style={{
                    border:
                      img === mainImage
                        ? "2px solid #004aad"
                        : "1px solid #999",
                    width: 72,
                    height: 56,
                    padding: 0,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              ))}
            </div>
            <section style={{ marginTop: 32 }}>
              <h3>Descripción</h3>
              <p>
                Inmobly te ayuda a encontrar el lugar ideal. (Agregar
                descripción real cuando el backend lo soporte).
              </p>
            </section>
            <section style={{ marginTop: 32 }}>
              <h3>Productos relacionados</h3>
              <p>(Placeholder para propiedades relacionadas)</p>
            </section>
          </div>
          {/* Info */}
          <aside style={{ flex: 1, minWidth: 320 }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
              {propertyType?.replace(/_/g, " ")}
            </p>
            <h2 style={{ margin: "4px 0" }}>
              {city?.name} - {address}
            </h2>
            <h3 style={{ color: "#222", marginTop: 8 }}>
              {operationType === "LEASE" ? "Arriendo" : "Venta"}: $
              {price.toLocaleString()}
            </h3>
            <hr />
            <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.6 }}>
              <li>
                <strong>Área:</strong> {area} sqft
              </li>
              <li>
                <strong>Baños:</strong> {numberOfBathrooms}
              </li>
              <li>
                <strong>Habitaciones:</strong> {getNumberOfBedRooms}
              </li>
              <li>
                <strong>ID Registro:</strong> {registryNumber}
              </li>
              <li>
                <strong>Ciudad:</strong> {city?.name}
              </li>
            </ul>
            <hr />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#004aad",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {(ownerEmail || "U")[0].toUpperCase()}
              </div>
              <div style={{ fontSize: 14 }}>
                <strong>Contacto</strong>
                <div>{ownerEmail}</div>
                <div>{ownerPhoneNumber}</div>
              </div>
            </div>
            <button
              style={{
                marginTop: 20,
                width: "100%",
                background: "#004aad",
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                cursor: "pointer",
                borderRadius: 4,
              }}
              onClick={() =>
                alert(
                  `Contactar a ${ownerEmail} - ${ownerPhoneNumber} (acción a implementar)`
                )
              }
            >
              {operationType === "LEASE" ? "Rent now" : "Buy now"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

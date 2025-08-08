import type { ApiProperty } from "../features/properties/types";

type Props = {
  property: ApiProperty;
  onClick?: () => void;
};

export const PropertyCard = ({ property, onClick }: Props) => {
  const firstImage =
    (property.images && property.images[0]) ||
    "https://via.placeholder.com/400x260?text=Sin+Imagen";
  return (
    <article onClick={onClick}>
      <figure>
        <img
          src={firstImage}
          alt={`Imagen de la propiedad en ${property.address}`}
        />
        <figcaption>{property.address}</figcaption>
      </figure>
      <section>
        <header>
          <p>{property.city.name}</p>
          <h3>
            {property.propertyType} / {property.operationType}
          </h3>
        </header>
        <address>{property.address}</address>
        <ul>
          <li>{property.getNumberOfBedRooms} Bedrooms</li>
          <li>{property.numberOfBathrooms} Bathrooms</li>
          <li>{property.area} m²</li>
        </ul>
        <footer>
          <strong>${property.price.toLocaleString()}</strong>
        </footer>
      </section>
    </article>
  );
};
    

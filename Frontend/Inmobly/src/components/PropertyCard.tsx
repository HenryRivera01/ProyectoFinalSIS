import type { Property } from "../features/properties/types";

type Props = {
  property: Property;
  onClick?: () => void;
};

export const PropertyCard = ({ property, onClick }: Props) => {
  return (
    <article onClick={onClick}>
      <figure>
        <img
          src={property.pictures[0]}
          alt={`Imagen de la propiedad en ${property.address}`}
        />
        <figcaption>{property.address}</figcaption>
      </figure>

      <section>
        <header>
          <p>
            {property.city.name}
          </p>
          <h3>
            {property.type} on {property.operation}
          </h3>
        </header>

        <address>{property.address}</address>

        <ul>
          <li>{property.bedrooms} Bedrooms</li>
          <li>{property.bathrooms} Bathrooms</li>
          <li>{property.area} m²</li>
        </ul>

        <footer>
          <strong>${property.price.toLocaleString()}</strong>
        </footer>
      </section>
    </article>
  );
};

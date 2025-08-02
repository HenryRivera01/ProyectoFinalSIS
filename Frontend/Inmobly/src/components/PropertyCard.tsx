
import type { Property } from '../features/properties/types';

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
          <p>{property.city}, {property.neighborhood}</p>
          <h3>{property.type} en {property.operation}</h3>
        </header>

        <address>{property.address}</address>

        <ul>
          <li>{property.bedrooms} hab</li>
          <li>{property.bathrooms} baños</li>
          <li>{property.area} m²</li>
        </ul>

        <footer>
          <strong>${property.price.toLocaleString()}</strong>
        </footer>
      </section>
    </article>
  );
};
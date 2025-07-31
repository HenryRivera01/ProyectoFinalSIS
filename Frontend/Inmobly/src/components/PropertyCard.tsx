
import type { Property } from '../features/properties/types';

type Props = {
  property: Property;
  onClick?: () => void;
};



export const PropertyCard = ({ property, onClick }:Props) => {
  return (
    <div
      onClick={onClick}
    >
      <img
        src={property.img}
        alt={property.address}
      />

      <div >
        <div>{property.location} - {property.neighborhood}</div>
        <h3>{property.type} in {property.operation}</h3>
        <p>{property.address}</p>

        <div >
          <span>{property.bedrooms} bd</span>
          <span>{property.bathrooms} ba</span>
          <span>{property.squareMeters} m²</span>
        </div>

        <div>
          ${property.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
};


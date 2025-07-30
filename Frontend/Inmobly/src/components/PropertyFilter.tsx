
type FilterValues = {
  location: string;
  type: string;
  operation: string;
};

type Props = {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
};

export const PropertyFilter = ({ filters, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value, } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div>
      <select name="location" value={filters.location} onChange={handleChange}>
        <option value="">All locations</option>
        <option value="Bogotá">Bogotá</option>
        <option value="Medellín">Medellín</option>
        <option value="Cali">Cali</option>
      </select>

      <select name="type" value={filters.type} onChange={handleChange}>
        <option value="">All types</option>
        <option value="House">House</option>
        <option value="Apartment">Apartment</option>
      </select>

      <select name="operation" value={filters.operation} onChange={handleChange}>
        <option value="">All operations</option>
        <option value="Sale">Buy</option>
        <option value="Rent">Rent</option>
      </select>
    </div>
  );
};
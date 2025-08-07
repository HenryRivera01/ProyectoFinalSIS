// src/tests/components/PropertyFilter.test.tsx
import { render, screen } from "@testing-library/react";
import { PropertyFilter } from "../../components/PropertyFilter";
import "@testing-library/jest-dom";
import { validateFilters } from "../../features/properties/validateFilters";

describe("PropertyFilter", () => {
  const filters = {
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

  const onChange = jest.fn();

  beforeEach(() => {
    render(<PropertyFilter filters={filters} onChange={onChange} />);
  });

  it("should render price and area inputs", () => {
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max area/i)).toBeInTheDocument();
  });

  it("should render all expected selects", () => {
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bathrooms/i)).toBeInTheDocument();

    // You can also check that there are 6 comboboxes in total
    expect(screen.getAllByRole("combobox")).toHaveLength(6);
  });

  it("should render the button to apply filters", () => {
    expect(
      screen.getByRole("button", { name: /apply filters/i })
    ).toBeInTheDocument();
  });
});

describe("validateFilters", () => {
  it("Given all fields are empty, When validating filters, Then returns no errors", () => {
    const filters = {
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
    const errors = validateFilters(filters);
    expect(errors).toEqual({});
  });

  it("Given valid filter values, When validating filters, Then returns no errors", () => {
    const filters = {
      department: "1",
      city: "2",
      type: "HOUSE",
      operation: "BUY",
      bedrooms: "2",
      bathrooms: "2",
      priceMin: "100",
      priceMax: "1000",
      areaMin: "50",
      areaMax: "200",
    };
    const errors = validateFilters(filters);
    expect(errors).toEqual({});
  });

  it("Given min price is greater than max price, When validating filters, Then returns price error", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "1000",
      priceMax: "500",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.price).toBe("Min price cannot be greater than max price");
  });

  it("Given max area is zero, When validating filters, Then returns area error", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "0",
    };
    const errors = validateFilters(filters);
    expect(errors.area).toBe("Max area must be greater than zero");
  });

  it("Given max price is zero, When validating filters, Then returns price error", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "0",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.price).toBe("Max price must be greater than zero");
  });

  // Case: Invalid city id
  it("detects when the city is invalid", () => {
    const filters = {
      department: "1",
      city: "-5",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.city).toBe("Invalid city");
  });

  it("detects when the city is not numeric", () => {
    const filters = {
      department: "1",
      city: "abc",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.city).toBe("Invalid city");
  });

  it("detects when the city id is too large", () => {
    const filters = {
      department: "1",
      city: "9999999999",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.city).toBe("Invalid city");
  });

  // Case: Nonexistent city id
  it("detects when the city does not exist in the backend", () => {
    const filters = {
      department: "1",
      city: "999",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const validCities = [
      { id: 1, name: "City1" },
      { id: 2, name: "City2" },
    ];
    const errors = validateFilters(filters, validCities);
    expect(errors.city).toBe("City not found");
  });

  // Case: Invalid operation type
  it("detects when the operation type is invalid", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "INVALID",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.operation).toBe("Invalid operation type");
  });

  // Case: Invalid property type
  it("detects when the property type is invalid", () => {
    const filters = {
      department: "",
      city: "",
      type: "INVALID_TYPE",
      operation: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.type).toBe("Invalid property type");
  });

  // Case: Invalid number of bathrooms
  it("detects when the number of bathrooms is invalid", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "0",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.bathrooms).toBe("Invalid number of bathrooms");
  });

  it("detects when the number of bathrooms is negative", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "-1",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.bathrooms).toBe("Invalid number of bathrooms");
  });

  it("detects when the number of bathrooms is not an integer", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "",
      bathrooms: "2.5",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.bathrooms).toBe("Invalid number of bathrooms");
  });

  // Case: Invalid number of bedrooms
  it("detects when the number of bedrooms is invalid", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "0",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.bedrooms).toBe("Invalid number of bedrooms");
  });

  it("detects when the number of bedrooms is negative", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "-1",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.bedrooms).toBe("Invalid number of bedrooms");
  });

  it("detects when the number of bedrooms is not an integer", () => {
    const filters = {
      department: "",
      city: "",
      type: "",
      operation: "",
      bedrooms: "1.5",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
    };
    const errors = validateFilters(filters);
    expect(errors.bedrooms).toBe("Invalid number of bedrooms");
  });

  it("accepts empty values for all fields", () => {
    const filters = {
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
    const errors = validateFilters(filters);
    expect(errors).toEqual({});
  });
});

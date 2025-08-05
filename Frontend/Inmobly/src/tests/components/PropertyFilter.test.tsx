// src/tests/components/PropertyFilter.test.tsx
import { render, screen } from "@testing-library/react";
import { PropertyFilter } from "../../components/PropertyFilter";
import "@testing-library/jest-dom";

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

  it("debe renderizar los inputs de precio y área", () => {
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max area/i)).toBeInTheDocument();
  });

  it("debe renderizar todos los selects esperados", () => {
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bathrooms/i)).toBeInTheDocument();

    // También puedes verificar que hay 6 combobox en total
    expect(screen.getAllByRole("combobox")).toHaveLength(6);
  });

  it("debe renderizar el botón para aplicar filtros", () => {
    expect(
      screen.getByRole("button", { name: /apply filters/i })
    ).toBeInTheDocument();
  });
});

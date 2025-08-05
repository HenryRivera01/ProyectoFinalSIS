import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Explore } from "./Explore";

// Mock para el componente Navbar
jest.mock("../components/Navbar", () => ({
  Navbar: () => <div data-testid="mock-navbar">Mock Navbar</div>,
}));

// Test para verificar que el componente se renderiza correctamente
test("renderiza el componente Explore correctamente", () => {
  render(
    <MemoryRouter>
      <Explore />
    </MemoryRouter>
  );
  const heading = screen.getByText(/explore/i);
  expect(heading).toBeInTheDocument();
});

// Test para verificar que el botón de limpiar filtros aparece y funciona
test("muestra y ejecuta el botón de limpiar filtros", () => {
  render(
    <MemoryRouter>
      <Explore />
    </MemoryRouter>
  );
  const clearButton = screen.getByRole("button", { name: /clear filters/i });
  expect(clearButton).toBeInTheDocument();
  fireEvent.click(clearButton);
  // Aquí podrías verificar que los filtros vuelven a su estado inicial si los mockeas
});

// Test para verificar que muestra el mensaje de carga
test("muestra mensaje de carga mientras se obtienen propiedades", () => {
  render(
    <MemoryRouter>
      <Explore />
    </MemoryRouter>
  );
  expect(screen.getByText(/loading properties/i)).toBeInTheDocument();
});

// Test para verificar que muestra mensaje si no hay propiedades
test("muestra mensaje si no hay propiedades", async () => {
  // Mockear fetch para devolver un array vacío
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;

  render(
    <MemoryRouter>
      <Explore />
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(
      screen.getByText(/no properties found matching the filters/i)
    ).toBeInTheDocument()
  );
});

// Test para verificar que se renderiza una propiedad si fetch devuelve datos
test("muestra propiedades si fetch devuelve datos", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            registryNumber: 1,
            city: { id: "1", name: "Ciudad" },
            address: "Calle 123",
            propertyType: "Casa",
            getNumberOfBedRooms: 3,
            numberOfBathrooms: 2,
            operationType: "Venta",
            price: 100000,
            area: 120,
            images: [],
          },
        ]),
    })
  ) as jest.Mock;

  render(
    <MemoryRouter>
      <Explore />
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/calle 123/i)).toBeInTheDocument()
  );
});


import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

// Mock para el componente Navbar
jest.mock("../components/Navbar", () => ({
  Navbar: () => <div data-testid="mock-navbar">Mock Navbar</div>,
}));

test("renderiza el formulario de registro y el título", () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  expect(screen.getByText(/user registration/i)).toBeInTheDocument();
  expect(
    screen.getByRole("form", { name: /register-form/i })
  ).toBeInTheDocument();
});

test("muestra todos los campos del formulario", () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  expect(screen.getByLabelText(/document type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/document number/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
});

test("el botón de registro se deshabilita mientras se envía el formulario", async () => {
  let resolveFetch: () => void;
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) => {
        resolveFetch = () =>
          resolve({ ok: true, json: () => Promise.resolve({}) });
      })
  ) as jest.Mock;

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/document number/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: "Juan" },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: "Pérez" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "juan@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "5555555" },
  });

  const button = screen.getByRole("button", {
    name: /register/i,
  }) as HTMLButtonElement;
  fireEvent.click(button);

  expect(button).toBeDisabled();

  // Finaliza la promesa fetch para que termine el submit
  resolveFetch!();
});

test("muestra mensaje de éxito tras registro exitoso", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  ) as jest.Mock;

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/document number/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: "Juan" },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: "Pérez" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "juan@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "5555555" },
  });

  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  expect(
    await screen.findByText(/registration successful/i)
  ).toBeInTheDocument();
});

test("muestra mensaje de error si el registro falla", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  ) as jest.Mock;

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/document number/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: "Juan" },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: "Pérez" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "juan@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "5555555" },
  });

  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  expect(await screen.findByRole("alert")).toBeInTheDocument();
});

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "5555555" },
  });

  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  expect(await screen.findByRole("alert")).toBeInTheDocument();


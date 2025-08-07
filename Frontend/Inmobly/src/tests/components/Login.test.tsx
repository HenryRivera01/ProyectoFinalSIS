import {
  validateLoginForm,
  type LoginFormData,
} from "../../features/user/validateLogin";
import "@testing-library/jest-dom";

describe("User Login Form Validation", () => {
  // Base valid form data that we'll modify for specific tests
  const validFormData: LoginFormData = {
    email: "user@example.com",
    password: "password123",
  };

  it("Given all fields with valid values, When validating form, Then returns no errors", () => {
    const errors = validateLoginForm(validFormData);
    expect(errors).toEqual({});
  });

  it("Given email field left blank, When validating form, Then returns email error", () => {
    const formData = { ...validFormData, email: "" };
    const errors = validateLoginForm(formData);
    expect(errors.email).toBe("Email is required");
  });

  it("Given invalid email format, When validating form, Then returns email format error", () => {
    const formData = { ...validFormData, email: "invalid-email" };
    const errors = validateLoginForm(formData);
    expect(errors.email).toBe("Invalid email format");
  });

  it("Given password field left blank, When validating form, Then returns password error", () => {
    const formData = { ...validFormData, password: "" };
    const errors = validateLoginForm(formData);
    expect(errors.password).toBe("Password is required");
  });
});

// Los siguientes tests verifican que los mensajes de error de backend
// se muestren correctamente, pero no prueban la función validateLoginForm directamente

describe("Login Error Handling UI", () => {
  // Estos tests deberían verificarse en un test de integración o componente
  // usando react-testing-library, pero aquí documentamos los casos esperados:

  it("Should show 'Invalid credentials' when status is 401", () => {
    // Este test se implementaría usando react-testing-library para verificar
    // que cuando se recibe un 401, se muestra el mensaje de error adecuado
    // Ejemplo de mensaje esperado: "Invalid credentials. Please check your email and password."
  });

  it("Should show 'User not found' when status is 404", () => {
    // Este test se implementaría usando react-testing-library para verificar
    // que cuando se recibe un 404, se muestra el mensaje de error adecuado
    // Ejemplo de mensaje esperado: "User not found. This email is not registered."
  });
});

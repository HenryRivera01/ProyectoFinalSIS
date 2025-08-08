import { useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  validateRegisterForm,
  type RegisterFormData,
  type RegisterFormErrors,
} from "../features/user/validateRegister";

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    documentType: "CC",
    documentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpia errores al editar
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Detener si hay errores de validación
    }

    setLoading(true);
    setStatus({ type: "loading", message: "Processing registration..." });
    setError(null);
    setSuccess(false);

    try {
      // Crear el objeto con los nombres de propiedades exactos que espera el backend
      const payload = {
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // Mostrar respuesta completa para depuración
      console.log("Status:", response.status);
      const responseText = await response.text();
      console.log("Response:", responseText);

      // Convertir la respuesta de texto a JSON si es posible
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { text: responseText };
      }

      if (!response.ok) {
        // Si el backend responde 500, asumimos que es por documento duplicado
        if (response.status === 500) {
          setErrors((prev) => ({
            ...prev,
            documentNumber: "Document number already exists",
          }));
          setStatus({
            type: "error",
            message: "Document number already exists",
          });
          setLoading(false);
          return;
        }

        setStatus({
          type: "error",
          message: `Error: ${response.status} - ${
            responseData.message || responseText
          }`,
        });
        setLoading(false);
        return;
      }

      setSuccess(true);
      setStatus({ type: "success", message: "Registration successful ✅" });
      setFormData({
        documentType: "CC",
        documentNumber: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
    } catch (err) {
      console.error("Error completo:", err);
      setStatus({
        type: "error",
        message: "Unexpected error: " + (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit} aria-label="register-form">
        <label>
          Document type:
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
          >
            <option value="CC">CC</option>
            <option value="CE">CE</option>
          </select>
          {errors.documentType && (
            <span style={{ color: "red" }}>{errors.documentType}</span>
          )}
        </label>

        <label>
          Document number:
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleChange}
            required
          />
          {errors.documentNumber && (
            <span style={{ color: "red" }}>{errors.documentNumber}</span>
          )}
        </label>

        <label>
          First name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && (
            <span style={{ color: "red" }}>{errors.firstName}</span>
          )}
        </label>

        <label>
          Last name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && (
            <span style={{ color: "red" }}>{errors.lastName}</span>
          )}
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
        </label>

        <label>
          Phone number:
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && (
            <span style={{ color: "red" }}>{errors.phoneNumber}</span>
          )}
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Mensajes de estado unificados */}
        {status.type === "loading" && (
          <p style={{ color: "#555" }}>{status.message}</p>
        )}
        {status.type === "success" && (
          <p style={{ color: "green" }}>{status.message}</p>
        )}
        {status.type === "error" && (
          <p style={{ color: "red" }}>{status.message}</p>
        )}
        {/* Conserva retrocompatibilidad */}
        {error && status.type !== "error" && <p role="alert">Error: {error}</p>}
        {success && status.type !== "success" && (
          <p>Registration successful ✅</p>
        )}
      </form>
    </main>
  );
}

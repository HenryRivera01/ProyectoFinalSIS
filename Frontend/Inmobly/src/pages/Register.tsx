import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
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
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Signup</h1>
          <form
            onSubmit={handleSubmit}
            aria-label="register-form"
            className="auth-form"
          >
            <div className="form-field">
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="CC">CC</option>
                <option value="CE">CE</option>
              </select>
              {errors.documentType && (
                <span className="field-error">{errors.documentType}</span>
              )}
            </div>

            <div className="form-field">
              <input
                className="auth-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="documentNumber"
                placeholder="Document number"
                value={formData.documentNumber}
                onChange={handleChange}
                required
              />
              {errors.documentNumber && (
                <span className="field-error">{errors.documentNumber}</span>
              )}
            </div>

            <div className="form-field">
              <input
                className="auth-input"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName}</span>
              )}
            </div>

            <div className="form-field">
              <input
                className="auth-input"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && (
                <span className="field-error">{errors.lastName}</span>
              )}
            </div>

            <div className="form-field">
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-field">
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-field">
              <input
                className="auth-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="phoneNumber"
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && (
                <span className="field-error">{errors.phoneNumber}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn primary"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {status.type === "loading" && (
              <p className="status neutral">{status.message}</p>
            )}
            {status.type === "success" && (
              <p className="status success">{status.message}</p>
            )}
            {status.type === "error" && (
              <p className="status error">{status.message}</p>
            )}
            {error && status.type !== "error" && (
              <p role="alert" className="status error">
                Error: {error}
              </p>
            )}
            {success && status.type !== "success" && (
              <p className="status success">Registration successful ✅</p>
            )}

            <p className="auth-alt-link">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

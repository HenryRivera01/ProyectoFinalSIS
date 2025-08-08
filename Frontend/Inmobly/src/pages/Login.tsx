import { useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  validateLoginForm,
  getErrorMessage,
  type LoginFormData,
  type LoginFormErrors,
} from "../features/user/validateLogin";

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpia errores al editar
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus({ type: "idle", message: "" });

    // Validar formulario antes de enviar
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Detener si hay errores de validación
    }

    setLoading(true);
    setStatus({ type: "loading", message: "Validating credentials..." });
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Login successful.");
        // Guarda el token y el ownerId en localStorage
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("ownerId", result.ownerId);
        console.log(result);
        setStatus({ type: "success", message: "Login successful ✅" });
      } else {
        // Manejo específico de errores según el código de estado
        if (response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            credentials:
              "Invalid credentials. Please check your email and password.",
          }));
          setStatus({ type: "error", message: "Invalid credentials" });
        } else if (response.status === 400) {
          // Error de validación, puede ser email o contraseña vacíos/inválidos
          try {
            const errorData = await response.json();
            if (errorData.field === "email") {
              setErrors((prev) => ({
                ...prev,
                email: errorData.message || "Invalid email format",
              }));
            } else if (errorData.field === "password") {
              setErrors((prev) => ({
                ...prev,
                password: errorData.message || "Invalid password",
              }));
            } else {
              setMessage(`Error: ${errorData.message || getErrorMessage(400)}`);
            }
          } catch {
            setMessage(getErrorMessage(400));
          }
          setStatus({ type: "error", message: "Bad request" });
        } else {
          // Para otros códigos de error (404, 500, etc.)
          const errorMessage = getErrorMessage(response.status);
          setMessage(`Error: ${errorMessage}`);
          setStatus({ type: "error", message: errorMessage });

          // Si es 404, probablemente el usuario no existe
          if (response.status === 404) {
            setErrors((prev) => ({
              ...prev,
              email: "User not found. This email is not registered.",
            }));
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Connection error. Please check your internet connection.");
      setStatus({ type: "error", message: "Connection error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <h1>Login</h1>
      <form onSubmit={handleSubmit} aria-label="login-form">
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
        </label>

        {errors.credentials && (
          <div style={{ color: "red" }}>{errors.credentials}</div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {/* Indicadores de estado */}
      {status.type === "loading" && (
        <p style={{ color: "#555" }}>{status.message}</p>
      )}
      {status.type === "success" && (
        <p style={{ color: "green" }}>{status.message}</p>
      )}
      {status.type === "error" && (
        <p style={{ color: "red" }}>{status.message}</p>
      )}
      {message && status.type === "idle" && <p>{message}</p>}
    </main>
  );
};

export default Login;

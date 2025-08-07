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

    // Validar formulario antes de enviar
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Detener si hay errores de validación
    }

    setLoading(true);

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
        setMessage("Inicio de sesión exitoso.");
        // Guarda el token y el ownerId en localStorage
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("ownerId", result.ownerId);
        console.log(result);
      } else {
        // Manejo específico de errores según el código de estado
        if (response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            credentials:
              "Invalid credentials. Please check your email and password.",
          }));
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
        } else {
          // Para otros códigos de error (404, 500, etc.)
          const errorMessage = getErrorMessage(response.status);
          setMessage(`Error: ${errorMessage}`);

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
      setMessage(
        "Error al conectar con el servidor. Verifique su conexión a internet."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} aria-label="login-form">
        <label htmlFor="email">
          Correo electrónico:
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
          Contraseña:
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

      {message && <p>{message}</p>}
    </main>
  );
};

export default Login;

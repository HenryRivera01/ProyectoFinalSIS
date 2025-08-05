import { useState } from "react";
import { Navbar } from "../components/Navbar";

interface RegisterFormData {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al registrar el usuario");
      }

      setSuccess(true);
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
      setError((err as Error).message);
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
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p role="alert">Error: {error}</p>}
        {success && <p>Registration successful ✅</p>}
      </form>
    </main>
  );
}

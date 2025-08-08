import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  fetchDepartments,
  fetchCitiesByDepartment,
} from "../features/properties/api";
import type { Department, City } from "../features/properties/api";
import {
  type PropertyFormData,
  type PropertyFormErrors,
  validatePropertyForm,
  generateRegistryNumber,
} from "../features/properties/validatePropertyForm";
import {
  formatMoneyDigits,
  stripMoneyFormatting,
} from "../features/properties/moneyFormat";

export const RegisterProperty = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    price: "",
    operationType: "",
    propertyType: "",
    city: null,
    address: "",
    area: "",
    rooms: "",
    bathrooms: "",
    images: [],
  });
  const [errors, setErrors] = useState<PropertyFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch((err) => console.error("Error loading departments", err));
  }, []);

  useEffect(() => {
    if (department) {
      fetchCitiesByDepartment(department.id)
        .then(setCities)
        .catch((err) => console.error("Error loading cities", err));
    } else {
      setCities([]);
    }
  }, [department]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "price") {
      const digits = stripMoneyFormatting(value);
      setFormData((prev) => ({ ...prev, price: digits }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
    }
  };

  // NUEVO: soporte drag & drop y eliminar
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToCloudinary = async (
    images: File[]
  ): Promise<string[]> => {
    const urls: string[] = [];
    for (const image of images) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "unsigned_preset");
      data.append("folder", "properties");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dcd4zd5mr/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      urls.push(result.secure_url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: "idle", message: "" });
    const token = localStorage.getItem("authToken");
    const validationErrors = validatePropertyForm(formData, token);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0] as string;
      setSubmitStatus({ type: "error", message: firstError });
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = await uploadImagesToCloudinary(formData.images);
      const registryNumber = generateRegistryNumber();
      const payload = {
        registryNumber,
        operationType: formData.operationType,
        address: formData.address,
        price: Number(formData.price),
        area: Number(formData.area),
        images: imageUrls,
        numberOfBathrooms: Number(formData.bathrooms),
        numberOfBedrooms: Number(formData.rooms),
        cityId: formData.city!.id,
        propertyType: formData.propertyType,
      };
      const res = await fetch("http://localhost:8080/api/v1/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token!,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = "Error registering property";
        try {
          const error = await res.json();
          errorMsg = error.message || JSON.stringify(error);
        } catch {
          const text = await res.text();
          errorMsg = text;
        }
        setSubmitStatus({ type: "error", message: errorMsg });
        return;
      }
      setSubmitStatus({
        type: "success",
        message: "Property registered successfully",
      });
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: "Property registration failed: " + (err as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card property-form-card">
          <h1 className="auth-title">Register Property</h1>
          <form onSubmit={handleSubmit} className="auth-form property-form">
            {/* Section: Basic Info */}
            <h2 className="form-section-title">Basic info</h2>
            {/* Reordenado: 1) Property Type */}
            <div className="form-field">
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className={`auth-input ${
                  errors.propertyType ? "input-error" : ""
                }`}
              >
                <option value="">Property type</option>
                <option value="BUILDING">Building</option>
                <option value="HOUSE">House</option>
                <option value="OFFICE">Office</option>
                <option value="STUDIO_APARTMENT">Studio Apartment</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="MEDICAL_OFFICE">Medical Office</option>
                <option value="COMMERCIAL_SPACE">Commercial Space</option>
                <option value="LOT">Lot</option>
                <option value="FARM">Farm</option>
                <option value="OFFICE_BUILDING">Office Building</option>
                <option value="APARTMENT_BUILDING">Apartment Building</option>
              </select>
              {errors.propertyType && (
                <span className="field-error">{errors.propertyType}</span>
              )}
            </div>

            {/* 2) Operation Type */}
            <div className="form-field">
              <select
                name="operationType"
                value={formData.operationType}
                onChange={handleChange}
                className={`auth-input ${
                  errors.operationType ? "input-error" : ""
                }`}
              >
                <option value="">Operation type</option>
                <option value="BUY">Sell</option>
                <option value="LEASE">Lease</option>
              </select>
              {errors.operationType && (
                <span className="field-error">{errors.operationType}</span>
              )}
            </div>

            {/* 3) Price */}
            <div className="form-field">
              <div className="price-input-wrapper full-width">
                <input
                  className={`auth-input price-input ${
                    errors.price ? "input-error" : ""
                  }`}
                  name="price"
                  placeholder="Price (COP)"
                  value={formatMoneyDigits(formData.price)}
                  onChange={handleChange}
                  inputMode="numeric"
                />
              </div>
              {errors.price && (
                <span className="field-error">{errors.price}</span>
              )}
            </div>

            {/* Section: Location */}
            <h2 className="form-section-title">Location</h2>
            {/* Department */}
            <div className="form-field">
              <select
                name="department"
                className="auth-input"
                onChange={(e) => {
                  const dep = departments.find(
                    (d) => d.id === parseInt(e.target.value)
                  );
                  setDepartment(dep || null);
                  setFormData((prev) => ({ ...prev, city: null }));
                }}
                value={department?.id || ""}
              >
                <option value="">Department</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="form-field">
              <select
                name="city"
                value={formData.city?.id || ""}
                onChange={(e) => {
                  const city = cities.find(
                    (c) => c.id === parseInt(e.target.value)
                  );
                  setFormData((prev) => ({ ...prev, city: city || null }));
                }}
                className={`auth-input ${errors.city ? "input-error" : ""}`}
              >
                <option value="">City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span className="field-error">{errors.city}</span>
              )}
            </div>

            {/* Address */}
            <div className="form-field">
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`auth-input ${errors.address ? "input-error" : ""}`}
              />
              {errors.address && (
                <span className="field-error">{errors.address}</span>
              )}
            </div>

            {/* Section: Features */}
            <h2 className="form-section-title">Features</h2>
            <div className="form-row-dual">
              <div className="form-field">
                <input
                  name="area"
                  placeholder="Area (m²)"
                  value={formData.area}
                  onChange={handleChange}
                  className={`auth-input ${errors.area ? "input-error" : ""}`}
                />
                {errors.area && (
                  <span className="field-error">{errors.area}</span>
                )}
              </div>
              <div className="form-field">
                <input
                  name="rooms"
                  placeholder="Bedrooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className={`auth-input ${errors.rooms ? "input-error" : ""}`}
                />
                {errors.rooms && (
                  <span className="field-error">{errors.rooms}</span>
                )}
              </div>
            </div>

            <div className="form-row-dual">
              <div className="form-field">
                <input
                  name="bathrooms"
                  placeholder="Bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={`auth-input ${
                    errors.bathrooms ? "input-error" : ""
                  }`}
                />
                {errors.bathrooms && (
                  <span className="field-error">{errors.bathrooms}</span>
                )}
              </div>
              <div className="form-field">
                <div
                  className={`image-uploader inline-uploader ${
                    errors.images ? "input-error" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <span className="uploader-label">
                    Upload photos of your property *
                  </span>
                  <span className="uploader-hint single-line">
                    Click or drag & drop (JPG / PNG)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                {errors.images && (
                  <span className="field-error">{errors.images}</span>
                )}
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="image-previews">
                {formData.images.map((img, i) => (
                  <div className="image-thumb" key={i}>
                    <button
                      type="button"
                      className="remove-image-btn"
                      aria-label="Remove photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                    >
                      ×
                    </button>
                    <img src={URL.createObjectURL(img)} alt="preview" />
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="auth-btn primary"
            >
              {submitting ? "Registering..." : "Register property"}
            </button>

            {submitting && (
              <p className="status neutral">Processing registration...</p>
            )}
            {submitStatus.type === "success" && (
              <p className="status success">{submitStatus.message}</p>
            )}
            {submitStatus.type === "error" && (
              <p className="status error">{submitStatus.message}</p>
            )}

            <p className="auth-alt-link">
              Need an account? <a href="/register">Sign up</a>
            </p>
            <p className="auth-alt-link">
              Already registered? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
};

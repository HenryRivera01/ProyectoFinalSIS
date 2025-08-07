import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
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

    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // Validate form
    const validationErrors = validatePropertyForm(formData, token);
    setErrors(validationErrors);

    // If there are errors, return early
    if (Object.keys(validationErrors).length > 0) {
      // Display first error message
      const firstError = Object.values(validationErrors)[0];
      alert(firstError);
      return;
    }

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
      console.log("Payload enviado:", payload);

      const res = await fetch("http://localhost:8080/api/v1/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token!,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = "Error al registrar la propiedad";
        try {
          const error = await res.json();
          errorMsg = error.message || JSON.stringify(error);
          console.error("Respuesta error backend:", error);
        } catch {
          const text = await res.text();
          errorMsg = text;
          console.error("Respuesta error backend (texto):", text);
        }
        alert("Error: " + errorMsg);
        throw new Error(errorMsg);
      }

      alert("Propiedad registrada con éxito");
      console.log(await res.json());
    } catch (err) {
      console.error("Error:", err);
      alert("Error al registrar la propiedad: " + (err as Error).message);
    }
  };

  return (
    <main>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className={errors.price ? "error" : ""}
        />
        {errors.price && <span style={{ color: "red" }}>{errors.price}</span>}

        <select
          name="operationType"
          value={formData.operationType}
          onChange={handleChange}
          className={errors.operationType ? "error" : ""}
        >
          <option value="">Operation type</option>
          <option value="BUY">Buy</option>
          <option value="LEASE">Lease</option>
        </select>
        {errors.operationType && (
          <span style={{ color: "red" }}>{errors.operationType}</span>
        )}

        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className={errors.propertyType ? "error" : ""}
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
          <span style={{ color: "red" }}>{errors.propertyType}</span>
        )}

        <select
          name="department"
          onChange={(e) => {
            const dep = departments.find(
              (d) => d.id === parseInt(e.target.value)
            );
            setDepartment(dep || null);
            setFormData((prev) => ({
              ...prev,
              city: null,
            }));
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

        <select
          name="city"
          value={formData.city?.id || ""}
          onChange={(e) => {
            const city = cities.find((c) => c.id === parseInt(e.target.value));
            setFormData((prev) => ({ ...prev, city: city || null }));
          }}
          className={errors.city ? "error" : ""}
        >
          <option value="">City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <span style={{ color: "red" }}>{errors.city}</span>}

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? "error" : ""}
        />
        {errors.address && (
          <span style={{ color: "red" }}>{errors.address}</span>
        )}

        <input
          name="area"
          placeholder="Area (m²)"
          value={formData.area}
          onChange={handleChange}
          className={errors.area ? "error" : ""}
        />
        {errors.area && <span style={{ color: "red" }}>{errors.area}</span>}

        <input
          name="rooms"
          placeholder="Bedrooms"
          value={formData.rooms}
          onChange={handleChange}
          className={errors.rooms ? "error" : ""}
        />
        {errors.rooms && <span style={{ color: "red" }}>{errors.rooms}</span>}

        <input
          name="bathrooms"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          className={errors.bathrooms ? "error" : ""}
        />
        {errors.bathrooms && (
          <span style={{ color: "red" }}>{errors.bathrooms}</span>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className={errors.images ? "error" : ""}
        />
        {errors.images && <span style={{ color: "red" }}>{errors.images}</span>}

        {formData.images.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {formData.images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt="preview"
                width={100}
              />
            ))}
          </div>
        )}

        <button type="submit">Register property</button>
      </form>
    </main>
  );
};

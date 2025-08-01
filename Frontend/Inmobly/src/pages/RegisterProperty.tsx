import { useState } from "react";
import { departmentsWithCities } from "../data/mockLocations";
import type { Department } from "../data/mockLocations";

type FormData = {
  description: string;
  price: string;
  type: "venta" | "arriendo" | "";
  department: Department | "";
  city: string;
  address: string;
  area: string;
  rooms: string;
  bathrooms: string;
  images: File[];
};

export const RegisterProperty = () => {
  const [formData, setFormData] = useState<FormData>({
    description: "",
    price: "",
    type: "",
    department: "",
    city: "",
    address: "",
    area: "",
    rooms: "",
    bathrooms: "",
    images: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImagesToCloudinary = async (
    images: File[]
  ): Promise<string[]> => {
    const urls: string[] = [];

    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "unsigned_preset"); // tu preset real
      formData.append("folder", "properties");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dcd4zd5mr/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      urls.push(data.secure_url);
    }

    return urls;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files ?? [])],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrls = await uploadImagesToCloudinary(formData.images);

      const payload = {
        type: "house",
        operationType: formData.type === "venta" ? "onSale" : "onLease",
        department: formData.department,
        city: formData.city,
        address: formData.address,
        price: Number(formData.price),
        area: Number(formData.area),
        pictures: imageUrls,
        bedrooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms),
      };

      console.log("Payload:", payload);
      // Aquí puedes hacer tu POST al backend
    } catch (error) {
      console.error("Error al subir imágenes o enviar el formulario:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="text"
        name="price"
        placeholder="Precio"
        value={formData.price}
        onChange={handleChange}
      />

      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="">Operation</option>
        <option value="venta">Sell</option>
        <option value="arriendo">Lease</option>
      </select>

      <select
        name="department"
        value={formData.department}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            department: e.target.value as Department,
            city: "", // limpiar ciudad si cambia departamento
          }))
        }
      >
        <option value="">Department</option>
        {Object.keys(departmentsWithCities).map((dep) => (
          <option key={dep} value={dep}>
            {dep}
          </option>
        ))}
      </select>

      {formData.department && (
        <select name="city" value={formData.city} onChange={handleChange}>
          <option value="">City</option>
          {departmentsWithCities[formData.department].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <input
        type="text"
        name="area"
        placeholder="Area (m²)"
        value={formData.area}
        onChange={handleChange}
      />
      <input
        type="text"
        name="rooms"
        placeholder="Bedrooms"
        value={formData.rooms}
        onChange={handleChange}
      />
      <input
        type="text"
        name="bathrooms"
        placeholder="Bathrooms"
        value={formData.bathrooms}
        onChange={handleChange}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      {formData.images.length > 0 && (
        <div>
          <p>Selected images:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {formData.images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                width={100}
                height={100}
              />
            ))}
          </div>
        </div>
      )}
      <button
        type="submit"
      >
        Register Property
      </button>
    </form>
  );
};

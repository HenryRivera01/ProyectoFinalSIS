import { useEffect, useState } from "react";

type Department = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};

type FormData = {
  description: string;
  price: string;
  type: "venta" | "arriendo" | "";
  department: Department | null;
  city: City | null;
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
    department: null,
    city: null,
    address: "",
    area: "",
    rooms: "",
    bathrooms: "",
    images: [],
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/location/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error cargando departamentos", err));
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetch(
        `http://localhost:8080/api/v1/location/departments/${formData.department.id}/cities`
      )
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Error cargando ciudades", err));
    } else {
      setCities([]);
    }
  }, [formData.department]);

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
    try {
      const token = localStorage.getItem("authToken");
      const ownerId = localStorage.getItem("ownerId");

      if (!token || !ownerId) {
        alert("Falta autenticación o ownerId");
        return;
      }

      const imageUrls = await uploadImagesToCloudinary(formData.images);

      const payload = {
        registryNumber: Date.now(),
        operationType: formData.type === "venta" ? "SELL" : "LEASE",
        address: formData.address,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        image: imageUrls[0], // solo se usa la primera imagen
        numberOfBathrooms: parseInt(formData.bathrooms),
        numberOfBedRooms: parseInt(formData.rooms),
        cityId: formData.city?.id,
        ownerId: Number(ownerId),
        propertyType: "HOUSE",
      };

      const res = await fetch("http://localhost:8080/api/v1/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al registrar la propiedad");
      }

      alert("Propiedad registrada con éxito");
      console.log(await res.json());
    } catch (err) {
      console.error("Error:", err);
      alert("Error al registrar la propiedad");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="price"
        placeholder="Precio"
        value={formData.price}
        onChange={handleChange}
      />
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="">Tipo de operación</option>
        <option value="venta">Venta</option>
        <option value="arriendo">Arriendo</option>
      </select>

      <select
        name="department"
        onChange={(e) => {
          const dep = departments.find(
            (d) => d.id === parseInt(e.target.value)
          );
          setFormData((prev) => ({
            ...prev,
            department: dep || null,
            city: null,
          }));
        }}
        value={formData.department?.id || ""}
      >
        <option value="">Departamento</option>
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
      >
        <option value="">Ciudad</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <input
        name="address"
        placeholder="Dirección"
        value={formData.address}
        onChange={handleChange}
      />
      <input
        name="area"
        placeholder="Área (m²)"
        value={formData.area}
        onChange={handleChange}
      />
      <input
        name="rooms"
        placeholder="Habitaciones"
        value={formData.rooms}
        onChange={handleChange}
      />
      <input
        name="bathrooms"
        placeholder="Baños"
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

      <button type="submit">Registrar propiedad</button>
    </form>
  );
};

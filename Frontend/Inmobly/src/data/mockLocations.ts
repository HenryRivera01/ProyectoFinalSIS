export const departmentsWithCities = {
  Antioquia: ["Medellín", "Envigado", "Bello"],
  Cundinamarca: ["Bogotá", "Soacha", "Chía"],
  Valle: ["Cali", "Palmira", "Tuluá"],
  Atlántico: ["Barranquilla", "Soledad"],
  Santander: ["Bucaramanga", "Floridablanca"],
  Bolívar: ["Cartagena", "Magangué"],
  Nariño: ["Pasto", "Tumaco"],
  NorteDeSantander: ["Cúcuta", "Ocaña"],
  Tolima: ["Ibagué", "Espinal"],
  Risaralda: ["Pereira", "Dosquebradas"],
  Caldas: ["Manizales", "La Dorada"],
} as const;

export type Department = keyof typeof departmentsWithCities;
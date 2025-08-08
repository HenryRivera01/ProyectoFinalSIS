// Convierte una cadena de dígitos en formato $1.234.567
export function formatMoneyDigits(digits: string): string {
  if (!digits) return "";
  return "$" + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Extrae solo dígitos de una entrada (permite pegar con símbolos)
export function stripMoneyFormatting(input: string): string {
  return input.replace(/\D/g, "");
}

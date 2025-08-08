// Formats a numeric digit-only string into a money-like representation ($1.234.567)
export function formatMoneyDigits(digits: string): string {
  if (!digits) return "";
  return "$" + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Strips all non-digit characters from a money input (normalization)
export function stripMoneyFormatting(input: string): string {
  return input.replace(/\D/g, "");
}

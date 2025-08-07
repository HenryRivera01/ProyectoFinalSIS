export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
  credentials?: string;
};

export const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // Email validation
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

// Mapeo de códigos de error de la API a mensajes amigables
export const getErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "Bad request. Please verify your email and password.";
    case 401:
      return "Invalid credentials. Please check your email and password.";
    case 403:
      return "Access forbidden. You don't have permission to access this resource.";
    case 404:
      return "User not found. This email is not registered.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

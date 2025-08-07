export type RegisterFormData = {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export type RegisterFormErrors = {
  documentType?: string;
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
};

export const validateRegisterForm = (
  formData: RegisterFormData
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  // Required fields validation
  if (!formData.documentType) {
    errors.documentType = "Document type is required";
  } else if (!["CC", "CE"].includes(formData.documentType)) {
    errors.documentType = "Please select a valid document type";
  }

  if (!formData.documentNumber) {
    errors.documentNumber = "Document number is required";
  } else if (!/^\d+$/.test(formData.documentNumber)) {
    errors.documentNumber = "Invalid document number";
  } else if (formData.documentNumber.length > 10 || formData.documentNumber.length < 5) {
    errors.documentNumber = "Invalid document number";
  }

  if (!formData.firstName) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName) {
    errors.lastName = "Last name is required";
  }

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!formData.phoneNumber) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^\d+$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "Invalid phone number";
  } else if (formData.phoneNumber.length < 7 || formData.phoneNumber.length > 10) {
    errors.phoneNumber = "Invalid phone number";
  }

  return errors;
};


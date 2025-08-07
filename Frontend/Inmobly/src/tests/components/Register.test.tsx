import {
  validateRegisterForm,
  type RegisterFormData,
} from "../../features/user/validateRegister";
import "@testing-library/jest-dom";

describe("User Registration Form Validation", () => {
  // Base valid form data that we'll modify for specific tests
  const validFormData: RegisterFormData = {
    documentType: "CC",
    documentNumber: "12345678",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    phoneNumber: "3001234567",
  };

  it("Given all fields with valid values, When validating form, Then returns no errors", () => {
    const errors = validateRegisterForm(validFormData);
    expect(errors).toEqual({});
  });

  it("Given document type not selected, When validating form, Then returns document type error", () => {
    const formData = { ...validFormData, documentType: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.documentType).toBe("Document type is required");
  });

  it("Given invalid document type, When validating form, Then returns document type error", () => {
    const formData = { ...validFormData, documentType: "XX" };
    const errors = validateRegisterForm(formData);
    expect(errors.documentType).toBe("Please select a valid document type");
  });

  it("Given document number left blank, When validating form, Then returns document number error", () => {
    const formData = { ...validFormData, documentNumber: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.documentNumber).toBe("Document number is required");
  });

  it("Given non-numeric document number, When validating form, Then returns document number error", () => {
    const formData = { ...validFormData, documentNumber: "ABC123" };
    const errors = validateRegisterForm(formData);
    expect(errors.documentNumber).toBe("Invalid document number");
  });

  it("Given document number too short, When validating form, Then returns document number error", () => {
    const formData = { ...validFormData, documentNumber: "1234" };
    const errors = validateRegisterForm(formData);
    expect(errors.documentNumber).toBe("Invalid document number");
  });

  it("Given document number too long, When validating form, Then returns document number error", () => {
    const formData = { ...validFormData, documentNumber: "12345678901" };
    const errors = validateRegisterForm(formData);
    expect(errors.documentNumber).toBe("Invalid document number");
  });

  it("Given first name left blank, When validating form, Then returns first name error", () => {
    const formData = { ...validFormData, firstName: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.firstName).toBe("First name is required");
  });

  it("Given last name left blank, When validating form, Then returns last name error", () => {
    const formData = { ...validFormData, lastName: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.lastName).toBe("Last name is required");
  });

  it("Given email left blank, When validating form, Then returns email error", () => {
    const formData = { ...validFormData, email: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.email).toBe("Email is required");
  });

  it("Given invalid email format, When validating form, Then returns email error", () => {
    const formData = { ...validFormData, email: "invalid-email" };
    const errors = validateRegisterForm(formData);
    expect(errors.email).toBe("Invalid email format");
  });

  it("Given password left blank, When validating form, Then returns password error", () => {
    const formData = { ...validFormData, password: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.password).toBe("Password is required");
  });

  it("Given password too short, When validating form, Then returns password error", () => {
    const formData = { ...validFormData, password: "12345" };
    const errors = validateRegisterForm(formData);
    expect(errors.password).toBe("Password must be at least 6 characters");
  });

  it("Given phone number left blank, When validating form, Then returns phone number error", () => {
    const formData = { ...validFormData, phoneNumber: "" };
    const errors = validateRegisterForm(formData);
    expect(errors.phoneNumber).toBe("Phone number is required");
  });

  it("Given non-numeric phone number, When validating form, Then returns phone number error", () => {
    const formData = { ...validFormData, phoneNumber: "ABC123456" };
    const errors = validateRegisterForm(formData);
    expect(errors.phoneNumber).toBe("Invalid phone number");
  });

  it("Given phone number too short, When validating form, Then returns phone number error", () => {
    const formData = { ...validFormData, phoneNumber: "123456" };
    const errors = validateRegisterForm(formData);
    expect(errors.phoneNumber).toBe("Invalid phone number");
  });

  it("Given phone number too long, When validating form, Then returns phone number error", () => {
    const formData = { ...validFormData, phoneNumber: "12345678901" };
    const errors = validateRegisterForm(formData);
    expect(errors.phoneNumber).toBe("Invalid phone number");
  });
});

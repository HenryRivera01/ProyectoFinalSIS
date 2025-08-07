import {
  validatePropertyForm,
  generateRegistryNumber,
  type PropertyFormData,
} from "../../features/properties/validatePropertyForm";
import "@testing-library/jest-dom";

describe("Property Registration Form Validation", () => {
  // Base valid form data that we'll modify for specific tests
  const validFormData: PropertyFormData = {
    price: "100000",
    operationType: "BUY",
    propertyType: "HOUSE",
    city: { id: 1, name: "City1" },
    address: "123 Main St",
    area: "120",
    rooms: "3",
    bathrooms: "2",
    images: [new File([""], "test.jpg", { type: "image/jpeg" })],
  };

  const validToken = "valid-token";

  it("Given all fields with valid values and user logged in, When validating form, Then returns no errors", () => {
    const errors = validatePropertyForm(validFormData, validToken);
    expect(errors).toEqual({});
  });

  it("Given user not logged in, When validating form, Then returns authentication error", () => {
    const errors = validatePropertyForm(validFormData, null);
    expect(errors.auth).toBe("Authentication required");
  });

  it("Given city field left blank, When validating form, Then returns city error", () => {
    const formData = { ...validFormData, city: null };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.city).toBe("City is required");
  });

  it("Given operation type not selected, When validating form, Then returns operation type error", () => {
    const formData = { ...validFormData, operationType: "" };
    const errors = validatePropertyForm(formData as unknown as PropertyFormData, validToken);
    expect(errors.operationType).toBe("Operation type is required");
  });

  it("Given invalid operation type, When validating form, Then returns operation type error", () => {
    const formData = { ...validFormData, operationType: "INVALID" };
    const errors = validatePropertyForm(formData as unknown as PropertyFormData, validToken);
    expect(errors.operationType).toBe("Please select a valid operation type");
  });

  it("Given address field blank, When validating form, Then returns address error", () => {
    const formData = { ...validFormData, address: "" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.address).toBe("Address is required");
  });

  it("Given price blank, When validating form, Then returns price error", () => {
    const formData = { ...validFormData, price: "" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.price).toBe("Price is required");
  });

  it("Given price is zero, When validating form, Then returns price error", () => {
    const formData = { ...validFormData, price: "0" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.price).toBe("Invalid price");
  });

  it("Given price is negative, When validating form, Then returns price error", () => {
    const formData = { ...validFormData, price: "-100" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.price).toBe("Invalid price");
  });

  it("Given area blank, When validating form, Then returns area error", () => {
    const formData = { ...validFormData, area: "" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.area).toBe("Area is required");
  });

  it("Given area is zero, When validating form, Then returns area error", () => {
    const formData = { ...validFormData, area: "0" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.area).toBe("Invalid area");
  });

  it("Given area is negative, When validating form, Then returns area error", () => {
    const formData = { ...validFormData, area: "-50" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.area).toBe("Invalid area");
  });

  it("Given no images uploaded, When validating form, Then returns images error", () => {
    const formData = { ...validFormData, images: [] };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.images).toBe("Please upload at least one image");
  });

  it("Given more than 4 images uploaded, When validating form, Then returns images error", () => {
    const formData = {
      ...validFormData,
      images: [
        new File([""], "test1.jpg", { type: "image/jpeg" }),
        new File([""], "test2.jpg", { type: "image/jpeg" }),
        new File([""], "test3.jpg", { type: "image/jpeg" }),
        new File([""], "test4.jpg", { type: "image/jpeg" }),
        new File([""], "test5.jpg", { type: "image/jpeg" }),
      ],
    };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.images).toBe("Please upload 1-4 images");
  });

  it("Given bedrooms is not a number, When validating form, Then returns bedrooms error", () => {
    const formData = { ...validFormData, rooms: "abc" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.rooms).toBe("Invalid number of bedrooms");
  });

  it("Given bedrooms is zero, When validating form, Then returns bedrooms error", () => {
    const formData = { ...validFormData, rooms: "0" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.rooms).toBe("Invalid number of bedrooms");
  });

  it("Given bedrooms is not an integer, When validating form, Then returns bedrooms error", () => {
    const formData = { ...validFormData, rooms: "2.5" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.rooms).toBe("Invalid number of bedrooms");
  });

  it("Given bathrooms is not a number, When validating form, Then returns bathrooms error", () => {
    const formData = { ...validFormData, bathrooms: "abc" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.bathrooms).toBe("Invalid number of bathrooms");
  });

  it("Given bathrooms is zero, When validating form, Then returns bathrooms error", () => {
    const formData = { ...validFormData, bathrooms: "0" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.bathrooms).toBe("Invalid number of bathrooms");
  });

  it("Given bathrooms is not an integer, When validating form, Then returns bathrooms error", () => {
    const formData = { ...validFormData, bathrooms: "1.5" };
    const errors = validatePropertyForm(formData, validToken);
    expect(errors.bathrooms).toBe("Invalid number of bathrooms");
  });
});

describe("Registry Number Generation", () => {
  it("should generate a registry number with up to 10 digits", () => {
    const registryNumber = generateRegistryNumber();
    expect(typeof registryNumber).toBe("number");
    expect(String(registryNumber).length).toBeLessThanOrEqual(10);
    expect(registryNumber).toBeGreaterThan(0);
  });
});
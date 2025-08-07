package com.juan.property.property_recommendation.auth.dto;

import com.juan.property.property_recommendation.user.DocumentType;
import jakarta.validation.constraints.*;
import lombok.*;


@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisterRequest {

    @NotNull(message = "The document type is required")
    private DocumentType documentType;
    @NotNull(message = "The document number is required")
    @Positive(message = "The document number must be grater than zero")
    @Min(value = 1000000000L, message = "document number must be at least 10 digits")
    @Max(value = 9999999999L, message = "document number must be at most 10 digits")
    private Long documentNumber;
    @NotBlank(message = "The firstname must not be blank")
    private String firstName;
    @NotBlank(message = "The lastname must not be blank")
    private String lastName;
    @NotBlank(message = "The email must not be blank")
    @Email(message = "The email format is invalid")
    private String email;
    @NotBlank(message = "The password must not be blank")
    private String password;
    @NotNull(message = "The phone number is required")
    @Positive(message = "The phone number must be grater than zero")
    @Min(value = 1000000000L, message = "Phone number must be at least 10 digits")
    @Max(value = 9999999999L, message = "Phone number must be at most 10 digits")
    private Long phoneNumber;



}

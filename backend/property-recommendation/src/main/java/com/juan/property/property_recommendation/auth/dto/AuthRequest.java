package com.juan.property.property_recommendation.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthRequest {
    @NotBlank(message = "The email must not be blank")
    @Email(message = "The email format is invalid")
    private String email;
    @NotBlank(message = "The password must not be blank")
    private String password;
}

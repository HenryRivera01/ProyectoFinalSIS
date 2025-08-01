package com.juan.property.property_recommendation.auth.dto;

import com.juan.property.property_recommendation.user.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterRequest {
    private DocumentType documentType;
    private Long documentNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Long phoneNumber;
}

package com.juan.property.property_recommendation.auth.dto;

import com.juan.property.property_recommendation.user.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisterResponse {

    private DocumentType documentType;
    private Long documentNumber;
    private String firstName;
    private String lastName;
    private String email;
    private Long phoneNumber;



}

package com.juan.property.property_recommendation.auth;

import com.juan.property.property_recommendation.auth.dto.RegisterResponse;
import com.juan.property.property_recommendation.user.User;
import org.springframework.stereotype.Controller;

@Controller
public class AuthMapper {

    public RegisterResponse registerUserToDto(User user) {
        return RegisterResponse.builder()
                .documentType(user.getDocumentType())
                .documentNumber(user.getDocumentNumber())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}

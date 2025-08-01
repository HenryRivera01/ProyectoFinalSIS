package com.juan.property.property_recommendation.auth;

import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.user.User;
import org.springframework.stereotype.Controller;

@Controller
public class AuthMapper {

    public User dtoToUser(AuthRequest authRequest) {
        return null;
//        return User.builder()
//                .email(authRequest.ge)
//                .build();
    }
}

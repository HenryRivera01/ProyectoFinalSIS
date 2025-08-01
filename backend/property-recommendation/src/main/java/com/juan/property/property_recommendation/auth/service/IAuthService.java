package com.juan.property.property_recommendation.auth.service;

import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;

import java.util.Optional;

public interface IAuthService {

    void register(RegisterRequest registerRequest);
    String login(AuthRequest authRequest);
    Optional<User> authenticate(String token);

}

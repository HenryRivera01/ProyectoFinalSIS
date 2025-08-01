package com.juan.property.property_recommendation.auth;

import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.auth.dto.AuthResponse;
import com.juan.property.property_recommendation.auth.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(
            @RequestBody RegisterRequest registerRequest
    ) {
        authService.register(registerRequest);
        return "User registered successfully";
    }


    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(
            @RequestBody AuthRequest authRequest
    ) {
        return new AuthResponse(authService.login(authRequest));
    }


}

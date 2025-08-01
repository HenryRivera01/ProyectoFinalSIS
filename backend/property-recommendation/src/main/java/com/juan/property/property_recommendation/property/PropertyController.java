package com.juan.property.property_recommendation.property;

import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.property.dto.PropertyFilterRequest;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.property.service.PropertyService;
import com.juan.property.property_recommendation.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final AuthService authService;
    private final PropertyService propertyService;

    private User requiredAuth(String token){
        return authService.authenticate(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping
    public List<PropertyResponse> findAll(){
        return propertyService.findAll();
    }

    @PostMapping
    public PropertyResponse register(
            @RequestHeader("X-Auth-Token") String token,
            @RequestBody PropertyRequest propertyRequest
    ){
        User user = requiredAuth(token);
        return propertyService.register(propertyRequest);
    }

    @GetMapping("/filter")
    public List<PropertyResponse> filterProperties(PropertyFilterRequest filter) {
        return propertyService.filter(filter);
    }
}

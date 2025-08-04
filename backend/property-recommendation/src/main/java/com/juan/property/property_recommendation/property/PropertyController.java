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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropertyController {

    private final AuthService authService;
    private final PropertyService propertyService;

    private User requiredAuth(String token){
        return authService.authenticate(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping
    public List<PropertyResponse> findAll(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea,
            @RequestParam(required = false) Integer numberOfBathrooms,
            @RequestParam(required = false) Integer numberOfBedrooms,
            @RequestParam(required = false) String operationType,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Integer city
    ){
        PropertySpecification propertySpecification = new PropertySpecification(minPrice,
                maxPrice,
                minArea,
                maxArea,
                numberOfBathrooms,
                numberOfBedrooms,
                operationType,
                propertyType,
                city);
        return propertyService.findAll(propertySpecification);
    }

    @PostMapping
    public PropertyResponse register(
            @RequestHeader("X-Auth-Token") String token,
            @RequestBody PropertyRequest propertyRequest
    ){
        User user = requiredAuth(token);
        return propertyService.register(propertyRequest, user);
    }

//    @GetMapping("/filter")
//    public List<PropertyResponse> filterProperties(@ModelAttribute  PropertyFilterRequest filter) {
//        return propertyService.filter(filter);
//    }
}

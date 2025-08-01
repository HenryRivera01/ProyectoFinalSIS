package com.juan.property.property_recommendation.location.mapper;


import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.dto.CityResponse;
import org.springframework.stereotype.Component;

@Component
public class CityMapper {

    public CityResponse toCityResponse(City city) {
        return CityResponse.builder()
                .id(city.getId())
                .name(city.getName())
                .build();
    }
}

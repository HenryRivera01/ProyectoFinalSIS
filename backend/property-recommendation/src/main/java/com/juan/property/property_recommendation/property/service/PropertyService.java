package com.juan.property.property_recommendation.property.service;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.property.Property;
import com.juan.property.property_recommendation.property.PropertyMapper;
import com.juan.property.property_recommendation.property.PropertyRepository;
import com.juan.property.property_recommendation.property.PropertySpecification;
import com.juan.property.property_recommendation.property.dto.PropertyFilterRequest;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService implements  IPropertyService{

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final CityRepository cityRepository;



    @Override
    public List<PropertyResponse> findAll(PropertySpecification propertySpecification ) {
        return propertyRepository.findAll(propertySpecification).stream()
                .map(propertyMapper::propertyToDto).collect(Collectors.toList());
    }

    @Override
    public PropertyResponse register(PropertyRequest propertyRequest, User user) {
        Optional<Property> existingproperty = propertyRepository.findByRegistryNumber(propertyRequest.getRegistryNumber());
        if(existingproperty.isPresent()) {
            throw new RuntimeException("The property already exists");
        }

        Optional<City> city = cityRepository.findById(propertyRequest.getCityId());
        if(city.isEmpty()) {
            throw new RuntimeException("The city  does not exist");
        }

       var newProperty = propertyMapper.dtoToProperty(propertyRequest);

        newProperty.setUser(user);
        newProperty.setCity(city.get());
        return propertyMapper.propertyToDto(propertyRepository.save(newProperty));
    }






}

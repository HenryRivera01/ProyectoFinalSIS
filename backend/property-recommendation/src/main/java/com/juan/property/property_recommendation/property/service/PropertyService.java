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
        Optional<City> city = cityRepository.findById(propertyRequest.getCityId());
        if(city.isEmpty()) {
            throw new RuntimeException("The city  does not exist");
        }
       var newProperty = propertyMapper.dtoToProperty(propertyRequest);

        newProperty.setUser(user);
        newProperty.setCity(city.get());
       //propertyRepository.save(newProperty);
        return propertyMapper.propertyToDto(propertyRepository.save(newProperty));
    }

//    public List<PropertyResponse> filter(PropertyFilterRequest filter) {
//        return propertyRepository.findAll().stream()
//                .filter(p -> filter.getMinPrice() == null || p.getPrice() >= filter.getMinPrice())
//                .filter(p -> filter.getMaxPrice() == null || p.getPrice() <= filter.getMaxPrice())
//                .filter(p -> filter.getMinArea() == null || p.getArea() >= filter.getMinArea())
//                .filter(p -> filter.getMaxArea() == null || p.getArea() <= filter.getMaxArea())
//                .filter(p -> filter.getNumberOfBathrooms() == null || p.getNumberOfBathrooms().equals(filter.getNumberOfBathrooms()))
//                .filter(p -> filter.getNumberOfBedRooms() == null || p.getNumberOfBathrooms().equals(filter.getNumberOfBedRooms()))
//                .filter(p -> filter.getCityId() == null || (p.getCity() != null && p.getCity().getId().equals(filter.getCityId())))
//                .filter(p -> filter.getPropertyType() == null || p.getPropertyType().equals(filter.getPropertyType()))
//                .filter(p -> filter.getOperationType() == null || p.getOperationType().equals(filter.getOperationType()))
//                .map(propertyMapper::propertyToDto)
//                .collect(Collectors.toList());
//    }





}

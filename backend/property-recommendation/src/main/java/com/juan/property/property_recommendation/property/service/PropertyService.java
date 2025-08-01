package com.juan.property.property_recommendation.property.service;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.property.PropertyMapper;
import com.juan.property.property_recommendation.property.PropertyRepository;
import com.juan.property.property_recommendation.property.dto.PropertyFilterRequest;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService implements  IPropertyService{

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final CityRepository cityRepository;
    private final UserRepository userRepository;


    @Override
    public List<PropertyResponse> findAll() {
        return propertyRepository.findAll().stream()
                .map(propertyMapper::propertyToDto).collect(Collectors.toList());
    }

    @Override
    public PropertyResponse register(PropertyRequest propertyRequest) {
        Optional<City> city = cityRepository.findById(propertyRequest.getCityId());
        if(city.isEmpty()) {
            throw new RuntimeException("The city  does not exist");
        }
        Optional<User> user = userRepository.findById(propertyRequest.getOwnerId());
        if(user.isEmpty()) {
            throw new RuntimeException("The user  does not exist");
        }
       var newProperty = propertyMapper.dtoToProperty(propertyRequest);
        newProperty.setUser(user.get());
        newProperty.setCity(city.get());
       propertyRepository.save(newProperty);
        return propertyMapper.propertyToDto(newProperty);
    }

    public List<PropertyResponse> filter(PropertyFilterRequest filter) {
        return propertyRepository.findAll().stream()
                .filter(p -> filter.getMinPrice() == null || p.getPrice() >= filter.getMinPrice())
                .filter(p -> filter.getMaxPrice() == null || p.getPrice() <= filter.getMaxPrice())
                .filter(p -> filter.getMinArea() == null || p.getArea() >= filter.getMinArea())
                .filter(p -> filter.getMaxArea() == null || p.getArea() <= filter.getMaxArea())
                .filter(p -> filter.getNumberOfBathrooms() == null || p.getNumberOfBathrooms().equals(filter.getNumberOfBathrooms()))
                .filter(p -> filter.getNumberOfBedRooms() == null || p.getGetNumberOfBedRooms().equals(filter.getNumberOfBedRooms()))
                .filter(p -> filter.getCityId() == null || (p.getCity() != null && p.getCity().getId().equals(filter.getCityId())))
                .filter(p -> filter.getPropertyType() == null || p.getPropertyType().equals(filter.getPropertyType()))
                .filter(p -> filter.getOperationType() == null || p.getOperationType().equals(filter.getOperationType()))
                .map(propertyMapper::propertyToDto)
                .collect(Collectors.toList());
    }


}

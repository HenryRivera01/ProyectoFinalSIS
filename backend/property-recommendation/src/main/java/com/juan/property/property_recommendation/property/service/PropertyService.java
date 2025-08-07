package com.juan.property.property_recommendation.property.service;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.property.*;
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


    private boolean isNumeric(String value) {
        if (value == null || value.isBlank()) {
            return false;
        }
        try {
            Double.parseDouble(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }


    @Override
    public List<PropertyResponse> findAll(PropertySpecification propertySpecification ) {
        return propertyRepository.findAll(propertySpecification).stream()
                .map(propertyMapper::propertyToDto).collect(Collectors.toList());
    }

    @Override
    public PropertyResponse register(PropertyRequest propertyRequest, User user)  {


        //User
        if (user == null) {
            throw   new IllegalArgumentException("User is null");
        }

        //Registry number
        if(propertyRequest.getRegistryNumber() == null || propertyRequest.getRegistryNumber() < 0  || String.valueOf(propertyRequest.getRegistryNumber()).length() != 10){
            throw  new IllegalArgumentException("The registry number is not valid");
        }

        //Invalid Operation type
        if(propertyRequest.getOperationType() == null ){
            throw  new IllegalArgumentException("The operation type is not valid");
        }
        try {
            OperationType.valueOf(propertyRequest.getOperationType().name());
        }catch (IllegalArgumentException e){
            throw  new IllegalArgumentException("The operation type is not valid");
        }


        //Invalid address
        if(propertyRequest.getAddress() == null || propertyRequest.getAddress().isBlank()){
            throw  new IllegalArgumentException("The address is not valid");
        }

        //Invalid area
        if(propertyRequest.getArea() == null || !isNumeric(propertyRequest.getArea().toString()) || propertyRequest.getArea() < 0 ){
            throw  new IllegalArgumentException("The area is not valid");
        }

        //Invalid price
        if(propertyRequest.getPrice() == null || !isNumeric(propertyRequest.getPrice().toString())   ){
            throw  new IllegalArgumentException("The price is not valid");
        }

        // Images
        if(propertyRequest.getImages().isEmpty() || propertyRequest.getImages().size() >4 ){
            throw  new IllegalArgumentException("The image list is not valid");

        }

        //Number of bathrooms
        if(propertyRequest.getNumberOfBathrooms() == null || !isNumeric(propertyRequest.getNumberOfBathrooms().toString()) || propertyRequest.getNumberOfBathrooms() < 0 ){
            throw  new IllegalArgumentException("The number of bathrooms is not valid");
        }

        //Number of bedrooms
        if(propertyRequest.getNumberOfBedrooms() == null || !isNumeric(propertyRequest.getNumberOfBedrooms().toString()) || propertyRequest.getNumberOfBedrooms() < 0 ){
            throw  new IllegalArgumentException("The number of bedrooms is not valid");
        }


        //Property type
        if(propertyRequest.getPropertyType() == null ){
            throw  new IllegalArgumentException("The property type is not valid");
        }
        try {
            PropertyType.valueOf(propertyRequest.getPropertyType().name());
        }catch (IllegalArgumentException e){
            throw  new IllegalArgumentException("The property type is not valid");
        }

        //Valid city
        if(propertyRequest.getCityId() == null || !isNumeric(propertyRequest.getCityId().toString()) || propertyRequest.getCityId() < 0 ){
            throw  new IllegalArgumentException("The city id is not valid");
        }
        Optional<City> city = cityRepository.findById(propertyRequest.getCityId());
        if(city.isEmpty()) {
            throw new RuntimeException("The city  does not exist");
        }


        //The property already exists?
        Optional<Property> existingProperty = propertyRepository.findByRegistryNumber(propertyRequest.getRegistryNumber());
        if(existingProperty.isPresent()) {
            throw new RuntimeException("The property already exists");
        }

       var newProperty = propertyMapper.dtoToProperty(propertyRequest);

        newProperty.setUser(user);
        newProperty.setCity(city.get());
        return propertyMapper.propertyToDto(propertyRepository.save(newProperty));
    }






}

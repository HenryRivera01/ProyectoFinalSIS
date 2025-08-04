package com.juan.property.property_recommendation.property;

import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class PropertyMapper {

    public  PropertyResponse propertyToDto(Property property) {
        return PropertyResponse.builder()
                .registryNumber(property.getRegistryNumber())
                .numberOfBathrooms(property.getNumberOfBathrooms())
                .numberOfBedrooms(property.getNumberOfBedrooms())
                .operationType(property.getOperationType())
                .area(property.getArea())
                .price(property.getPrice())
                .images(property.getImages())
                .address(property.getAddress())
                .city(property.getCity())
                .ownerPhoneNumber(property.getUser().getPhoneNumber())
                .ownerEmail(property.getUser().getEmail())
                .propertyType(property.getPropertyType())
                .build();
    }


    public Property dtoToProperty(PropertyRequest propertyRequest) {
        return Property.builder()
                .registryNumber(propertyRequest.getRegistryNumber())
                .numberOfBathrooms(propertyRequest.getNumberOfBathrooms())
                .numberOfBedrooms(propertyRequest.getNumberOfBedrooms())
                .operationType(propertyRequest.getOperationType())
                .area(propertyRequest.getArea())
                .price(propertyRequest.getPrice())
                .images(propertyRequest.getImages())
                .address(propertyRequest.getAddress())
                .propertyType(propertyRequest.getPropertyType())
                .build();
    }
}

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
                .getNumberOfBedRooms(property.getGetNumberOfBedRooms())
                .operationType(property.getOperationType())
                .area(property.getArea())
                .price(property.getPrice())
                .image(property.getImage())
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
                .getNumberOfBedRooms(propertyRequest.getNumberOfBedRooms())
                .operationType(propertyRequest.getOperationType())
                .area(propertyRequest.getArea())
                .price(propertyRequest.getPrice())
                .image(propertyRequest.getImage())
                .address(propertyRequest.getAddress())
                .propertyType(propertyRequest.getPropertyType())
                .build();
    }
}

package com.juan.property.property_recommendation.property.dto;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PropertyResponse {
    private Long registryNumber;
    private OperationType operationType;
    private String address;
    private BigDecimal price;
    private Double area;
    private List<String> images;
    private Integer numberOfBathrooms;
    private Integer numberOfBedrooms;
    private City city;
    private String ownerEmail;
    private Long ownerPhoneNumber;
    private PropertyType propertyType;

}

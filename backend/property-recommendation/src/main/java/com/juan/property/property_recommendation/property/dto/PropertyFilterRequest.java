package com.juan.property.property_recommendation.property.dto;

import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.PropertyType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyFilterRequest {
    private Double minPrice;
    private Double maxPrice;
    private Double minArea;
    private Double maxArea;
    private Integer numberOfBathrooms;
    private Integer numberOfBedRooms;
    private Integer cityId;
    private OperationType operationType;
    private PropertyType propertyType;
}

package com.juan.property.property_recommendation.property.dto;

import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.PropertyType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class PropertyFilterRequest {
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minArea;
    private Double maxArea;
    private Integer numberOfBathrooms;
    private Integer numberOfBedrooms;
    private Integer cityId;
    private OperationType operationType;
    private PropertyType propertyType;
}

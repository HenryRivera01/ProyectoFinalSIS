package com.juan.property.property_recommendation.property.service;

import com.juan.property.property_recommendation.property.dto.PropertyFilterRequest;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;

import java.util.List;

public interface IPropertyService {

    List<PropertyResponse> findAll();

    PropertyResponse register(PropertyRequest propertyRequest);

    List<PropertyResponse> filter(PropertyFilterRequest filter);
}

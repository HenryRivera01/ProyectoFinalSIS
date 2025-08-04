package com.juan.property.property_recommendation.property.service;

import com.juan.property.property_recommendation.property.PropertySpecification;
import com.juan.property.property_recommendation.property.dto.PropertyFilterRequest;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.user.User;

import java.util.List;

public interface IPropertyService {

    List<PropertyResponse> findAll(PropertySpecification propertySpecification);

    PropertyResponse register(PropertyRequest propertyRequest, User user);

  //  List<PropertyResponse> filter(PropertyFilterRequest filter);
}

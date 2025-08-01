package com.juan.property.property_recommendation.location.service;

import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;

import java.util.List;

public interface ILocationService {

    List<DepartmentResponse> findAllDepartment();
    List<CityResponse> findAllCitiesByDepartmentId(Integer departmentId);
}

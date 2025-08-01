package com.juan.property.property_recommendation.location.mapper;


import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DepartmentMapper {
    public DepartmentResponse toDepartmentResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .build();
    }
}

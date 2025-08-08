package com.juan.property.property_recommendation.location.service;

import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.DepartmentRepository;
import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;
import com.juan.property.property_recommendation.location.mapper.CityMapper;
import com.juan.property.property_recommendation.location.mapper.DepartmentMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Setter
@AllArgsConstructor
@Service
public class LocationService implements ILocationService {

    private final DepartmentRepository departmentRepository;
    private final CityRepository cityRepository;
    private final DepartmentMapper  departmentMapper;
    private final CityMapper cityMapper;

    @Override
    public List<DepartmentResponse> findAllDepartment() {
        return departmentRepository.findAll().stream().map(departmentMapper::toDepartmentResponse).collect(Collectors.toList());
    }

    @Override
    public List<CityResponse> findAllCitiesByDepartmentId(Integer departmentId) {
        Optional<Department> department = departmentRepository.findById(departmentId);

        if (department.isEmpty()) {
            throw new EntityNotFoundException("Department not found");
        }
        return cityRepository.findByDepartment(department.get()).stream().map(cityMapper::toCityResponse).collect(Collectors.toList());
    }
}

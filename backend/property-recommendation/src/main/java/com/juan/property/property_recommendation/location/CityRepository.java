package com.juan.property.property_recommendation.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Integer> {

    List<City> findByDepartment(Department department);
}

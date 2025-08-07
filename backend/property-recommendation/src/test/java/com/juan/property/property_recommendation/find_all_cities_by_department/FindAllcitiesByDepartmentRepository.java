package com.juan.property.property_recommendation.find_all_cities_by_department;


import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.DepartmentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
public class FindAllcitiesByDepartmentRepository {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Test
    @DisplayName("Buscar ciudades por departamento")
    void findCitiesByDepartment() {
        // Arrange
        Department d1 = Department.builder().name("Cundinamarca").build();
        Department d2 = Department.builder().name("Antioquia").build();
        departmentRepository.save(d1);
        departmentRepository.save(d2);

        City c1 = City.builder().name("Bogotá").department(d1).build();
        City c2 = City.builder().name("Soacha").department(d1).build();
        City c3 = City.builder().name("Medellín").department(d2).build();

        cityRepository.saveAll(List.of(c1, c2, c3));

        // Act
        List<City> citiesOfD1 = cityRepository.findByDepartment(d1);
        List<City> citiesOfD2 = cityRepository.findByDepartment(d2);

        // Assert
        assertThat(citiesOfD1.size()).isEqualTo(2);

        assertThat(citiesOfD2.size()).isEqualTo(1);
    }

    @Test
    @DisplayName("Buscar ciudades por departamento null - debe lanzar excepción")
    void findCitiesByNullDepartment_shouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            cityRepository.findByDepartment(null);
        });
    }

    @Test
    @DisplayName("Buscar ciudades por departamento con ID negativo - debe retornar lista vacía")
    void findCitiesByDepartmentWithNegativeId_shouldReturnEmptyList() {
        // Arrange
        Department fakeDepartment = Department.builder().id(-1).name("Falso").build();

        // Act
        List<City> result = cityRepository.findByDepartment(fakeDepartment);

        // Assert
        assertEquals(0, result.size());
    }

    @Test
    @DisplayName("Buscar ciudades por departamento inexistente - debe retornar lista vacía")
    void findCitiesByNonExistingDepartment_shouldReturnEmptyList() {
        // Arrange
        Department nonexistentDepartment = Department.builder().id(999).name("No existe").build();

        // Act
        List<City> result = cityRepository.findByDepartment(nonexistentDepartment);

        // Assert
        assertEquals(0, result.size());
    }
}

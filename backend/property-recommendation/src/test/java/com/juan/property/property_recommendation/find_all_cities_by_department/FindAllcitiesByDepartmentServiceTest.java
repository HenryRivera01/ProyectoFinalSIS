package com.juan.property.property_recommendation.find_all_cities_by_department;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.DepartmentRepository;
import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.mapper.CityMapper;
import com.juan.property.property_recommendation.location.mapper.DepartmentMapper;
import com.juan.property.property_recommendation.location.service.LocationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FindAllcitiesByDepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private DepartmentMapper departmentMapper;

    @Mock
    private CityMapper cityMapper;

    @InjectMocks
    private LocationService locationService;

    @Test
    void testFindAllCitiesByValidDepartmentId() {
        // Arrange
        Department department = Department.builder()
                .id(1)
                .name("Cundinamarca")
                .build();

        City city1 = City.builder().id(1).name("Bogotá").department(department).build();
        City city2 = City.builder().id(2).name("Soacha").department(department).build();

        CityResponse response1 = new CityResponse(1, "Bogotá");
        CityResponse response2 = new CityResponse(2, "Soacha");

        when(departmentRepository.findById(1)).thenReturn(Optional.of(department));
        when(cityRepository.findByDepartment(department)).thenReturn(List.of(city1, city2));
        when(cityMapper.toCityResponse(city1)).thenReturn(response1);
        when(cityMapper.toCityResponse(city2)).thenReturn(response2);

        // Act
        List<CityResponse> result = locationService.findAllCitiesByDepartmentId(1);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(response1, response2);
        verify(departmentRepository).findById(1);
        verify(cityRepository).findByDepartment(department);
        verify(cityMapper).toCityResponse(city1);
        verify(cityMapper).toCityResponse(city2);
    }

    @Test
    void testFindAllCitiesByInvalidDepartmentId() {
        when(departmentRepository.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> locationService.findAllCitiesByDepartmentId(999))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Department not found");

        verify(departmentRepository).findById(999);
        verifyNoInteractions(cityRepository);
        verifyNoInteractions(cityMapper);
    }

}

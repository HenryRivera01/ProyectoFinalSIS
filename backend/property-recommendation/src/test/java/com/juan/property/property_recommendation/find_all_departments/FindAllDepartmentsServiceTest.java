package com.juan.property.property_recommendation.find_all_departments;

import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.DepartmentRepository;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;
import com.juan.property.property_recommendation.location.mapper.DepartmentMapper;
import com.juan.property.property_recommendation.location.service.LocationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FindAllDepartmentsServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private DepartmentMapper departmentMapper;

    @InjectMocks
    private LocationService locationService;

    @Test
    void testFindAllDepartment() {
        Department department1 = Department.builder().id(1).name("Cundinamarca").build();
        Department department2 = Department.builder().id(2).name("Antioquia").build();
        List<Department> departments = Arrays.asList(department1, department2);

        DepartmentResponse response1 = DepartmentResponse.builder().id(1).name("Cundinamarca").build();
        DepartmentResponse response2 = DepartmentResponse.builder().id(2).name("Antioquia").build();

        when(departmentRepository.findAll()).thenReturn(departments);
        when(departmentMapper.toDepartmentResponse(department1)).thenReturn(response1);
        when(departmentMapper.toDepartmentResponse(department2)).thenReturn(response2);

        List<DepartmentResponse> result = locationService.findAllDepartment();

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(response1, response2);
        verify(departmentRepository).findAll();
        verify(departmentMapper).toDepartmentResponse(department1);
        verify(departmentMapper).toDepartmentResponse(department2);
    }
}

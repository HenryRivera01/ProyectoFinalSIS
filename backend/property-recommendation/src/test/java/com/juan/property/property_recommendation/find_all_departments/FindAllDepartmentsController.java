package com.juan.property.property_recommendation.find_all_departments;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.location.LocationController;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;
import com.juan.property.property_recommendation.location.service.LocationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LocationController.class)
public class FindAllDepartmentsController {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LocationService locationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /location/departments - should return list of departments")
    void getAllDepartments_shouldReturnList() throws Exception {
        // Arrange
        DepartmentResponse d1 = DepartmentResponse.builder().id(1).name("Cundinamarca").build();
        DepartmentResponse d2 = DepartmentResponse.builder().id(2).name("Antioquia").build();
        List<DepartmentResponse> departmentList = List.of(d1, d2);

        when(locationService.findAllDepartment()).thenReturn(departmentList);

        // Act & Assert
        mockMvc.perform(get("/location/departments")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }

}

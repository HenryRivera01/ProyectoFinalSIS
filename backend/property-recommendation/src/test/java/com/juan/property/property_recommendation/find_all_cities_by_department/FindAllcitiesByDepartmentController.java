package com.juan.property.property_recommendation.find_all_cities_by_department;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.location.LocationController;
import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.service.LocationService;
import jakarta.persistence.EntityNotFoundException;
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
public class FindAllcitiesByDepartmentController {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LocationService locationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /location/departments/{id}/cities - should return list of cities")
    void getCitiesByDepartmentId_shouldReturnCityList() throws Exception {
        // Arrange
        int departmentId = 1;

        CityResponse city1 = CityResponse.builder().id(1).name("Bogotá").build();
        CityResponse city2 = CityResponse.builder().id(2).name("Soacha").build();

        List<CityResponse> cityList = List.of(city1, city2);

        when(locationService.findAllCitiesByDepartmentId(departmentId)).thenReturn(cityList);

        // Act & Assert
        mockMvc.perform(get("/location/departments/{id}/cities", departmentId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /location/departments/{id}/cities - should return 404 if department not found")
    void getCitiesByInvalidDepartmentId_shouldReturn404() throws Exception {
        // Arrange
        int invalidDepartmentId = 999;

        when(locationService.findAllCitiesByDepartmentId(invalidDepartmentId))
                .thenThrow(new EntityNotFoundException("Department not found"));

        // Act & Assert
        mockMvc.perform(get("/location/departments/{id}/cities", invalidDepartmentId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // o .isNotFound() si manejas la excepción con @ControllerAdvice
    }
}

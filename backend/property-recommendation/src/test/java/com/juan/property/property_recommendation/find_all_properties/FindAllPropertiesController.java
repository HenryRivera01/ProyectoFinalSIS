package com.juan.property.property_recommendation.find_all_properties;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.Property;
import com.juan.property.property_recommendation.property.PropertyController;
import com.juan.property.property_recommendation.property.PropertySpecification;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.property.service.PropertyService;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PropertyController.class)
public class FindAllPropertiesController {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PropertyService propertyService;

    @MockitoBean
    private AuthService authService;

    private City city;
    private User user;
    private PropertyRequest propertyRequest;
    private PropertyResponse propertyResponse;
    private Property property;

    @BeforeEach()
    public void setup() {
        user = User.builder()
                .documentType(DocumentType.CC)
                .documentNumber(1001234357L)
                .firstName("Pepito juan")
                .lastName("Perez rodriguez")
                .email("pepito666@gmail.com")
                .phoneNumber(3138785644L)
                .password("contraseña123")
                .build();

        city = City.builder()
                .id(495)
                .name("Bogota")
                .build();

        propertyRequest = PropertyRequest.builder()
                .registryNumber(1234567890L)
                .operationType(OperationType.SELL)
                .address("Calle 123 #45-67")
                .price(BigDecimal.valueOf(350000000.0))
                .area(120.0)
                .images(List.of("img1.jpg", "img2.jpg"))
                .numberOfBathrooms(2)
                .numberOfBedrooms(3)
                .propertyType(HOUSE)
                .cityId(495)
                .build();

        propertyResponse = PropertyResponse.builder()
                .registryNumber(100100200L)
                .operationType(OperationType.SELL)
                .address("Calle 123 #45-67")
                .price(BigDecimal.valueOf(350_000_000.0))
                .area(120.0)
                .images(List.of("img1.jpg", "img2.jpg"))
                .numberOfBathrooms(2)
                .numberOfBedrooms(3)
                .propertyType(HOUSE)
                .city(city)
                .build();

        property = Property.builder()
                .registryNumber(100100200L)
                .operationType(SELL)
                .address("Calle 123 #45-67")
                .price(BigDecimal.valueOf(350_000_000.0))
                .area(120.0)
                .images(List.of("img1.jpg", "img2.jpg"))
                .numberOfBathrooms(2)
                .numberOfBedrooms(3)
                .propertyType(HOUSE)
                .city(city)
                .user(user)
                .build();

    }



    @Test
    public void findAllPropertiesTest() throws Exception {
        //Given
        PropertySpecification spec = new  PropertySpecification();
        when(propertyService.findAll(any(PropertySpecification.class))).thenReturn(List.of(propertyResponse));


        //when & then
        this.mockMvc.perform(
                MockMvcRequestBuilders.get("/properties")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        //verify
        verify(propertyService, times(1)).findAll(any(PropertySpecification.class));

    }

    @Test
    public void filterPropertiesTest() throws Exception {
        //Given
        PropertySpecification spec = new  PropertySpecification();
        spec.setMinPrice(BigDecimal.valueOf(200000000));
        when(propertyService.findAll(any(PropertySpecification.class))).thenReturn(List.of());


        //when & then
        this.mockMvc.perform(
                MockMvcRequestBuilders.get("/properties")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        //verify
       // verify(propertyService, times(1)).findAll(spec);

    }
}

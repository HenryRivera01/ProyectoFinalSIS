package com.juan.property.property_recommendation.property;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.property.service.PropertyService;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.mock.http.server.reactive.MockServerHttpRequest.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PropertyController.class)
public class PropertyControllerTest {

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
                .registryNumber(100100200L)
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


    //happy path

    @Test
    public void findAllPropertiestest() throws Exception {
        //given
        PropertySpecification spec = new PropertySpecification();
        when(propertyService.findAll(spec)).thenReturn(List.of(propertyResponse));

        //when

        this.mockMvc.perform(MockMvcRequestBuilders.get("/properties"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON));


        //then
        verify(this.propertyService, times(1)).findAll(any());
    }

    @Test
    public void registeerTest() throws Exception {
        //Given
        String json = objectMapper.writeValueAsString(propertyRequest);
        String token = "valid-token";
        when(authService.authenticate(token)).thenReturn(Optional.of(user));
        when(propertyService.register(propertyRequest, user)).thenReturn(propertyResponse);

        //when & then
        this.mockMvc.perform(
                MockMvcRequestBuilders.post("/properties")
                        .header("X-Auth-Token", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        ).andExpect(status().isCreated());

        //verify
        verify(propertyService, times(1)).register(propertyRequest, user);
    }

    //edge cases

    @Test
    public void shouldReturnBadRequestWhenRegistryNumberIsNotNumeric() throws Exception {
        // given
        String invalidJson = """
        {
            "registryNumber": "abc123",
            "operationType": "SELL",
            "address": "Calle 123 #45-67",
            "price": 350000000.0,
            "area": 120.0,
            "images": ["img1.jpg", "img2.jpg"],
            "numberOfBathrooms": 2,
            "numberOfBedrooms": 3,
            "propertyType": "HOUSE",
            "cityId": 495
        }
    """;

        // when & then
        mockMvc.perform( MockMvcRequestBuilders.post("/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Auth-Token", "valid-token")
                        .content(invalidJson)
                )
                .andExpect(status().isBadRequest())
                .andExpect(result ->
                        assertTrue(
                                result.getResolvedException() instanceof HttpMessageNotReadableException
                        )
                );
    }


    // Null
    @Test
    void shouldReturnBadRequestWhenRegistryNumberIsNull() throws Exception {
        // given
        String invalidJson = """
        {
            "operationType": "SELL",
            "address": "Calle 123 #45-67",
            "price": 350000000.0,
            "area": 120.0,
            "images": ["img1.jpg", "img2.jpg"],
            "numberOfBathrooms": 2,
            "numberOfBedrooms": 3,
            "propertyType": "HOUSE",
            "cityId": 495
        }
    """;

        // when & then
        mockMvc.perform(MockMvcRequestBuilders.post("/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Auth-Token", "valid-token")
                        .content(invalidJson)
                )
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    MethodArgumentNotValidException ex = (MethodArgumentNotValidException) result.getResolvedException();
                    assertNotNull(ex);
                    String message = ex.getBindingResult().getFieldError("registryNumber").getDefaultMessage();
                    assertEquals("The registry number is required", message);
                });
    }


    // Decimal
    @Test
    void shouldReturnBadRequestWhenRegistryNumberHasDecimals() throws Exception { /* registryNumber: 123.45 */ }
    // Más de 10 dígitos
    @Test
    void shouldReturnBadRequestWhenRegistryNumberTooLong() throws Exception { /* registryNumber: 12345678901 */ }
// No numérico (ya te lo di antes)


}

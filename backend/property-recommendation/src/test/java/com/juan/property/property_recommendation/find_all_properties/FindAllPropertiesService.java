package com.juan.property.property_recommendation.find_all_properties;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.property.*;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.property.service.PropertyService;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FindAllPropertiesService {
    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private PropertyMapper propertyMapper;

    @Mock
    private CityRepository cityRepository;

    @InjectMocks
    private PropertyService propertyService;


    private City city;
    private User user;

    private PropertyRequest propertyRequest;
    private PropertyResponse propertyResponse;
    private Property property;


    @BeforeEach
    public void setUp() {
        user = User.builder()
                .documentType(DocumentType.CC)
                .documentNumber(1001345637L)
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
    public void testFindAllProperties(){
        //Given
        PropertySpecification spec = new PropertySpecification();
        when(propertyRepository.findAll(spec)).thenReturn(List.of(property));
        when(propertyMapper.propertyToDto(property)).thenReturn(propertyResponse);

        List<PropertyResponse> properties = propertyService.findAll(spec);

        //then
        assertEquals(properties.get(0).getRegistryNumber(), propertyResponse.getRegistryNumber()); assertThat(propertyResponse).isNotNull();


    }

    @Test
    public void testFilterPropertiesW(){
        //Given}}
        PropertySpecification spec = new PropertySpecification();
        spec.setNumberOfBathrooms(4);
        when(propertyRepository.findAll(spec)).thenReturn(List.of());

        List<PropertyResponse> properties = propertyService.findAll(spec);

        //then
        assertEquals(properties.size(), 0);


    }
}

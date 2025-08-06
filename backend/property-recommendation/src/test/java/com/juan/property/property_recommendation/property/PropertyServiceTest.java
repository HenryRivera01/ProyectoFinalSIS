package com.juan.property.property_recommendation.property;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.location.Department;
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
import java.util.Optional;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PropertyServiceTest {

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

    // HAPPY PATH
    @Test
    public void findAllPropertiesSuccess(){
        //Given
        PropertySpecification spec = new PropertySpecification();

        when(propertyRepository.findAll(spec)).thenReturn(List.of(property));
        when(propertyMapper.propertyToDto(property)).thenReturn(propertyResponse);


        //when
        List<PropertyResponse> properties = propertyService.findAll(spec);


        //then
        assertThat(properties).isNotNull();
        assertThat(properties.size()).isEqualTo(1);
    }

    @Test
    public void registerPropertySuccess(){
         //Given
        when(cityRepository.findById(propertyRequest.getCityId())).thenReturn(Optional.of(city));
        when(propertyMapper.dtoToProperty(propertyRequest)).thenReturn(property);
        when(propertyRepository.save(property)).thenReturn(property);
        when(propertyMapper.propertyToDto(property)).thenReturn(propertyResponse);

        //when

        PropertyResponse propertyResponse = propertyService.register(propertyRequest, user);

        //then
        assertThat(propertyResponse).isNotNull();
        assertEquals(100100200L, propertyResponse.getRegistryNumber()); assertThat(propertyResponse).isNotNull();
        assertEquals(100100200L, propertyResponse.getRegistryNumber());
    }


    //EDGE CASES
    @Test
    public void registerPropertyWithUnexistedCity(){

        // Given
        when(cityRepository.findById(propertyRequest.getCityId())).thenReturn(Optional.empty());
        // When
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            propertyService.register(propertyRequest, user);
        });
        // Then
        assertEquals("The city  does not exist", exception.getMessage());
        verify(cityRepository, times(1)).findById(propertyRequest.getCityId());
        verify(propertyRepository, never()).save(any());

    }

    @Test
    public void registerPropertyThatAlreadyExists(){

        // Given
        when(propertyRepository.findByRegistryNumber(propertyRequest.getRegistryNumber())).thenReturn(Optional.of(property));
        // When
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            propertyService.register(propertyRequest, user);
        });
        // Then
        assertEquals("The property already exists", exception.getMessage());
        verify(propertyRepository, times(1)).findByRegistryNumber(propertyRequest.getRegistryNumber());
        verify(propertyRepository, never()).save(any());

    }





}

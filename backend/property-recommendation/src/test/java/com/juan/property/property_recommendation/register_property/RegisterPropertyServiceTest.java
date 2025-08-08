package com.juan.property.property_recommendation.register_property;

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
import java.util.Optional;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class RegisterPropertyServiceTest {

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

    // HAPPY PATH

    @Test
    public void testRegisterPropertySuccess(){
        when(cityRepository.findById(propertyRequest.getCityId())).thenReturn(Optional.of(city));
        when(propertyMapper.dtoToProperty(propertyRequest)).thenReturn(property);
        when(propertyRepository.save(property)).thenReturn(property);
        when(propertyMapper.propertyToDto(property)).thenReturn(propertyResponse);

        PropertyResponse propertyResponse = propertyService.register(propertyRequest, user);

        assertEquals(100100200L, propertyResponse.getRegistryNumber()); assertThat(propertyResponse).isNotNull();

    }


    //EDGE CASES
    @Test
    public void testRegisterPropertyWithUnexistedCity(){

        when(cityRepository.findById(propertyRequest.getCityId())).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            propertyService.register(propertyRequest, user);
        });
        assertEquals("The city  does not exist", exception.getMessage());
        verify(cityRepository, times(1)).findById(propertyRequest.getCityId());
        verify(propertyRepository, never()).save(any());

    }

    @Test
    public void testRegisterPropertyThatAlreadyExists(){

        when(propertyRepository.findByRegistryNumber(propertyRequest.getRegistryNumber())).thenReturn(Optional.of(property));
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            propertyService.register(propertyRequest, user);
        });
        assertEquals("The property already exists", exception.getMessage());
        verify(propertyRepository, times(1)).findByRegistryNumber(propertyRequest.getRegistryNumber());
        verify(propertyRepository, never()).save(any());

    }

    @Test
    public void testInvalidCityId(){
        propertyRequest.setCityId(-1);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The city id is not valid", exception.getMessage());
    }

    @Test
    public void testInvalidRegistryNumber() {
        propertyRequest.setRegistryNumber(123L);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The registry number is not valid", exception.getMessage());
    }


    @Test
    public void testInvalidAddress() {
        propertyRequest.setAddress("");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The address is not valid", exception.getMessage());
    }

    @Test
    public void testInvalidArea() {
        propertyRequest.setArea(-23.0);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The area is not valid", exception.getMessage());
    }

    @Test
    public void testInvalidPrice() {
        propertyRequest.setPrice(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The price is not valid", exception.getMessage());
    }

    @Test
    public void testInvalidImageList() {
        propertyRequest.setImages(List.of("img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The image list is not valid", exception.getMessage());
    }

    @Test
    public void testInvalidNumberOfBathrooms() {
        propertyRequest.setNumberOfBathrooms(-20);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The number of bathrooms is not valid", exception.getMessage());
    }

    @Test
    public void testInvalidNumberOfBedrooms() {
        propertyRequest.setNumberOfBedrooms(-20);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            propertyService.register(propertyRequest, user);
        });

        assertEquals("The number of bedrooms is not valid", exception.getMessage());
    }
}

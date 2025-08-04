package com.juan.property.property_recommendation.property;


import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;

import static com.juan.property.property_recommendation.property.OperationType.*;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class PropertyRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    private Property property;
    private Property property2;
    private City city;
    private User user;

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
                .name("Bogotá")
                .build();

        property = Property.builder()
                .registryNumber(100100200L)
                .operationType(SELL)
                .address("Calle 123 #45-67")
                .price(BigDecimal.valueOf(350000000.0))
                .area(120.0)
                .images(List.of("img1.jpg", "img2.jpg"))
                .numberOfBathrooms(2)
                .numberOfBedrooms(3)
                .propertyType(HOUSE)
                .city(city)
                .user(user)
                .build();
        property2 = Property.builder()
                .registryNumber(200100200L)
                .operationType(LEASE)
                .address("Calle 123 #45-67")
                .price(BigDecimal.valueOf(250_000_000.0))
                .area(120.0)
                .images(List.of("img4.jpg", "img5.jpg"))
                .numberOfBathrooms(3)
                .numberOfBedrooms(2)
                .propertyType(HOUSE)
                .city(city)
                .user(user)
                .build();
    }


    @Test
    public void saveProperty(){
        //given -> A created property
        //when
        Property savedProperty = propertyRepository.save(property);
        //then
        assertThat(savedProperty).isNotNull();
        assertThat(savedProperty.getId()).isGreaterThan(0);
    }

    @Test
    public void findAllExistingProperties(){
        //Given -> Two saved properties, a saved city, and a saved user

        cityRepository.save(city);
        userRepository.save(user);

        propertyRepository.save(property);
        propertyRepository.save(property2);
        //When -> I search them
        List<Property> properties = propertyRepository.findAll();
        //Then
        assertThat(properties).isNotNull();
        assertThat(properties.size()).isEqualTo(2);
        assertThat(properties.contains(property)).isTrue();
        assertThat(properties.contains(property2)).isTrue();
    }


}

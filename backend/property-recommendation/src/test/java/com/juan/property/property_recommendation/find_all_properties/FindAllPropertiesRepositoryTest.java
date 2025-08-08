package com.juan.property.property_recommendation.find_all_properties;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.property.Property;
import com.juan.property.property_recommendation.property.PropertyRepository;
import com.juan.property.property_recommendation.property.PropertySpecification;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.util.List;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class FindAllPropertiesRepositoryTest {
    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CityRepository cityRepository;

    private City city;
    private User user;
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
                .name("Bogota")
                .build();

        property = Property.builder()
                .registryNumber(1234567890L)
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
    @Test // nova
    public void testFindAllProperties() {
        User savedUser = testEntityManager.persistFlushFind(user);
        City savedCity = testEntityManager.persistFlushFind(city);

        Property savedProperty = testEntityManager.persistFlushFind(property);

        PropertySpecification spec = new PropertySpecification(); // sin filtros
        List<Property> found = propertyRepository.findAll(spec);

        assertFalse(found.isEmpty());
        assertTrue(found.stream().anyMatch(p -> p.getId().equals(savedProperty.getId())));

    }

    @Test // nova
    public void testFilterProperties() {
        User savedUser = testEntityManager.persistFlushFind(user);
        City savedCity = testEntityManager.persistFlushFind(city);

        Property savedProperty = testEntityManager.persistFlushFind(property);

        PropertySpecification spec = new PropertySpecification();
        spec.setNumberOfBathrooms(20);
        List<Property> found = propertyRepository.findAll(spec);

        assertTrue(found.isEmpty());

    }
}

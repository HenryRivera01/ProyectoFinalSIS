package com.juan.property.property_recommendation.register_property;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.Property;
import com.juan.property.property_recommendation.property.PropertyRepository;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.checkerframework.checker.units.qual.A;
import org.hibernate.MappingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
public class RegisterPropertyRepositoryTest {

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
//    @Test // nova
//    public void testFindPropertyByRegistryNumber() {
//        testEntityManager.persist(user);
//        testEntityManager.persist(city);
//        testEntityManager.persist(property);
//
//        Optional<Property> found  = propertyRepository.findByRegistryNumber(property.getRegistryNumber());
//
//        found.ifPresent(value -> assertEquals(value.getRegistryNumber(), property.getRegistryNumber()));
//
//    }
    @Test
    public void testRegisterProperty() {
        userRepository.save(user);
        cityRepository.save(city);

        Property saved = propertyRepository.save(property);

        assertEquals(testEntityManager.find(Property.class, property.getId()),saved);
    }


    @Test
    public void testRegisterPropertyWithNonExistentCity() {
        // Simula usuario válido
        userRepository.save(property.getUser());

        // Deja una ciudad inválida o inexistente
        property.setCity(null); // O usa una ciudad que no existe en la BD

        property.setRegistryNumber(1234567890L);

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    public void testRegisterPropertyWithNonExistentUser() {
        // Simula usuario válido
        cityRepository.save(property.getCity());

        // Deja una ciudad inválida o inexistente
        property.setCity(null); // O usa una ciudad que no existe en la BD

        property.setRegistryNumber(1234567890L);

        assertThrows(InvalidDataAccessApiUsageException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }



    @Test
    public void testRegistryPropertyInvalidRegistryNumber() {
        userRepository.save(user);
        cityRepository.save(city);
        property.setRegistryNumber(12345678901L);

        assertThrows(Exception.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    public void testInvalidOperationType(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setOperationType(null);

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }

    @Test
    public void testInvalidPropertyType(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setPropertyType(null);

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }

    @Test
    public void testInvalidAddress(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setAddress("Calle  123 #45-67");

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }

    @Test
    public void testInvalidPrice(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setPrice(BigDecimal.valueOf(123));

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }
    @Test
    public void testInvalidArea(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setArea(-23.0);

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }


    @Test
    public void testInvalidImageList(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setImages(List.of("img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"));

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }

    @Test
    public void testInvalidNumberOfBathrooms(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setNumberOfBathrooms(-1);

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }
    @Test
    public void testInvalidNumberOfBedrooms(){
        userRepository.save(user);
        cityRepository.save(city);
        property.setNumberOfBedrooms(-3);

        assertThrows(DataIntegrityViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });

    }


}

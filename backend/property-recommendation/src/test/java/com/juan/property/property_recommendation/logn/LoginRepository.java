package com.juan.property.property_recommendation.logn;


import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class LoginRepository{


    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setUp() {
        user = User.builder()
                .documentType(DocumentType.CC)
                .documentNumber(1001234357L)
                .firstName("Juan")
                .lastName("Rodríguez")
                .email("juan@example.com")
                .phoneNumber(3123456789L)
                .password("password123")
                .build();
    }


    @Test
    @DisplayName("Should find user by email")
    void testFindByEmail() {


        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("juan@example.com");

        assertThat(found).isPresent();
    }

    @Test
    void testFindByInvalidEmail() {
        Optional<User> found = userRepository.findByEmail("noexist@example.com");

        assertThat(found).isEmpty();
    }


}

package com.juan.property.property_recommendation.register_user;

import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
public class
RegisterUserRepository {
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
    public void testRegisterUser_HappyPath() {
        User savedUser = userRepository.save(user);
        User foundUser = testEntityManager.find(User.class, savedUser.getId());
        assertEquals(user.getDocumentNumber(), foundUser.getDocumentNumber());
    }

    @Test
    public void testRegisterUser_DuplicateDocumentNumber() {
        userRepository.save(user);

        User duplicate = User.builder()
                .documentType(DocumentType.CC)
                .documentNumber(1001234357L) // misma cédula
                .firstName("Pedro")
                .lastName("Gómez")
                .email("pedro@example.com")
                .phoneNumber(3111111111L)
                .password("otherpass")
                .build();

        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(duplicate);
        });
    }

    @Test
    public void testRegisterUser_NullFields() {
        User nullUser = User.builder().build();
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(nullUser);
        });
    }

    @Test
    public void testRegisterUserWithDuplicateEmail() {
        userRepository.save(user);

        User duplicateEmailUser = User.builder()
                .documentType(DocumentType.CE)
                .documentNumber(2003456789L)
                .firstName("Ana")
                .lastName("Gomez")
                .email(user.getEmail()) // MISMO EMAIL que el primer usuario
                .phoneNumber(3201234567L)
                .password("securePassword")
                .build();

        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(duplicateEmailUser);
        });
    }
}

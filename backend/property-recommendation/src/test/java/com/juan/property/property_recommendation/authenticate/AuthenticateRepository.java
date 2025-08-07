package com.juan.property.property_recommendation.authenticate;


import com.juan.property.property_recommendation.auth.SessionToken;
import com.juan.property.property_recommendation.auth.SessionTokenRepository;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class AuthenticateRepository {
    @Autowired
    private SessionTokenRepository sessionTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("findByToken - should return session token with user when token exists")
    void findByToken_shouldReturnSessionToken() {
        // Arrange
        User user = User.builder()
                .email("juan@example.com")
                .firstName("Juan")
                .lastName("Rodríguez")
                .documentType(null)
                .documentNumber(123456789L)
                .phoneNumber(3100000000L)
                .password("securePassword")
                .build();

        userRepository.save(user);

        SessionToken token = SessionToken.builder()
                .token("test-token-123")
                .user(user)
                .build();

        sessionTokenRepository.save(token);

        // Act
        Optional<SessionToken> foundToken = sessionTokenRepository.findByToken("test-token-123");

        // Assert
        assertThat(foundToken).isPresent();
        assertThat(foundToken.get().getToken()).isEqualTo("test-token-123");
        assertThat(foundToken.get().getUser().getEmail()).isEqualTo("juan@example.com");
    }

    @Test
    @DisplayName("findByToken - should return empty when token does not exist")
    void findByToken_shouldReturnEmpty_whenTokenNotFound() {
        Optional<SessionToken> foundToken = sessionTokenRepository.findByToken("non-existent-token");

        assertThat(foundToken).isNotPresent();
    }
}

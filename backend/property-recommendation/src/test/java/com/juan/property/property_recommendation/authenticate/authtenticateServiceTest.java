package com.juan.property.property_recommendation.authenticate;

import com.juan.property.property_recommendation.auth.SessionToken;
import com.juan.property.property_recommendation.auth.SessionTokenRepository;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class authtenticateServiceTest {

    @Mock
    private SessionTokenRepository sessionTokenRepository;

    @InjectMocks
    private AuthService authService;

    private User user;
    private SessionToken sessionToken;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1)
                .email("juan@example.com")
                .build();

        sessionToken = SessionToken.builder()
                .token("valid-token-123")
                .user(user)
                .build();
    }

    // ✅ HAPPY PATH
    @Test
    void authenticateWithValidToken_shouldReturnUser() {
        when(sessionTokenRepository.findByToken("valid-token-123"))
                .thenReturn(Optional.of(sessionToken));

        Optional<User> result = authService.authenticate("valid-token-123");

        assertTrue(result.isPresent());
        assertEquals("juan@example.com", result.get().getEmail());
    }

    // ❌ EDGE CASES

    @Test
    void testAuthenticateWithNullToken() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.authenticate(null);
        });

        assertEquals("Token must not be null or blank.", exception.getMessage());
    }

    @Test
    void testAuthenticateWithBlankToken() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.authenticate("   ");
        });

        assertEquals("Token must not be null or blank.", exception.getMessage());
    }

    @Test
    void estAuthenticateWithNonExistentToken() {
        when(sessionTokenRepository.findByToken("non-existent-token"))
                .thenReturn(Optional.empty());

        Optional<User> result = authService.authenticate("non-existent-token");

        assertFalse(result.isPresent());
    }
}

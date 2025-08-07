package com.juan.property.property_recommendation.logn;

import com.juan.property.property_recommendation.auth.SessionToken;
import com.juan.property.property_recommendation.auth.SessionTokenRepository;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Base64;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTest {


    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionTokenRepository sessionTokenRepository;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    public void setup() {
        user = User.builder()
                .documentType(DocumentType.CC)
                .documentNumber(123456789L)
                .firstName("Juan")
                .lastName("Pérez")
                .email("juan@example.com")
                .phoneNumber(3001234567L)
                .password("123456") // Simula la contraseña ya encriptada
                .build();
    }

    @Test
    public void testLoginWithNullEmail_shouldThrowException() {
        AuthRequest request = new AuthRequest(null, "123456");

        Exception ex = assertThrows(IllegalArgumentException.class, () -> authService.login(request));

        assertEquals("Email is required", ex.getMessage());
    }

    @Test
    public void testLoginWithEmptyEmail_shouldThrowException() {
        AuthRequest request = new AuthRequest("   ", "123456");

        Exception ex = assertThrows(IllegalArgumentException.class, () -> authService.login(request));

        assertEquals("Email is required", ex.getMessage());
    }

    @Test
    public void testLoginWithInvalidEmailFormat_shouldThrowException() {
        AuthRequest request = new AuthRequest("invalid-email", "123456");

        Exception ex = assertThrows(IllegalArgumentException.class, () -> authService.login(request));

        assertEquals("Invalid email format", ex.getMessage());
    }

    @Test
    public void testLoginWithNonExistentEmail_shouldThrowException() {
        AuthRequest request = new AuthRequest("noexiste@example.com", "123456");

        when(userRepository.findByEmail("noexiste@example.com")).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () -> authService.login(request));

        assertEquals("Invalid credentials", ex.getMessage());
    }

    @Test
    public void testLoginWithNullPassword_shouldThrowException() {
        AuthRequest request = new AuthRequest("juan@example.com", null);

        Exception ex = assertThrows(IllegalArgumentException.class, () -> authService.login(request));

        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    public void testLoginWithEmptyPassword_shouldThrowException() {
        AuthRequest request = new AuthRequest("juan@example.com", "   ");

        Exception ex = assertThrows(IllegalArgumentException.class, () -> authService.login(request));

        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    public void testLoginWithIncorrectPassword_shouldThrowException() {
        AuthRequest request = new AuthRequest("juan@example.com", "wrongpassword");

        when(userRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(user));

        Exception ex = assertThrows(RuntimeException.class, () -> authService.login(request));

        assertEquals("Invalid credentials", ex.getMessage());
    }

    @Test
    void testLoginWithCorrectCredentials_shouldReturnToken() {
        // Arrange
        String email = "juan@example.com";
        String rawPassword = "123456";
        String encryptedPassword = Base64.getEncoder().encodeToString(rawPassword.getBytes());

        User user = new User();
        user.setEmail(email);
        user.setPassword(encryptedPassword);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(sessionTokenRepository.save(any(SessionToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AuthRequest request = new AuthRequest(email, rawPassword);

        // Act
        String token = authService.login(request);

        // Assert
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        verify(userRepository).findByEmail(email);
        verify(sessionTokenRepository).save(any(SessionToken.class));
    }


}

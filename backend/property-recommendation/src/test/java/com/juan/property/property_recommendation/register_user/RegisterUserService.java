package com.juan.property.property_recommendation.register_user;


import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RegisterUserService {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRequest;

    @BeforeEach
    public void setUp() {
        validRequest = RegisterRequest.builder()
                .email("juan@email.com")
                .documentType(DocumentType.CC)
                .documentNumber(1234567890L)
                .firstName("Juan")
                .lastName("Pérez")
                .phoneNumber(3001234567L)
                .password("securePassword123")
                .build();
    }

    // ✅ HAPPY PATH
    @Test
    public void registerUserSuccessfully() {
        when(userRepository.findByEmail(validRequest.getEmail())).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> authService.register(validRequest));

       // verify(userRepository, times(1)).save(any(User.class));
    }

    // ❌ EDGE CASES

    @Test
    public void registerWithExistingEmailShouldThrowException() {
        when(userRepository.findByEmail(validRequest.getEmail())).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.register(validRequest));
        assertEquals("This email is already registered", exception.getMessage());

       // verify(userRepository, never()).save(any());
    }

    @Test
    public void registerWithNullFieldsShouldThrowException() {
        validRequest.setFirstName(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("All fields are required and must not be null or blank.", exception.getMessage());

        //verify(userRepository, never()).save(any());
    }

    @Test
    public void registerWithInvalidEmailFormatShouldThrowException() {
        validRequest.setEmail("invalid-email");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("Invalid email format.", exception.getMessage());
    }

    @Test
    public void registerWithExistingDocumentNumberShouldThrowException() {
        validRequest.setDocumentNumber(1234567890L);

        // Simula que ya existe un usuario con esa cédula
        when(userRepository.findByDocumentNumber(validRequest.getDocumentNumber()))
                .thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(validRequest);
        });

        assertEquals("This document number is already registered", exception.getMessage());
    }

    @Test
    public void registerWithInvalidDocumentNumberShouldThrowException() {
        validRequest.setDocumentNumber(12345L); // menos de 10 dígitos

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("Document number must be exactly 10 digits and positive.", exception.getMessage());
    }

    @Test
    public void registerWithNegativeDocumentNumberShouldThrowException() {
        validRequest.setDocumentNumber(-1234567890L);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("Document number must be exactly 10 digits and positive.", exception.getMessage());
    }

    @Test
    public void registerWithInvalidPhoneNumberShouldThrowException() {
        validRequest.setPhoneNumber(123L);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("Phone number must be exactly 10 digits and positive.", exception.getMessage());
    }

    @Test
    public void registerWithBlankPasswordShouldThrowException() {
        validRequest.setPassword("  ");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("All fields are required and must not be null or blank.", exception.getMessage());
    }
}

package com.juan.property.property_recommendation.register_user;


import com.juan.property.property_recommendation.auth.AuthMapper;
import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
import com.juan.property.property_recommendation.auth.dto.RegisterResponse;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.user.UserRepository;
import jakarta.persistence.EntityExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RegisterUserService {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;


    @Mock
    private AuthMapper authMapper;

    private RegisterRequest validRequest;
    private User user;
    private RegisterResponse response;

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
        user = User.builder()
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
    void registerUserSuccessfully_minimal() {
        when(userRepository.findByDocumentNumber(validRequest.getDocumentNumber()))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail(validRequest.getEmail()))
                .thenReturn(Optional.empty());

        when(userRepository.save(any(User.class))).thenReturn(user);

        when(authMapper.registerUserToDto(any(User.class))).thenReturn(response);

        RegisterResponse actualResponse = authService.register(validRequest);

        assertEquals(response, actualResponse);
    }
    // EDGE CASES

    @Test
    public void registerWithExistingEmailShouldThrowException() {
        when(userRepository.findByEmail(validRequest.getEmail())).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(EntityExistsException.class, () -> authService.register(validRequest));
        assertEquals("This email is already registered", exception.getMessage());

    }

    @Test
    public void registerWithNullFieldsShouldThrowException() {
        validRequest.setFirstName(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(validRequest));
        assertEquals("All fields are required and must not be null or blank.", exception.getMessage());

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

        when(userRepository.findByDocumentNumber(validRequest.getDocumentNumber()))
                .thenReturn(Optional.of(new User()));

        EntityExistsException exception = assertThrows(EntityExistsException.class, () -> {
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

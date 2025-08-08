package com.juan.property.property_recommendation.auth.service;

import com.juan.property.property_recommendation.auth.AuthMapper;
import com.juan.property.property_recommendation.auth.SessionToken;
import com.juan.property.property_recommendation.auth.SessionTokenRepository;
import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
import com.juan.property.property_recommendation.auth.dto.RegisterResponse;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.user.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements  IAuthService {

    private final UserRepository userRepository;
    private final SessionTokenRepository sessionTokenRepository;
    private final AuthMapper authMapper;

    @Override
    public RegisterResponse register(RegisterRequest registerRequest) {
        // Validar que ningún campo requerido sea nulo o vacío
        if (registerRequest.getEmail() == null || registerRequest.getEmail().isBlank()
                || registerRequest.getDocumentType() == null
                || registerRequest.getDocumentNumber() == null
                || registerRequest.getFirstName() == null || registerRequest.getFirstName().isBlank()
                || registerRequest.getLastName() == null || registerRequest.getLastName().isBlank()
                || registerRequest.getPhoneNumber() == null
                || registerRequest.getPassword() == null || registerRequest.getPassword().isBlank()) {
            throw new IllegalArgumentException("All fields are required and must not be null or blank.");
        }

        // Validar numero de documento único
        if (userRepository.findByDocumentNumber(registerRequest.getDocumentNumber()).isPresent()) {
            throw new EntityExistsException("This document number is already registered");
        }

        // Validar email único
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new EntityExistsException("This email is already registered");
        }

        // Validar número de documento (10 dígitos positivos)
        String documentNumber = String.valueOf(registerRequest.getDocumentNumber());
        if (!documentNumber.matches("\\d{10}")) {
            throw new IllegalArgumentException("Document number must be exactly 10 digits and positive.");
        }

        // Validar formato de email
        String email = registerRequest.getEmail();
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        // Validar teléfono (10 dígitos positivos)
        String phoneNumber = String.valueOf(registerRequest.getPhoneNumber());
        if (!phoneNumber.matches("\\d{10}")) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits and positive.");
        }

        // Crear usuario
        User user = new User();
        user.setEmail(email);
        user.setDocumentType(registerRequest.getDocumentType());
        user.setDocumentNumber(registerRequest.getDocumentNumber());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setPassword(encrypt(registerRequest.getPassword()));

        userRepository.save(user);

        return authMapper.registerUserToDto(user);
    }


    @Override
    public String login(AuthRequest authRequest) {


        if (authRequest.getEmail() == null || authRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (!authRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (authRequest.getPassword() == null || authRequest.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }


        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Invalid credentials"));
        if(!user.getPassword().equals(encrypt(authRequest.getPassword()))) {
            throw new EntityNotFoundException("Invalid credentials");
        }




        String token = UUID.randomUUID().toString();
        SessionToken session = new SessionToken();
        session.setToken(token);
        session.setUser(user);
        session.setCreatedAt(LocalDateTime.now());
        sessionTokenRepository.save(session);
        return token;
    }

    @Override
    public Optional<User> authenticate(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token must not be null or blank.");
        }

        return sessionTokenRepository.findByToken(token).map(SessionToken::getUser);
    }


    private String encrypt(String input) {
        return Base64.getEncoder().encodeToString(input.getBytes());
    }
}

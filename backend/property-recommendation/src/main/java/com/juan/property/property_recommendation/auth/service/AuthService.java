package com.juan.property.property_recommendation.auth.service;

import com.juan.property.property_recommendation.auth.SessionToken;
import com.juan.property.property_recommendation.auth.SessionTokenRepository;
import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
import com.juan.property.property_recommendation.user.User;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.user.UserRepository;
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

    @Override
    public void register(RegisterRequest registerRequest) {
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("This email is already registered");
        }
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setDocumentType(registerRequest.getDocumentType());
        user.setDocumentNumber(registerRequest.getDocumentNumber());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setPassword(encrypt(registerRequest.getPassword()));
        userRepository.save(user);
    }

    @Override
    public String login(AuthRequest authRequest) {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if(!user.getPassword().equals(encrypt(authRequest.getPassword()))) {
            throw new RuntimeException("Invalid credentials");
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
        return sessionTokenRepository.findByToken(token).map(SessionToken::getUser);
    }

    private String encrypt(String input) {
        return Base64.getEncoder().encodeToString(input.getBytes());
    }
}

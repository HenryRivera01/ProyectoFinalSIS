package com.juan.property.property_recommendation.logn;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.auth.AuthController;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.auth.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post; // 👈 CORRECTO
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*; // 👈 para jsonPath, status, etc.

@WebMvcTest(AuthController.class)
public class LoginController {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /auth/login - should return token when request is valid")
    void loginWithValidCredentials_shouldReturnToken() throws Exception {
        AuthRequest request = new AuthRequest("juan@example.com", "123456");
        String token = "abc123xyz";

        Mockito.when(authService.login(any(AuthRequest.class)))
                .thenReturn(token);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token));
    }

    @Test
    @DisplayName("POST /auth/login - should return 400 when email is blank")
    void loginWithBlankEmail_shouldReturnBadRequest() throws Exception {
        AuthRequest request = new AuthRequest("   ", "123456");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /auth/login - should return 400 when email is invalid format")
    void loginWithInvalidEmail_shouldReturnBadRequest() throws Exception {
        AuthRequest request = new AuthRequest("not-an-email", "123456");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("The email format is invalid")));
    }

    @Test
    @DisplayName("POST /auth/login - should return 400 when password is blank")
    void loginWithBlankPassword_shouldReturnBadRequest() throws Exception {
        AuthRequest request = new AuthRequest("juan@example.com", "  ");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("The password must not be blank")));
    }
}

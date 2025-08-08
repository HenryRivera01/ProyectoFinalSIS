package com.juan.property.property_recommendation.register_property;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.auth.dto.AuthRequest;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.Property;
import com.juan.property.property_recommendation.property.PropertyController;
import com.juan.property.property_recommendation.property.dto.PropertyRequest;
import com.juan.property.property_recommendation.property.dto.PropertyResponse;
import com.juan.property.property_recommendation.property.service.PropertyService;
import com.juan.property.property_recommendation.user.DocumentType;
import com.juan.property.property_recommendation.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.juan.property.property_recommendation.property.OperationType.SELL;
import static com.juan.property.property_recommendation.property.PropertyType.HOUSE;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(PropertyController.class)
public class RegisterPropertyControllerTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    private AuthRequest validAuthRequest;
    private User user;

    @BeforeEach
    void setup() {
        user = User.builder()
                .documentType(DocumentType.CC)
                .documentNumber(123456789L)
                .firstName("Juan")
                .lastName("Pérez")
                .email("juan@example.com")
                .phoneNumber(3001234567L)
                .password("123456")
                .build();

        validAuthRequest = new AuthRequest("juan@example.com", "123456");
    }

    @Test
    void testLoginWithValidCredentials() throws Exception {
        // Given
        String token = UUID.randomUUID().toString();
        when(authService.login(any(AuthRequest.class))).thenReturn(token);

        String json = objectMapper.writeValueAsString(validAuthRequest);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isOk());
    }

    @Test
    void testLoginWithBlankEmail() throws Exception {
        validAuthRequest.setEmail(" ");
        String json = objectMapper.writeValueAsString(validAuthRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginWithInvalidEmailFormat() throws Exception {
        validAuthRequest.setEmail("invalid-email");
        String json = objectMapper.writeValueAsString(validAuthRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginWithBlankPassword() throws Exception {
        validAuthRequest.setPassword("   ");
        String json = objectMapper.writeValueAsString(validAuthRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginWithMissingEmail() throws Exception {
        AuthRequest invalidRequest = new AuthRequest(null, "123456");
        String json = objectMapper.writeValueAsString(invalidRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginWithMissingPassword() throws Exception {
        AuthRequest invalidRequest = new AuthRequest("juan@example.com", null);
        String json = objectMapper.writeValueAsString(invalidRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                )
                .andExpect(status().isBadRequest());
    }



}

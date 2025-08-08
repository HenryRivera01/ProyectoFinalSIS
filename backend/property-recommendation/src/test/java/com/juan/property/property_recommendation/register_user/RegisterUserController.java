package com.juan.property.property_recommendation.register_user;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.auth.AuthController;
import com.juan.property.property_recommendation.auth.dto.RegisterRequest;
import com.juan.property.property_recommendation.auth.service.AuthService;
import com.juan.property.property_recommendation.user.DocumentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class RegisterUserController {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setup() {
        validRequest = RegisterRequest.builder()
                .documentType(DocumentType.CC)
                .documentNumber(1234567890L)
                .firstName("Juan")
                .lastName("Pérez")
                .email("juan@example.com")
                .password("securepassword123")
                .phoneNumber(3131234567L)
                .build();
    }

    @Test
    void testRegisterUserSuccessfully() throws Exception {
        String json = objectMapper.writeValueAsString(validRequest);

        // No exception thrown means successful
        doNothing().when(authService).register(validRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }



    @Test
    void testRegisterUserWithInvalidEmail() throws Exception {
        validRequest.setEmail("invalid-email");
        String json = objectMapper.writeValueAsString(validRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUserWithShortDocumentNumber() throws Exception {
        validRequest.setDocumentNumber(123L); // menos de 10 dígitos
        String json = objectMapper.writeValueAsString(validRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUserWithBlankFirstName() throws Exception {
        validRequest.setFirstName(" ");
        String json = objectMapper.writeValueAsString(validRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUserWithNegativePhoneNumber() throws Exception {
        validRequest.setPhoneNumber(-3131234567L);
        String json = objectMapper.writeValueAsString(validRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUserWithNullFields() throws Exception {
        validRequest.setDocumentType(null);
        validRequest.setEmail(null);
        validRequest.setPassword(null);
        validRequest.setFirstName(null);
        validRequest.setLastName(null);
        validRequest.setPhoneNumber(null);
        validRequest.setDocumentNumber(null);

        String json = objectMapper.writeValueAsString(validRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}

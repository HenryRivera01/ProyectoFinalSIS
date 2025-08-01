package com.juan.property.property_recommendation.auth;


import com.juan.property.property_recommendation.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class SessionToken {
    @Id
    private String token;

    private LocalDateTime createdAt;

    @ManyToOne
    private User user;
}

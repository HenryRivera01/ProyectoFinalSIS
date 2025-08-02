package com.juan.property.property_recommendation.user;

import com.juan.property.property_recommendation.auth.SessionToken;
import com.juan.property.property_recommendation.property.Property;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "_user")
@Builder
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private DocumentType documentType;
    private Long documentNumber;
    private String firstName;
    private String lastName;
    private String email;
    private Long phoneNumber;
    private String password;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Property> properties;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    private List<SessionToken> sessionToken;
}

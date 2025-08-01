package com.juan.property.property_recommendation.location;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    public String name;

    @OneToMany( mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<City> cities;
}

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
    @GeneratedValue
    @Column(nullable = false)
    private Integer id;
    @Column(nullable = false)
    public String name;

    @OneToMany( mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<City> cities;
}

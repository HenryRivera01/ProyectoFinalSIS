package com.juan.property.property_recommendation.location;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.juan.property.property_recommendation.property.Property;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class City {
    @Id
    @GeneratedValue
    @Column(nullable = false)
    private Integer id;
    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Property> properties;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}

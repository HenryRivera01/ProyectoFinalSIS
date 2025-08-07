package com.juan.property.property_recommendation.property;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Check;

import java.math.BigDecimal;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Check(constraints = """
    length(cast(registry_number as text)) = 10 AND
    registry_number > 0 AND
    price > 0 AND
    area > 0 AND
    (number_of_bathrooms IS NULL OR number_of_bathrooms > 0) AND
    (number_of_bedrooms IS NULL OR number_of_bedrooms > 0) AND
    city_id > 0
""")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true, nullable = false)
    private Long registryNumber;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OperationType operationType;
    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    private BigDecimal price;
    private Double area;
    @Column(nullable = false)
    private List<String> images;
    private Integer numberOfBathrooms;
    private Integer numberOfBedrooms;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public PropertyType propertyType;

//parquadero?????
    //created at

    @ManyToOne()
    @JoinColumn(name="city_id", nullable = false)
    private City city;

    @ManyToOne()
    @JoinColumn(name = "owner_id", nullable = false)
    private User user;
}

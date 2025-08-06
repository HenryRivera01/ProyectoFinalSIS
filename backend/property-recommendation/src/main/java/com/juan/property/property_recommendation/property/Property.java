package com.juan.property.property_recommendation.property;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long registryNumber;
    @Enumerated(EnumType.STRING)
    private OperationType operationType;
    private String address;
    private BigDecimal price;
    private Double area;
    private List<String> images;
    private Integer numberOfBathrooms;
    private Integer numberOfBedrooms;
    @Enumerated(EnumType.STRING)
    public PropertyType propertyType;

//parquadero?????
    //created at

    @ManyToOne()
    @JoinColumn(name="city_id")
    private City city;

    @ManyToOne()
    @JoinColumn(name = "owner_id")
    private User user;
}

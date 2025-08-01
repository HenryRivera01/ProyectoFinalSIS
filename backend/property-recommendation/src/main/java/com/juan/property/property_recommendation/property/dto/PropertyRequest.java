package com.juan.property.property_recommendation.property.dto;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PropertyRequest {
    private Long registryNumber;
    private OperationType operationType;
    private String address;
    private Double price;
    private Double area;
    private String image;
    private Integer numberOfBathrooms;
    private Integer numberOfBedRooms;
    private Integer cityId;
    private Integer ownerId;
}

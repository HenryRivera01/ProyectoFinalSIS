package com.juan.property.property_recommendation.property.dto;

import com.juan.property.property_recommendation.property.OperationType;
import com.juan.property.property_recommendation.property.PropertyType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class PropertyRequest {

    @NotNull(message = "The registry number is required")
    @Positive(message = "The registry number must be grater than zero")
    @Digits(fraction = 0, integer = 10, message = "The registry number must be a valid whole number with up to 10 digits")
    private Long registryNumber;

    @NotNull(message = "The operation type is required")
    private OperationType operationType;

    @NotBlank(message = "The address must not be blank")
    private String address;

    @NotNull(message = "The price must is required")
    @Positive(message = "The price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "The area is required")
    @Positive(message = "The area must be greater than zero")
    private Double area;

    @NotEmpty(message = "The images list must not be empty")
    @Size(min = 1, max = 4, message = "The number of images must be between 1 and 4")
    private List<String> images;

    @Positive(message = "The number of bathrooms must be grater than zero")
    private Integer numberOfBathrooms;

    @Positive(message = "The number of bedrooms must be grater than zero")
    private Integer numberOfBedrooms;

    @NotNull( message = "The property type must not be blank")
    private PropertyType propertyType;

    @NotNull(message = "The city ID is required")
    @Positive(message = "The city id must be grated than zero" )
    private Integer cityId;


   public PropertyRequest(){
       if(registryNumber != null){
           if (String.valueOf(this.registryNumber).length() != 10) {
               throw new IllegalArgumentException("The registry number must have exactly 10 digits");
           }
       }
   }

}

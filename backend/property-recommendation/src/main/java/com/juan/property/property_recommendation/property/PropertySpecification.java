package com.juan.property.property_recommendation.property;

import com.juan.property.property_recommendation.location.City;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class PropertySpecification  implements Specification<Property> {

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minArea;
    private Double maxArea;
    private Integer numberOfBathrooms;
    private Integer numberOfBedrooms;
    private String operationType;
    private String propertyType;
    private Integer cityId;



    @Override
    public jakarta.persistence.criteria.Predicate toPredicate(Root<Property> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        List<Predicate> predicates = new ArrayList<>();

        if(minPrice != null && !minPrice.equals(BigDecimal.ZERO)) {
            Predicate priceGreaterThanEqualPredicate = criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            predicates.add(priceGreaterThanEqualPredicate);
        }
        if(maxPrice != null && !maxPrice.equals(BigDecimal.ZERO)) {
            Predicate priceLessThanEqualPredicate = criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            predicates.add(priceLessThanEqualPredicate);
        }
        if(maxArea != null  && maxArea != 0 ){
            Predicate areaGreaterThanEqualPredicate = criteriaBuilder.greaterThanOrEqualTo(root.get("area"), minArea);
            predicates.add(areaGreaterThanEqualPredicate);
        }
        if(minArea != null) {
            Predicate areaLessThanEqualPredicate = criteriaBuilder.lessThanOrEqualTo(root.get("area"), maxArea);
            predicates.add(areaLessThanEqualPredicate);
        }
        if(numberOfBathrooms != null) {
            Predicate bathRoomsEqualPredicate = criteriaBuilder.equal(root.get("numberOfBathrooms"), numberOfBathrooms);
            predicates.add(bathRoomsEqualPredicate);

        }
        if(numberOfBedrooms != null) {
            Predicate bedroomsEqualPredicate = criteriaBuilder.equal(root.get("numberOfBedRooms"), numberOfBathrooms);
            predicates.add(bedroomsEqualPredicate);

        }

        Join<Property, City> propertyCityJoin = root.join("city", JoinType.INNER);
       // if(StringUtils.hasText(city)) {
        if(cityId != null && cityId != 0) {
           // Expression<String> cityNameToLowerCase = criteriaBuilder.upper(propertyCityJoin.get("name"));
         //   Predicate cityNameLikePredicate = criteriaBuilder.like(cityNameToLowerCase, "%".concat(cityId.toLowerCase()).concat("%"));
            Predicate cityNameLikePredicate = criteriaBuilder.equal(root.get("id"), cityId);
            predicates.add(cityNameLikePredicate);

        }
        if(StringUtils.hasText(operationType)){
            Expression<String> operationTypeToUpperCase = criteriaBuilder.upper(root.get("operationType")); //Este es el root   property.operationType
            Predicate operationTypeLikePredicate = criteriaBuilder.like(operationTypeToUpperCase, "%".concat(operationType.toUpperCase()).concat("%"));
            predicates.add(operationTypeLikePredicate);
        }
        if(StringUtils.hasText(propertyType)){
            Expression<String> propertyTypeToUpperCase = criteriaBuilder.upper(root.get("propertyType"));
            Predicate operationTypeLikePredicate = criteriaBuilder.like(propertyTypeToUpperCase, "%".concat(propertyType.toUpperCase()).concat("%"));
            predicates.add(operationTypeLikePredicate);
        }


        return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));




    }
}

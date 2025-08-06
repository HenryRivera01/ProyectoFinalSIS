package com.juan.property.property_recommendation.property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository  extends JpaRepository<Property,Integer>, JpaSpecificationExecutor<Property> {

    Optional<Property> findByRegistryNumber(Long registryNumber);
}

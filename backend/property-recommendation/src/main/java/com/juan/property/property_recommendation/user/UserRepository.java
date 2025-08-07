package com.juan.property.property_recommendation.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {

    Optional<User> findByEmail(String username);

    Optional<User> findByDocumentNumber(Long documentNumber);
}

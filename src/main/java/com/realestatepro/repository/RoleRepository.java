package com.realestatepro.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Role;
import com.realestatepro.enums.RoleType;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {

    /**
     * Find role by role type
     */
    Optional<Role> findByRoleName(RoleType roleName);

    /**
     * Check whether role exists
     */
    boolean existsByRoleName(RoleType roleName);

}
package com.realestatepro.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Role;
import com.realestatepro.enums.RoleType;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {

    Optional<Role> findByRoleName(RoleType roleName);

    boolean existsByRoleName(RoleType roleName);

}
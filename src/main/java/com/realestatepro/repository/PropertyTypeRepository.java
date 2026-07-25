package com.realestatepro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.PropertyType;

@Repository
public interface PropertyTypeRepository 
        extends MongoRepository<PropertyType, String> {


    Optional<PropertyType> findByTypeNameIgnoreCase(String typeName);


    boolean existsByTypeNameIgnoreCaseAndActiveTrue(String typeName);


    List<PropertyType> findByActiveTrue();

}
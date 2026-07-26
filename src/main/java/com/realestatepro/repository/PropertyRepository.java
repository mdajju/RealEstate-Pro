package com.realestatepro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Property;


@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {


    Optional<Property> findByTitle(String title);


    List<Property> findByCityId(String cityId);


    List<Property> findByPropertyTypeId(String propertyTypeId);


    List<Property> findByOwnerId(String ownerId);


    List<Property> findByAgentId(String agentId);


    List<Property> findByActiveTrue();


    boolean existsByTitle(String title);

}
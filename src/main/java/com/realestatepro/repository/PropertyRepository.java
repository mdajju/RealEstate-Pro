package com.realestatepro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Property;
import com.realestatepro.enums.PropertyStatus;


@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {


    Optional<Property> findByTitle(String title);


    List<Property> findByCityId(String cityId);


    List<Property> findByPropertyTypeId(String propertyTypeId);


    List<Property> findByOwnerId(String ownerId);


    List<Property> findByAgentId(String agentId);


    List<Property> findByActiveTrue();
    
    
    List<Property> findByStatus(PropertyStatus status);


    boolean existsByTitle(String title);
    
    long countByActiveTrue();

    long countByStatus(PropertyStatus status);

    long countByOwnerId(String ownerId);

    long countByOwnerIdAndStatus(
            String ownerId,
            PropertyStatus status
    );
    
    long countByOwnerIdAndActiveTrue(String ownerId);

    long countByOwnerIdAndStatusAndActiveTrue(
            String ownerId,
            PropertyStatus status
    );
    
    List<Property> findByOwnerIdAndActiveTrue(String ownerId);
    
    

}
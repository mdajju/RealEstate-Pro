package com.realestatepro.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.PropertyImage;



@Repository
public interface PropertyImageRepository 
        extends MongoRepository<PropertyImage, String> {


    /*
     * Get all images of a property
     */
    List<PropertyImage> findByPropertyIdAndActiveTrue(String propertyId);



    /*
     * Delete images when property removed
     */
    List<PropertyImage> findByPropertyId(String propertyId);

}
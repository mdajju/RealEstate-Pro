package com.realestatepro.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Favourite;



@Repository
public interface FavouriteRepository 
        extends MongoRepository<Favourite, String> {



    /*
     * Check duplicate favourite
     */
    boolean existsByUserIdAndPropertyIdAndActiveTrue(
            String userId,
            String propertyId
    );



    /*
     * Get user favourites
     */
    List<Favourite> findByUserIdAndActiveTrue(
            String userId
    );



    /*
     * Find specific favourite
     */
    Optional<Favourite> findByUserIdAndPropertyId(
            String userId,
            String propertyId
    );


    
    long countByUserIdAndActiveTrue(
            String userId
    );

    long countByActiveTrue();
    
    Optional<Favourite> findByUserIdAndPropertyIdAndActiveTrue(
            String userId,
            String propertyId
    );

}
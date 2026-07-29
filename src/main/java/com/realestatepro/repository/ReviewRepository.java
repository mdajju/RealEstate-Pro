package com.realestatepro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    /*
     * Get reviews of a property
     */
    List<Review> findByPropertyIdAndActiveTrue(
            String propertyId
    );

    /*
     * Check duplicate review
     */
    boolean existsByUserIdAndPropertyIdAndActiveTrue(
            String userId,
            String propertyId
    );

    /*
     * Find user review for property
     */
    Optional<Review> findByUserIdAndPropertyId(
            String userId,
            String propertyId
    );

    /*
     * Get user reviews
     */
    List<Review> findByUserIdAndActiveTrue(
            String userId
    );

    /*
     * Total active reviews
     */
    long countByActiveTrue();

    /*
     * User review count
     */
    long countByUserIdAndActiveTrue(
            String userId
    );

}
package com.realestatepro.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.PropertyBooking;
import com.realestatepro.enums.BookingStatus;



@Repository
public interface PropertyBookingRepository 
        extends MongoRepository<PropertyBooking, String> {



    /*
     * Get all bookings of a customer
     */
    List<PropertyBooking> findByCustomerIdAndActiveTrue(String customerId);



    /*
     * Get all bookings received by owner
     */
    List<PropertyBooking> findByOwnerIdAndActiveTrue(String ownerId);



    /*
     * Get bookings for a property
     */
    List<PropertyBooking> findByPropertyIdAndActiveTrue(String propertyId);



    /*
     * Check duplicate booking
     */
    Optional<PropertyBooking> findByPropertyIdAndCustomerIdAndActiveTrue(
            String propertyId,
            String customerId
    );



    /*
     * Filter by booking status
     */
    List<PropertyBooking> findByStatusAndActiveTrue(
            BookingStatus status
    );



    /*
     * Admin - all active bookings
     */
    List<PropertyBooking> findByActiveTrue();
    
    
    long countByActiveTrue();

    long countByStatusAndActiveTrue(
            BookingStatus status
    );

    long countByOwnerIdAndActiveTrue(
            String ownerId
    );

    long countByOwnerIdAndStatusAndActiveTrue(
            String ownerId,
            BookingStatus status
    );

    long countByCustomerIdAndActiveTrue(
            String customerId
    );

    long countByCustomerIdAndStatusAndActiveTrue(
            String customerId,
            BookingStatus status
    );
    
    

}
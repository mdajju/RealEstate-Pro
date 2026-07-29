package com.realestatepro.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Payment;
import com.realestatepro.enums.PaymentStatus;



@Repository
public interface PaymentRepository 
        extends MongoRepository<Payment, String> {



    /*
     * Get payments by customer
     */
    List<Payment> findByCustomerIdAndActiveTrue(
            String customerId
    );



    /*
     * Get payments by owner
     */
    List<Payment> findByOwnerIdAndActiveTrue(
            String ownerId
    );



    /*
     * Get payment by booking
     */
    List<Payment> findByBookingIdAndActiveTrue(
            String bookingId
    );



    /*
     * Filter by payment status
     */
    List<Payment> findByStatusAndActiveTrue(
            PaymentStatus status
    );



    /*
     * Check duplicate payment
     */
    boolean existsByBookingIdAndStatusAndActiveTrue(
            String bookingId,
            PaymentStatus status
    );



    /*
     * Dashboard counts
     */
    long countByActiveTrue();



    long countByStatusAndActiveTrue(
            PaymentStatus status
    );



    long countByCustomerIdAndActiveTrue(
            String customerId
    );



    long countByOwnerIdAndActiveTrue(
            String ownerId
    );

}
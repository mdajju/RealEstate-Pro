package com.realestatepro.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Notification;



@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {



    /*
     * Fetch all active notifications of a user
     */
    List<Notification> findByUserIdAndActiveTrue(String userId);



    /*
     * Fetch unread notifications of a user
     */
    List<Notification> findByUserIdAndReadFalseAndActiveTrue(String userId);



    /*
     * Count unread notifications
     */
    long countByUserIdAndReadFalseAndActiveTrue(String userId);



    /*
     * Fetch notifications based on reference entity
     *
     * Example:
     * Booking ID
     * Property ID
     * Inquiry ID
     */
    List<Notification> findByReferenceIdAndActiveTrue(String referenceId);



    /*
     * Soft delete support
     */
    List<Notification> findByActiveTrue();

}
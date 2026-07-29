package com.realestatepro.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.PropertyInquiry;
import com.realestatepro.enums.InquiryStatus;



@Repository
public interface PropertyInquiryRepository 
        extends MongoRepository<PropertyInquiry, String> {



    /*
     * Customer inquiries
     */
    List<PropertyInquiry> findByCustomerIdAndActiveTrue(
            String customerId
    );



    /*
     * Owner received inquiries
     */
    List<PropertyInquiry> findByOwnerIdAndActiveTrue(
            String ownerId
    );



    /*
     * Property inquiries
     */
    List<PropertyInquiry> findByPropertyIdAndActiveTrue(
            String propertyId
    );



    /*
     * Filter by status
     */
    List<PropertyInquiry> findByStatusAndActiveTrue(
            InquiryStatus status
    );



    /*
     * Prevent duplicate pending inquiry
     */
    boolean existsByCustomerIdAndPropertyIdAndStatusAndActiveTrue(
            String customerId,
            String propertyId,
            InquiryStatus status
    );
    
    long countByActiveTrue();

    long countByOwnerIdAndActiveTrue(
            String ownerId
    );

    long countByCustomerIdAndActiveTrue(String customerId);

}
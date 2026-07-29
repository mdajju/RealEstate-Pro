package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.PropertyInquiryRequest;
import com.realestatepro.dto.response.PropertyInquiryResponse;



public interface PropertyInquiryService {



    /*
     * Create new property inquiry
     */
    PropertyInquiryResponse createInquiry(
            PropertyInquiryRequest request
    );



    /*
     * Get inquiries created by customer
     */
    List<PropertyInquiryResponse> getCustomerInquiries(
            String customerId
    );



    /*
     * Get inquiries received by owner
     */
    List<PropertyInquiryResponse> getOwnerInquiries(
            String ownerId
    );



    /*
     * Get inquiries for a property
     */
    List<PropertyInquiryResponse> getPropertyInquiries(
            String propertyId
    );



    /*
     * Accept inquiry
     */
    PropertyInquiryResponse acceptInquiry(
            String inquiryId
    );



    /*
     * Reject inquiry
     */
    PropertyInquiryResponse rejectInquiry(
            String inquiryId
    );



    /*
     * Close inquiry
     */
    PropertyInquiryResponse closeInquiry(
            String inquiryId
    );



    /*
     * Soft delete inquiry
     */
    void deleteInquiry(
            String inquiryId
    );


}
package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.response.PropertyResponse;

public interface PropertyApprovalService {

    /*
     * Fetch all properties waiting for admin approval
     */
    List<PropertyResponse> getPendingProperties();


    /*
     * Approve property
     * Status -> AVAILABLE
     * Active -> true
     */
    PropertyResponse approveProperty(String propertyId);


    /*
     * Reject property
     * Status -> REJECTED
     * Active -> false
     */
    PropertyResponse rejectProperty(String propertyId);

}
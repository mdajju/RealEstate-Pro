package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.PropertyRequest;
import com.realestatepro.dto.response.PropertyResponse;


public interface PropertyService {


    // Create Property
    PropertyResponse createProperty(PropertyRequest request);



    // Get Property By Id
    PropertyResponse getPropertyById(String id);



    // Get All Properties
    List<PropertyResponse> getAllProperties();



    // Update Property
    PropertyResponse updateProperty(
            String id,
            PropertyRequest request);



    // Delete Property (Soft Delete)
    void deleteProperty(String id);

}
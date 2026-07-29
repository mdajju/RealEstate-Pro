package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.PropertyImageRequest;
import com.realestatepro.dto.response.PropertyImageResponse;



public interface PropertyImageService {


    /*
     * Upload Property Image
     */
    PropertyImageResponse uploadImage(PropertyImageRequest request);



    /*
     * Get all images by property
     */
    List<PropertyImageResponse> getImagesByPropertyId(String propertyId);



    /*
     * Delete Image
     */
    void deleteImage(String imageId);

}
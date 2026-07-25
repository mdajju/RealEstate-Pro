package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.PropertyTypeRequest;
import com.realestatepro.dto.response.PropertyTypeResponse;

public interface PropertyTypeService {


    PropertyTypeResponse createPropertyType(
            PropertyTypeRequest request);


    List<PropertyTypeResponse> getAllPropertyTypes();


    PropertyTypeResponse getPropertyTypeById(
            String id);


    PropertyTypeResponse updatePropertyType(
            String id,
            PropertyTypeRequest request);


    void deletePropertyType(
            String id);

}
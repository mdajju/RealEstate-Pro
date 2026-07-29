package com.realestatepro.repository;

import java.util.List;

import com.realestatepro.entity.Property;
import com.realestatepro.dto.request.PropertySearchRequest;


public interface PropertySearchRepository {


    List<Property> searchProperties(
            PropertySearchRequest request
    );

}
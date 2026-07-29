package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.PropertySearchRequest;
import com.realestatepro.dto.response.PropertyResponse;


public interface PropertySearchService {


    List<PropertyResponse> searchProperties(
            PropertySearchRequest request
    );

}
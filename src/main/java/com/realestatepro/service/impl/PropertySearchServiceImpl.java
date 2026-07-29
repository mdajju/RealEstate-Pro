package com.realestatepro.service.impl;


import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.PropertySearchRequest;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.mapper.PropertyMapper;
import com.realestatepro.repository.PropertySearchRepository;
import com.realestatepro.service.PropertySearchService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PropertySearchServiceImpl implements PropertySearchService {


    private final PropertySearchRepository propertySearchRepository;

    private final PropertyMapper propertyMapper;



    @Override
    public List<PropertyResponse> searchProperties(
            PropertySearchRequest request) {


        List<Property> properties =
                propertySearchRepository.searchProperties(request);



        return properties.stream()
                .map(propertyMapper::toResponse)
                .toList();

    }

}
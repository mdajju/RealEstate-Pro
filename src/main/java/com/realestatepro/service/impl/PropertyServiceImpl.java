package com.realestatepro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.PropertyRequest;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.exception.ResourceAlreadyExistsException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PropertyMapper;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.service.PropertyService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {


    private final PropertyRepository propertyRepository;

    private final PropertyMapper propertyMapper;



    @Override
    public PropertyResponse createProperty(PropertyRequest request) {


        if(propertyRepository.existsByTitle(request.getTitle())) {

        	throw new ResourceAlreadyExistsException(
        	        "Property already exists."
        	);
        }


        Property property = propertyMapper.toEntity(request);


        Property savedProperty =
                propertyRepository.save(property);


        return propertyMapper.toResponse(savedProperty);
    }



    @Override
    public PropertyResponse getPropertyById(String id) {


        Property property =
                propertyRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Property not found."
                    )
                );


        return propertyMapper.toResponse(property);
    }




    @Override
    public List<PropertyResponse> getAllProperties() {


        return propertyRepository.findByActiveTrue()
                .stream()
                .map(propertyMapper::toResponse)
                .collect(Collectors.toList());

    }





    @Override
    public PropertyResponse updateProperty(
            String id,
            PropertyRequest request) {


        Property property =
                propertyRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Property not found."
                    )
                );


        propertyMapper.updateEntity(
                property,
                request
        );


        Property updatedProperty =
                propertyRepository.save(property);


        return propertyMapper.toResponse(updatedProperty);
    }





    @Override
    public void deleteProperty(String id) {


        Property property =
                propertyRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Property not found."
                    )
                );


        property.setActive(false);


        propertyRepository.save(property);

    }

}
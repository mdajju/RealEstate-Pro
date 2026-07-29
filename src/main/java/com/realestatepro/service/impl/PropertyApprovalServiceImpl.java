package com.realestatepro.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.enums.PropertyStatus;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PropertyMapper;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.service.PropertyApprovalService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyApprovalServiceImpl implements PropertyApprovalService {


    private final PropertyRepository propertyRepository;

    private final PropertyMapper propertyMapper;



    @Override
    public List<PropertyResponse> getPendingProperties() {

        return propertyRepository
                .findByStatus(PropertyStatus.PENDING_APPROVAL)
                .stream()
                .map(propertyMapper::toResponse)
                .toList();
    }



    @Override
    public PropertyResponse approveProperty(String propertyId) {


        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Property not found.")
                );


        property.setStatus(PropertyStatus.AVAILABLE);

        property.setActive(true);

        property.setUpdatedAt(LocalDateTime.now());


        Property updatedProperty = propertyRepository.save(property);


        return propertyMapper.toResponse(updatedProperty);
    }




    @Override
    public PropertyResponse rejectProperty(String propertyId) {


        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Property not found.")
                );


        property.setStatus(PropertyStatus.REJECTED);

        property.setActive(false);

        property.setUpdatedAt(LocalDateTime.now());


        Property updatedProperty = propertyRepository.save(property);


        return propertyMapper.toResponse(updatedProperty);
    }

}
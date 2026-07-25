package com.realestatepro.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.PropertyTypeRequest;
import com.realestatepro.dto.response.PropertyTypeResponse;
import com.realestatepro.entity.PropertyType;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PropertyTypeMapper;
import com.realestatepro.repository.PropertyTypeRepository;
import com.realestatepro.service.PropertyTypeService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PropertyTypeServiceImpl 
        implements PropertyTypeService {


    private final PropertyTypeRepository propertyTypeRepository;

    private final PropertyTypeMapper propertyTypeMapper;



    @Override
    public PropertyTypeResponse createPropertyType(
            PropertyTypeRequest request) {


        if(propertyTypeRepository
                .existsByTypeNameIgnoreCaseAndActiveTrue(
                        request.getTypeName())) {

            throw new DuplicateResourceException(
                    "Property type already exists.");
        }


        PropertyType propertyType =
                propertyTypeMapper.toEntity(request);


        PropertyType saved =
                propertyTypeRepository.save(propertyType);


        return propertyTypeMapper.toResponse(saved);
    }



    @Override
    public List<PropertyTypeResponse> getAllPropertyTypes() {

        return propertyTypeRepository
                .findAll()
                .stream()
                .map(propertyTypeMapper::toResponse)
                .toList();
    }



    @Override
    public PropertyTypeResponse getPropertyTypeById(
            String id) {


        PropertyType propertyType =
                propertyTypeRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Property type not found."));


        return propertyTypeMapper.toResponse(propertyType);
    }




    @Override
    public PropertyTypeResponse updatePropertyType(
            String id,
            PropertyTypeRequest request) {


        PropertyType propertyType =
                propertyTypeRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Property type not found."));


        propertyTypeMapper.updateEntity(
                propertyType,
                request);


        PropertyType updated =
                propertyTypeRepository.save(propertyType);


        return propertyTypeMapper.toResponse(updated);
    }




    @Override
    public void deletePropertyType(
            String id) {


        PropertyType propertyType =
                propertyTypeRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Property type not found."));


        // Soft delete
        propertyType.setActive(false);

        propertyTypeRepository.save(propertyType);
    }

}
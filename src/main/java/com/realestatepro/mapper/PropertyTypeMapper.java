package com.realestatepro.mapper;

import org.springframework.stereotype.Component;

import com.realestatepro.dto.request.PropertyTypeRequest;
import com.realestatepro.dto.response.PropertyTypeResponse;
import com.realestatepro.entity.PropertyType;

@Component
public class PropertyTypeMapper {


    public PropertyType toEntity(PropertyTypeRequest request) {

        return PropertyType.builder()
                .typeName(request.getTypeName())
                .description(request.getDescription())
                .active(true)
                .build();
    }


    public PropertyTypeResponse toResponse(PropertyType propertyType) {

        return PropertyTypeResponse.builder()
                .id(propertyType.getId())
                .typeName(propertyType.getTypeName())
                .description(propertyType.getDescription())
                .active(propertyType.getActive())
                .createdAt(propertyType.getCreatedAt())
                .updatedAt(propertyType.getUpdatedAt())
                .build();
    }


    public void updateEntity(
            PropertyType propertyType,
            PropertyTypeRequest request) {

        propertyType.setTypeName(request.getTypeName());
        propertyType.setDescription(request.getDescription());
    }
}
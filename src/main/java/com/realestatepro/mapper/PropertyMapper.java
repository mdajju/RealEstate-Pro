package com.realestatepro.mapper;

import org.springframework.stereotype.Component;

import com.realestatepro.dto.request.PropertyRequest;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.entity.Property;

@Component
public class PropertyMapper {


    public Property toEntity(PropertyRequest request) {

        return Property.builder()

                .title(request.getTitle())

                .description(request.getDescription())

                .propertyTypeId(request.getPropertyTypeId())

                .ownerId(request.getOwnerId())

                .agentId(request.getAgentId())

                .stateId(request.getStateId())

                .cityId(request.getCityId())

                .address(request.getAddress())

                .latitude(request.getLatitude())

                .longitude(request.getLongitude())

                .price(request.getPrice())

                .area(request.getArea())

                .bedrooms(request.getBedrooms())

                .bathrooms(request.getBathrooms())

                .facing(request.getFacing())

                .status(request.getStatus())

                .images(request.getImages())

                .amenities(request.getAmenities())

                .active(true)

                .build();
    }



    public PropertyResponse toResponse(Property property) {

        return PropertyResponse.builder()

                .id(property.getId())

                .title(property.getTitle())

                .description(property.getDescription())

                .propertyTypeId(property.getPropertyTypeId())

                .ownerId(property.getOwnerId())

                .agentId(property.getAgentId())

                .stateId(property.getStateId())

                .cityId(property.getCityId())

                .address(property.getAddress())

                .latitude(property.getLatitude())

                .longitude(property.getLongitude())

                .price(property.getPrice())

                .area(property.getArea())

                .bedrooms(property.getBedrooms())

                .bathrooms(property.getBathrooms())

                .facing(property.getFacing())

                .status(property.getStatus())

                .images(property.getImages())

                .amenities(property.getAmenities())

                .active(property.getActive())

                .createdAt(property.getCreatedAt())

                .updatedAt(property.getUpdatedAt())

                .build();
    }



    public void updateEntity(
            Property property,
            PropertyRequest request) {


        property.setTitle(request.getTitle());

        property.setDescription(request.getDescription());

        property.setPropertyTypeId(request.getPropertyTypeId());

        property.setAgentId(request.getAgentId());

        property.setStateId(request.getStateId());

        property.setCityId(request.getCityId());

        property.setAddress(request.getAddress());

        property.setLatitude(request.getLatitude());

        property.setLongitude(request.getLongitude());

        property.setPrice(request.getPrice());

        property.setArea(request.getArea());

        property.setBedrooms(request.getBedrooms());

        property.setBathrooms(request.getBathrooms());

        property.setFacing(request.getFacing());

        property.setStatus(request.getStatus());

        property.setImages(request.getImages());

        property.setAmenities(request.getAmenities());

    }

}
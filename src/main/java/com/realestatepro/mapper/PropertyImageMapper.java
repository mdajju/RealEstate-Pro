package com.realestatepro.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.realestatepro.dto.request.PropertyImageRequest;
import com.realestatepro.dto.response.PropertyImageResponse;
import com.realestatepro.entity.PropertyImage;



@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface PropertyImageMapper {



    /*
     * Request DTO -> Entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PropertyImage toEntity(PropertyImageRequest request);



    /*
     * Entity -> Response DTO
     */
    PropertyImageResponse toResponse(PropertyImage propertyImage);

}
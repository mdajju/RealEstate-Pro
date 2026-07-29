package com.realestatepro.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.realestatepro.dto.request.PropertyInquiryRequest;
import com.realestatepro.dto.response.PropertyInquiryResponse;
import com.realestatepro.entity.PropertyInquiry;



@Mapper(componentModel = "spring")
public interface PropertyInquiryMapper {



    /*
     * Request DTO -> Entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PropertyInquiry toEntity(PropertyInquiryRequest request);





    /*
     * Entity -> Response DTO
     */
    @Mapping(target = "propertyTitle", ignore = true)
    @Mapping(target = "propertyAddress", ignore = true)
    @Mapping(target = "propertyPrice", ignore = true)

    @Mapping(target = "customerName", ignore = true)

    @Mapping(target = "ownerName", ignore = true)

    PropertyInquiryResponse toResponse(PropertyInquiry inquiry);



}
package com.realestatepro.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.realestatepro.dto.response.ReviewResponse;
import com.realestatepro.entity.Review;



@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ReviewMapper {



    /*
     * Entity -> Response DTO
     */
    @Mapping(target = "userName", ignore = true)
    @Mapping(target = "propertyTitle", ignore = true)
    ReviewResponse toResponse(Review review);


}
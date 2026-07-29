package com.realestatepro.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.realestatepro.dto.response.FavouriteResponse;
import com.realestatepro.entity.Favourite;



@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface FavouriteMapper {


    /*
     * Entity -> Response DTO
     */
    @Mapping(target = "propertyTitle", ignore = true)
    @Mapping(target = "propertyAddress", ignore = true)
    @Mapping(target = "propertyPrice", ignore = true)
    FavouriteResponse toResponse(Favourite favourite);


}
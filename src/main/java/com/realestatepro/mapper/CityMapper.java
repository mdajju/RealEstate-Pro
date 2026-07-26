package com.realestatepro.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.realestatepro.dto.request.CityRequest;
import com.realestatepro.dto.response.CityResponse;
import com.realestatepro.entity.City;


@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CityMapper {


    // Request DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    City toEntity(CityRequest request);



    // Entity -> Response DTO
    CityResponse toResponse(City city);



    // Update Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(
            CityRequest request,
            @MappingTarget City city
    );

}
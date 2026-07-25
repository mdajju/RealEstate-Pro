package com.realestatepro.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.realestatepro.dto.request.CityRequest;
import com.realestatepro.dto.response.CityResponse;
import com.realestatepro.entity.City;

@Mapper(componentModel = "spring")
public interface CityMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "state", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    City toEntity(CityRequest request);


    @Mapping(target = "stateId", source = "state.id")
    @Mapping(target = "stateName", source = "state.stateName")
    CityResponse toResponse(City city);
}
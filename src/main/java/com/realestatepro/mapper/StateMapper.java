package com.realestatepro.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.realestatepro.dto.request.StateRequest;
import com.realestatepro.dto.response.StateResponse;
import com.realestatepro.entity.State;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StateMapper {

    // Convert Request DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    State toEntity(StateRequest request);

    // Convert Entity -> Response DTO
    StateResponse toResponse(State state);

}
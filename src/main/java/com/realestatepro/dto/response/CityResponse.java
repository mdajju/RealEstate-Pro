package com.realestatepro.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CityResponse {

    private String id;

    private String cityName;

    private String stateId;

    private String stateName;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
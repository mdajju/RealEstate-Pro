package com.realestatepro.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CityRequest {

    @NotBlank(message = "City name is required")
    private String cityName;

    @NotBlank(message = "State ID is required")
    private String stateId;
}
package com.realestatepro.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PropertyTypeRequest {

    @NotBlank(message = "Property type name is required")
    private String typeName;

    private String description;

}
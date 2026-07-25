package com.realestatepro.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PropertyTypeResponse {

    private String id;

    private String typeName;

    private String description;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
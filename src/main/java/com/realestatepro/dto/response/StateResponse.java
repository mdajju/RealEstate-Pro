package com.realestatepro.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StateResponse {

    private String id;

    private String stateName;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
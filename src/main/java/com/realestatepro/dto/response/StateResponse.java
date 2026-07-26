package com.realestatepro.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StateResponse {

    private String id;

    private String stateName;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
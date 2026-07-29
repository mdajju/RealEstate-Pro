package com.realestatepro.dto.response;

import java.time.LocalDateTime;

import com.realestatepro.enums.ComplaintStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {

    private String id;

    private String userId;

    private String againstUserId;

    private String propertyId;

    private String title;

    private String description;

    private ComplaintStatus status;

    private String adminRemark;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
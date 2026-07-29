package com.realestatepro.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequest {

    @NotBlank(message = "User ID is required.")
    private String userId;

    @NotBlank(message = "Against User ID is required.")
    private String againstUserId;

    @NotBlank(message = "Property ID is required.")
    private String propertyId;

    @NotBlank(message = "Complaint title is required.")
    private String title;

    @NotBlank(message = "Complaint description is required.")
    private String description;
}
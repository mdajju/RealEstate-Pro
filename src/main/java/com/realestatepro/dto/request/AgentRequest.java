package com.realestatepro.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;



@Data
public class AgentRequest {



    /*
     * Existing User ID
     */
    @NotBlank(message = "User ID is required")
    private String userId;



    /*
     * Agent License Number
     */
    @NotBlank(message = "License number is required")
    private String licenseNumber;



    /*
     * Experience in years
     */
    @NotNull(message = "Experience is required")
    @Min(
            value = 0,
            message = "Experience cannot be negative"
    )
    private Integer experience;



    /*
     * Agent specialization
     */
    @NotBlank(message = "Specialization is required")
    private String specialization;



    /*
     * Agent description
     */
    private String description;



    /*
     * Profile Image URL
     */
    private String profileImage;


}
package com.realestatepro.dto.request;


import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyBookingRequest {


    /*
     * Property which customer wants to book
     */
    @NotBlank(message = "Property ID is required")
    private String propertyId;



    /*
     * Customer who is booking property
     */
    @NotBlank(message = "Customer ID is required")
    private String customerId;



    /*
     * Property owner
     */
    @NotBlank(message = "Owner ID is required")
    private String ownerId;



    /*
     * Customer message
     */
    private String message;



    /*
     * Scheduled property visit date
     */
    @NotNull(message = "Visit date is required")
    @Future(message = "Visit date must be a future date")
    private LocalDateTime visitDate;

}
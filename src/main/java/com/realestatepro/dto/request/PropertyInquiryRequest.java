package com.realestatepro.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;



@Data
public class PropertyInquiryRequest {



    /*
     * Property ID
     */
    @NotBlank(message = "Property ID is required")
    private String propertyId;



    /*
     * Customer ID
     */
    @NotBlank(message = "Customer ID is required")
    private String customerId;



    /*
     * Owner ID
     */
    @NotBlank(message = "Owner ID is required")
    private String ownerId;



    /*
     * Customer Message
     */
    @NotBlank(message = "Message is required")
    private String message;


}
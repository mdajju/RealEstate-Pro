package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import com.realestatepro.enums.InquiryStatus;

import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class PropertyInquiryResponse {



    private String id;



    /*
     * Property Details
     */
    private String propertyId;

    private String propertyTitle;

    private String propertyAddress;

    private Double propertyPrice;



    /*
     * Customer Details
     */
    private String customerId;

    private String customerName;



    /*
     * Owner Details
     */
    private String ownerId;

    private String ownerName;



    /*
     * Inquiry Information
     */
    private String message;


    private InquiryStatus status;


    private Boolean active;



    /*
     * Audit Fields
     */
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


}
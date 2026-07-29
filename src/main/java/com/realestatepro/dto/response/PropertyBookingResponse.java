package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import com.realestatepro.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyBookingResponse {


    /*
     * Booking ID
     */
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
     * Booking Information
     */
    private String message;

    private LocalDateTime visitDate;


    private BookingStatus status;



    private Boolean active;



    /*
     * Audit Fields
     */
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
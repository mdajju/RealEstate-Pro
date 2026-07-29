package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Document(collection = "property_bookings")
public class PropertyBooking {


    @Id
    private String id;


    /*
     * Property Details
     */
    private String propertyId;


    /*
     * Customer who booked property
     */
    private String customerId;


    /*
     * Property Owner
     */
    private String ownerId;



    /*
     * Booking information
     */
    private String message;


    private LocalDateTime visitDate;



    private BookingStatus status;



    private Boolean active;



    @CreatedDate
    private LocalDateTime createdAt;


    @LastModifiedDate
    private LocalDateTime updatedAt;


}
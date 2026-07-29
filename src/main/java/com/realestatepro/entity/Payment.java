package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.PaymentMethod;
import com.realestatepro.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {



    @Id
    private String id;



    /*
     * Related Booking
     */
    private String bookingId;



    /*
     * Customer who made payment
     */
    private String customerId;



    /*
     * Property Owner
     */
    private String ownerId;



    /*
     * Payment Amount
     */
    private Double amount;



    /*
     * Payment Information
     */
    @Builder.Default
    private PaymentStatus status =
            PaymentStatus.PENDING;


    private PaymentMethod paymentMethod;



    /*
     * External transaction reference
     *
     * Razorpay / Stripe transaction id
     */
    private String transactionId;



    /*
     * Payment Description
     */
    private String description;



    /*
     * Soft Delete
     */
    @Builder.Default
    private Boolean active = true;



    /*
     * Audit Fields
     */
    @Builder.Default
    private LocalDateTime createdAt =
            LocalDateTime.now();



    @LastModifiedDate
    private LocalDateTime updatedAt;



}
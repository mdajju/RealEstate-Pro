package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import com.realestatepro.enums.PaymentMethod;
import com.realestatepro.enums.PaymentStatus;

import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class PaymentResponse {



    private String id;



    private String bookingId;



    private String customerId;

    private String customerName;



    private String ownerId;

    private String ownerName;



    private Double amount;



    private PaymentStatus status;



    private PaymentMethod paymentMethod;



    private String transactionId;



    private String description;



    private Boolean active;



    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;


}
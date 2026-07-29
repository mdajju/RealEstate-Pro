package com.realestatepro.dto.request;


import com.realestatepro.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;



@Data
public class PaymentRequest {



    /*
     * Booking Reference
     */
    @NotBlank(message = "Booking ID is required")
    private String bookingId;



    /*
     * Customer
     */
    @NotBlank(message = "Customer ID is required")
    private String customerId;



    /*
     * Owner
     */
    @NotBlank(message = "Owner ID is required")
    private String ownerId;



    /*
     * Amount
     */
    @NotNull(message = "Amount is required")
    private Double amount;



    /*
     * Payment Method
     */
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;



    /*
     * Description
     */
    private String description;


}
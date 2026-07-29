package com.realestatepro.mapper;


import org.springframework.stereotype.Component;

import com.realestatepro.dto.request.PaymentRequest;
import com.realestatepro.dto.response.PaymentResponse;
import com.realestatepro.entity.Payment;



@Component
public class PaymentMapper {



    /*
     * Convert Request DTO to Entity
     */
    public Payment toEntity(
            PaymentRequest request) {


        return Payment.builder()

                .bookingId(
                        request.getBookingId()
                )

                .customerId(
                        request.getCustomerId()
                )

                .ownerId(
                        request.getOwnerId()
                )

                .amount(
                        request.getAmount()
                )

                .paymentMethod(
                        request.getPaymentMethod()
                )

                .description(
                        request.getDescription()
                )

                .build();

    }







    /*
     * Convert Entity to Response DTO
     */
    public PaymentResponse toResponse(
            Payment payment) {


        return PaymentResponse.builder()

                .id(
                        payment.getId()
                )

                .bookingId(
                        payment.getBookingId()
                )

                .customerId(
                        payment.getCustomerId()
                )

                .ownerId(
                        payment.getOwnerId()
                )

                .amount(
                        payment.getAmount()
                )

                .status(
                        payment.getStatus()
                )

                .paymentMethod(
                        payment.getPaymentMethod()
                )

                .transactionId(
                        payment.getTransactionId()
                )

                .description(
                        payment.getDescription()
                )

                .active(
                        payment.getActive()
                )

                .createdAt(
                        payment.getCreatedAt()
                )

                .updatedAt(
                        payment.getUpdatedAt()
                )

                .build();

    }



}
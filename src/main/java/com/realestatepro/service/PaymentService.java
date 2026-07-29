package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.PaymentRequest;
import com.realestatepro.dto.response.PaymentResponse;



public interface PaymentService {



    /*
     * Create Payment
     */
    PaymentResponse createPayment(
            PaymentRequest request
    );



    /*
     * Get Payment By Id
     */
    PaymentResponse getPaymentById(
            String paymentId
    );



    /*
     * Get Customer Payments
     */
    List<PaymentResponse> getCustomerPayments(
            String customerId
    );



    /*
     * Get Owner Payments
     */
    List<PaymentResponse> getOwnerPayments(
            String ownerId
    );



    /*
     * Get Booking Payment
     */
    List<PaymentResponse> getBookingPayments(
            String bookingId
    );



    /*
     * Mark Payment Successful
     */
    PaymentResponse successPayment(
            String paymentId
    );



    /*
     * Mark Payment Failed
     */
    PaymentResponse failedPayment(
            String paymentId
    );



    /*
     * Cancel Payment
     */
    PaymentResponse cancelPayment(
            String paymentId
    );



    /*
     * Refund Payment
     */
    PaymentResponse refundPayment(
            String paymentId
    );



    /*
     * Delete Payment (Soft Delete)
     */
    void deletePayment(
            String paymentId
    );


}
package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PaymentRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PaymentResponse;
import com.realestatepro.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {



    private final PaymentService paymentService;





    /*
     * Create Payment
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @Valid @RequestBody PaymentRequest request) {


        PaymentResponse response =
                paymentService.createPayment(request);



        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                        .<PaymentResponse>builder()

                        .success(true)

                        .message(
                                "Payment created successfully"
                        )

                        .data(response)

                        .build()
                );

    }









    /*
     * Get Payment By Id
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
            @PathVariable String paymentId) {



        PaymentResponse response =
                paymentService.getPaymentById(paymentId);



        return ResponseEntity.ok(

                ApiResponse
                .<PaymentResponse>builder()

                .success(true)

                .message(
                        "Payment fetched successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Customer Payment History
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> 
    getCustomerPayments(
            @PathVariable String customerId) {



        List<PaymentResponse> response =
                paymentService.getCustomerPayments(customerId);



        return ResponseEntity.ok(

                ApiResponse
                .<List<PaymentResponse>>builder()

                .success(true)

                .message(
                        "Customer payments fetched successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Owner Received Payments
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> 
    getOwnerPayments(
            @PathVariable String ownerId) {



        List<PaymentResponse> response =
                paymentService.getOwnerPayments(ownerId);



        return ResponseEntity.ok(

                ApiResponse
                .<List<PaymentResponse>>builder()

                .success(true)

                .message(
                        "Owner payments fetched successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Booking Payments
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> 
    getBookingPayments(
            @PathVariable String bookingId) {



        List<PaymentResponse> response =
                paymentService.getBookingPayments(
                        bookingId
                );



        return ResponseEntity.ok(

                ApiResponse
                .<List<PaymentResponse>>builder()

                .success(true)

                .message(
                        "Booking payments fetched successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Mark Payment Successful
     */
    @PutMapping("/{paymentId}/success")
    public ResponseEntity<ApiResponse<PaymentResponse>>
    successPayment(
            @PathVariable String paymentId) {



        PaymentResponse response =
                paymentService.successPayment(
                        paymentId
                );



        return ResponseEntity.ok(

                ApiResponse
                .<PaymentResponse>builder()

                .success(true)

                .message(
                        "Payment marked successful"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Mark Payment Failed
     */
    @PutMapping("/{paymentId}/failed")
    public ResponseEntity<ApiResponse<PaymentResponse>>
    failedPayment(
            @PathVariable String paymentId) {



        PaymentResponse response =
                paymentService.failedPayment(
                        paymentId
                );



        return ResponseEntity.ok(

                ApiResponse
                .<PaymentResponse>builder()

                .success(true)

                .message(
                        "Payment marked failed"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Cancel Payment
     */
    @PutMapping("/{paymentId}/cancel")
    public ResponseEntity<ApiResponse<PaymentResponse>>
    cancelPayment(
            @PathVariable String paymentId) {



        PaymentResponse response =
                paymentService.cancelPayment(
                        paymentId
                );



        return ResponseEntity.ok(

                ApiResponse
                .<PaymentResponse>builder()

                .success(true)

                .message(
                        "Payment cancelled successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Refund Payment
     */
    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>>
    refundPayment(
            @PathVariable String paymentId) {



        PaymentResponse response =
                paymentService.refundPayment(
                        paymentId
                );



        return ResponseEntity.ok(

                ApiResponse
                .<PaymentResponse>builder()

                .success(true)

                .message(
                        "Payment refunded successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Delete Payment
     */
    @DeleteMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Void>>
    deletePayment(
            @PathVariable String paymentId) {



        paymentService.deletePayment(
                paymentId
        );



        return ResponseEntity.ok(

                ApiResponse
                .<Void>builder()

                .success(true)

                .message(
                        "Payment deleted successfully"
                )

                .build()

        );

    }


}
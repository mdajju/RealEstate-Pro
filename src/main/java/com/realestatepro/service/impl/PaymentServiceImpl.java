package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.dto.request.PaymentRequest;
import com.realestatepro.dto.response.PaymentResponse;
import com.realestatepro.entity.Payment;
import com.realestatepro.entity.User;
import com.realestatepro.enums.NotificationType;
import com.realestatepro.enums.PaymentStatus;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PaymentMapper;
import com.realestatepro.repository.PaymentRepository;
import com.realestatepro.repository.PropertyBookingRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.NotificationService;
import com.realestatepro.service.PaymentService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class PaymentServiceImpl 
        implements PaymentService {



    private final PaymentRepository paymentRepository;


    private final PropertyBookingRepository bookingRepository;


    private final UserRepository userRepository;


    private final PaymentMapper paymentMapper;


    private final NotificationService notificationService;





    /*
     * Create Payment
     */
    @Override
    public PaymentResponse createPayment(
            PaymentRequest request) {



        boolean exists =
                paymentRepository
                .existsByBookingIdAndStatusAndActiveTrue(
                        request.getBookingId(),
                        PaymentStatus.SUCCESS
                );



        if(exists) {

            throw new DuplicateResourceException(
                    "Payment already completed for this booking."
            );

        }





        bookingRepository.findById(
                request.getBookingId()
        )
        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "Booking not found with id : "
                        + request.getBookingId()
                )
        );





        User customer =
                userRepository.findById(
                        request.getCustomerId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id : "
                                + request.getCustomerId()
                        )
                );





        User owner =
                userRepository.findById(
                        request.getOwnerId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id : "
                                + request.getOwnerId()
                        )
                );







        Payment payment =
                paymentMapper.toEntity(request);



        payment.setStatus(
                PaymentStatus.PENDING
        );


        payment.setActive(true);


        payment.setCreatedAt(
                LocalDateTime.now()
        );



        Payment savedPayment =
                paymentRepository.save(payment);






        NotificationRequest notification =
                NotificationRequest.builder()

                .userId(owner.getId())

                .title(
                        "New Payment Initiated"
                )

                .message(
                        customer.getFirstName()
                        + " initiated payment of "
                        + request.getAmount()
                )

                .type(
                        NotificationType.PAYMENT
                )

                .referenceId(
                        savedPayment.getId()
                )

                .build();



        notificationService.createNotification(
                notification
        );




        return mapResponse(savedPayment);

    }









    /*
     * Get Payment By Id
     */
    @Override
    public PaymentResponse getPaymentById(
            String paymentId) {


        Payment payment =
                getPayment(paymentId);


        return mapResponse(payment);

    }









    /*
     * Customer Payments
     */
    @Override
    public List<PaymentResponse> getCustomerPayments(
            String customerId) {


        validateUser(customerId);



        return paymentRepository
                .findByCustomerIdAndActiveTrue(
                        customerId
                )
                .stream()
                .map(this::mapResponse)
                .toList();

    }









    /*
     * Owner Payments
     */
    @Override
    public List<PaymentResponse> getOwnerPayments(
            String ownerId) {


        validateUser(ownerId);



        return paymentRepository
                .findByOwnerIdAndActiveTrue(
                        ownerId
                )
                .stream()
                .map(this::mapResponse)
                .toList();

    }









    /*
     * Booking Payments
     */
    @Override
    public List<PaymentResponse> getBookingPayments(
            String bookingId) {


        return paymentRepository
                .findByBookingIdAndActiveTrue(
                        bookingId
                )
                .stream()
                .map(this::mapResponse)
                .toList();

    }









    /*
     * Success Payment
     */
    @Override
    public PaymentResponse successPayment(
            String paymentId) {


        Payment payment =
                getPayment(paymentId);



        payment.setStatus(
                PaymentStatus.SUCCESS
        );


        payment.setUpdatedAt(
                LocalDateTime.now()
        );



        Payment saved =
                paymentRepository.save(payment);



        return mapResponse(saved);

    }









    /*
     * Failed Payment
     */
    @Override
    public PaymentResponse failedPayment(
            String paymentId) {


        Payment payment =
                getPayment(paymentId);



        payment.setStatus(
                PaymentStatus.FAILED
        );


        payment.setUpdatedAt(
                LocalDateTime.now()
        );



        return mapResponse(
                paymentRepository.save(payment)
        );

    }









    /*
     * Cancel Payment
     */
    @Override
    public PaymentResponse cancelPayment(
            String paymentId) {


        Payment payment =
                getPayment(paymentId);



        payment.setStatus(
                PaymentStatus.CANCELLED
        );


        payment.setUpdatedAt(
                LocalDateTime.now()
        );



        return mapResponse(
                paymentRepository.save(payment)
        );

    }









    /*
     * Refund Payment
     */
    @Override
    public PaymentResponse refundPayment(
            String paymentId) {


        Payment payment =
                getPayment(paymentId);



        payment.setStatus(
                PaymentStatus.REFUNDED
        );


        payment.setUpdatedAt(
                LocalDateTime.now()
        );



        return mapResponse(
                paymentRepository.save(payment)
        );

    }









    /*
     * Delete Payment
     */
    @Override
    public void deletePayment(
            String paymentId) {


        Payment payment =
                getPayment(paymentId);



        payment.setActive(false);



        paymentRepository.save(payment);

    }









    private Payment getPayment(
            String paymentId) {


        return paymentRepository
                .findById(paymentId)

                .filter(
                    Payment::getActive
                )

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id : "
                                + paymentId
                        )
                );

    }








    private void validateUser(
            String userId) {


        userRepository.findById(userId)

        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "User not found with id : "
                        + userId
                )
        );

    }








    private PaymentResponse mapResponse(
            Payment payment) {


        PaymentResponse response =
                paymentMapper.toResponse(payment);



        userRepository.findById(
                payment.getCustomerId()
        )
        .ifPresent(user ->
                response.setCustomerName(
                        user.getFirstName()
                        + " "
                        + user.getLastName()
                )
        );



        userRepository.findById(
                payment.getOwnerId()
        )
        .ifPresent(user ->
                response.setOwnerName(
                        user.getFirstName()
                        + " "
                        + user.getLastName()
                )
        );



        return response;

    }


}
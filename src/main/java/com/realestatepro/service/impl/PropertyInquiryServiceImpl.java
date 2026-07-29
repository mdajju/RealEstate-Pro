package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.dto.request.PropertyInquiryRequest;
import com.realestatepro.dto.response.PropertyInquiryResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.entity.PropertyInquiry;
import com.realestatepro.entity.User;
import com.realestatepro.enums.InquiryStatus;
import com.realestatepro.enums.NotificationType;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PropertyInquiryMapper;
import com.realestatepro.repository.PropertyInquiryRepository;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.NotificationService;
import com.realestatepro.service.PropertyInquiryService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PropertyInquiryServiceImpl 
        implements PropertyInquiryService {



    private final PropertyInquiryRepository inquiryRepository;

    private final PropertyRepository propertyRepository;

    private final UserRepository userRepository;

    private final PropertyInquiryMapper inquiryMapper;

    private final NotificationService notificationService;



    /*
     * Create Inquiry
     */
    @Override
    public PropertyInquiryResponse createInquiry(
            PropertyInquiryRequest request) {


        boolean exists =
                inquiryRepository
                .existsByCustomerIdAndPropertyIdAndStatusAndActiveTrue(
                        request.getCustomerId(),
                        request.getPropertyId(),
                        InquiryStatus.PENDING
                );


        if (exists) {

            throw new DuplicateResourceException(
                    "Inquiry already exists for this property."
            );
        }




        Property property =
                propertyRepository.findById(
                        request.getPropertyId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with id : "
                                + request.getPropertyId()
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




        /*
         * Validate Owner Belongs To Property
         */
        if(property.getOwnerId() == null
                || !property.getOwnerId()
                .equals(owner.getId())) {


            throw new IllegalArgumentException(
                    "Selected owner does not belong to this property."
            );
        }





        PropertyInquiry inquiry =
                inquiryMapper.toEntity(request);



        inquiry.setStatus(
                InquiryStatus.PENDING
        );


        inquiry.setActive(true);


        inquiry.setCreatedAt(
                LocalDateTime.now()
        );


        inquiry.setUpdatedAt(
                LocalDateTime.now()
        );



        PropertyInquiry savedInquiry =
                inquiryRepository.save(inquiry);




        /*
         * Notify Owner
         */
        NotificationRequest notificationRequest =
                NotificationRequest.builder()

                .userId(owner.getId())

                .title("New Property Inquiry")

                .message(
                        customer.getFirstName()
                        + " "
                        + customer.getLastName()
                        + " sent an inquiry for "
                        + property.getTitle()
                )

                .type(NotificationType.INQUIRY)

                .referenceId(savedInquiry.getId())

                .build();



        notificationService.createNotification(
                notificationRequest
        );




        return mapResponse(savedInquiry);

    }







    /*
     * Customer Inquiries
     */
    @Override
    public List<PropertyInquiryResponse> getCustomerInquiries(
            String customerId) {


        validateUser(customerId,"Customer");


        return inquiryRepository
                .findByCustomerIdAndActiveTrue(customerId)

                .stream()

                .map(this::mapResponse)

                .toList();

    }







    /*
     * Owner Inquiries
     */
    @Override
    public List<PropertyInquiryResponse> getOwnerInquiries(
            String ownerId) {


        validateUser(ownerId,"Owner");


        return inquiryRepository
                .findByOwnerIdAndActiveTrue(ownerId)

                .stream()

                .map(this::mapResponse)

                .toList();

    }







    /*
     * Property Inquiries
     */
    @Override
    public List<PropertyInquiryResponse> getPropertyInquiries(
            String propertyId) {


        propertyRepository.findById(propertyId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with id : "
                                + propertyId
                        )
                );


        return inquiryRepository
                .findByPropertyIdAndActiveTrue(propertyId)

                .stream()

                .map(this::mapResponse)

                .toList();

    }








    /*
     * Accept Inquiry
     */
    @Override
    public PropertyInquiryResponse acceptInquiry(
            String inquiryId) {


        PropertyInquiry inquiry =
                getInquiry(inquiryId);



        validateStatusTransition(
                inquiry.getStatus(),
                InquiryStatus.ACCEPTED
        );



        inquiry.setStatus(
                InquiryStatus.ACCEPTED
        );


        inquiry.setUpdatedAt(
                LocalDateTime.now()
        );



        PropertyInquiry saved =
                inquiryRepository.save(inquiry);




        sendStatusNotification(
                inquiry,
                "Inquiry Accepted",
                "Your property inquiry has been accepted."
        );



        return mapResponse(saved);

    }








    /*
     * Reject Inquiry
     */
    @Override
    public PropertyInquiryResponse rejectInquiry(
            String inquiryId) {


        PropertyInquiry inquiry =
                getInquiry(inquiryId);



        validateStatusTransition(
                inquiry.getStatus(),
                InquiryStatus.REJECTED
        );



        inquiry.setStatus(
                InquiryStatus.REJECTED
        );


        inquiry.setUpdatedAt(
                LocalDateTime.now()
        );



        PropertyInquiry saved =
                inquiryRepository.save(inquiry);



        sendStatusNotification(
                inquiry,
                "Inquiry Rejected",
                "Your property inquiry has been rejected."
        );



        return mapResponse(saved);

    }








    /*
     * Close Inquiry
     */
    @Override
    public PropertyInquiryResponse closeInquiry(
            String inquiryId) {


        PropertyInquiry inquiry =
                getInquiry(inquiryId);



        validateStatusTransition(
                inquiry.getStatus(),
                InquiryStatus.CLOSED
        );



        inquiry.setStatus(
                InquiryStatus.CLOSED
        );


        inquiry.setUpdatedAt(
                LocalDateTime.now()
        );



        PropertyInquiry saved =
                inquiryRepository.save(inquiry);



        sendStatusNotification(
                inquiry,
                "Inquiry Closed",
                "Your property inquiry has been closed."
        );



        return mapResponse(saved);

    }








    /*
     * Delete Inquiry
     */
    @Override
    public void deleteInquiry(
            String inquiryId) {


        PropertyInquiry inquiry =
                getInquiry(inquiryId);



        inquiry.setActive(false);


        inquiry.setUpdatedAt(
                LocalDateTime.now()
        );



        inquiryRepository.save(inquiry);

    }









    private void validateStatusTransition(
            InquiryStatus currentStatus,
            InquiryStatus newStatus) {


        if(currentStatus == InquiryStatus.PENDING
                &&
                (newStatus == InquiryStatus.ACCEPTED
                || newStatus == InquiryStatus.REJECTED)) {

            return;
        }



        if(currentStatus == InquiryStatus.ACCEPTED
                &&
                newStatus == InquiryStatus.CLOSED) {

            return;
        }



        throw new IllegalStateException(
                "Invalid inquiry status transition from "
                + currentStatus
                + " to "
                + newStatus
        );

    }









    private PropertyInquiry getInquiry(
            String inquiryId) {


        return inquiryRepository.findById(inquiryId)

                .filter(PropertyInquiry::getActive)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Active inquiry not found with id : "
                                + inquiryId
                        )
                );

    }









    private void validateUser(
            String userId,
            String type) {


        userRepository.findById(userId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                type
                                + " not found with id : "
                                + userId
                        )
                );
    }









    private void sendStatusNotification(
            PropertyInquiry inquiry,
            String title,
            String message) {


        NotificationRequest request =
                NotificationRequest.builder()

                .userId(
                        inquiry.getCustomerId()
                )

                .title(title)

                .message(message)

                .type(NotificationType.INQUIRY)

                .referenceId(
                        inquiry.getId()
                )

                .build();



        notificationService.createNotification(request);

    }









    private PropertyInquiryResponse mapResponse(
            PropertyInquiry inquiry) {


        PropertyInquiryResponse response =
                inquiryMapper.toResponse(inquiry);




        propertyRepository.findById(
                inquiry.getPropertyId()
        )
        .ifPresent(property -> {


            response.setPropertyTitle(
                    property.getTitle()
            );


            response.setPropertyAddress(
                    property.getAddress()
            );


            response.setPropertyPrice(
                    property.getPrice()
            );

        });





        userRepository.findById(
                inquiry.getCustomerId()
        )
        .ifPresent(customer -> {


            response.setCustomerName(
                    customer.getFirstName()
                    + " "
                    + customer.getLastName()
            );

        });





        userRepository.findById(
                inquiry.getOwnerId()
        )
        .ifPresent(owner -> {


            response.setOwnerName(
                    owner.getFirstName()
                    + " "
                    + owner.getLastName()
            );

        });



        return response;

    }


}
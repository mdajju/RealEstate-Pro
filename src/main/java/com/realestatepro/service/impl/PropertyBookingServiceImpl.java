package com.realestatepro.service.impl;


import java.util.List;
import com.realestatepro.exception.InvalidOperationException;
import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.enums.NotificationType;
import com.realestatepro.service.NotificationService;
import java.util.stream.Collectors;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.realestatepro.dto.request.PropertyBookingRequest;
import com.realestatepro.dto.response.PropertyBookingResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.entity.PropertyBooking;
import com.realestatepro.entity.User;
import com.realestatepro.enums.BookingStatus;
import com.realestatepro.exception.ResourceAlreadyExistsException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PropertyBookingMapper;
import com.realestatepro.repository.PropertyBookingRepository;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.PropertyBookingService;


import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
@Transactional
public class PropertyBookingServiceImpl implements PropertyBookingService {



    private final PropertyBookingRepository propertyBookingRepository;

    private final PropertyRepository propertyRepository;

    private final UserRepository userRepository;

    private final PropertyBookingMapper propertyBookingMapper;
    
    private final NotificationService notificationService;



    /*
     * Create Booking
     */
    @Override
    public PropertyBookingResponse createBooking(
            PropertyBookingRequest request) {



    	Property property =
    	        propertyRepository.findById(request.getPropertyId())
    	        .orElseThrow(
    	            () -> new ResourceNotFoundException(
    	                "Property not found with id : "
    	                + request.getPropertyId()
    	            )
    	        );



        // Validate Customer
        User customer =
                userRepository.findById(request.getCustomerId())
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                    		"Customer not found with id : " 
                    				+ request.getCustomerId()
                    )
                );



        // Validate Owner
        User owner =
                userRepository.findById(request.getOwnerId())
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                    		"Owner not found with id : "
                    				+ request.getOwnerId()
                    )
                );



        // Duplicate booking check
        propertyBookingRepository
        .findByPropertyIdAndCustomerIdAndActiveTrue(
                request.getPropertyId(),
                request.getCustomerId()
        )
        .ifPresent(
            booking -> {
                throw new ResourceAlreadyExistsException(
                    "Booking already exists for this property and customer."
                );
            }
        );


        PropertyBooking booking =
                PropertyBooking.builder()

                .propertyId(property.getId())

                .customerId(customer.getId())

                .ownerId(owner.getId())

                .message(request.getMessage())

                .visitDate(request.getVisitDate())

                .status(BookingStatus.PENDING)

                .active(true)

                .build();



        PropertyBooking savedBooking =
                propertyBookingRepository.save(booking);
        
        
     // Create Notification For Owner

        NotificationRequest notificationRequest =
                NotificationRequest.builder()

                .userId(owner.getId())

                .title("New Booking Request")

                .message(
                    customer.getFirstName()
                    + " "
                    + customer.getLastName()
                    + " requested a visit for "
                    + property.getTitle()
                )

                .type(NotificationType.BOOKING)

                .referenceId(savedBooking.getId())

                .build();



        notificationService.createNotification(notificationRequest);



        return mapToResponse(savedBooking);

    }






    /*
     * Get Booking By ID
     */
    @Override
    public PropertyBookingResponse getBookingById(
            String bookingId) {



        PropertyBooking booking =
                propertyBookingRepository.findById(bookingId)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                    		"Booking not found with id : " + bookingId                    )
                );



        return mapToResponse(booking);

    }


    
    private void validateStatusTransition(
            BookingStatus currentStatus,
            BookingStatus newStatus) {


        if(currentStatus == BookingStatus.PENDING
                &&
           (newStatus == BookingStatus.ACCEPTED
            || newStatus == BookingStatus.REJECTED
            || newStatus == BookingStatus.CANCELLED)) {

            return;
        }


        if(currentStatus == BookingStatus.ACCEPTED
                && newStatus == BookingStatus.COMPLETED) {

            return;
        }


        throw new InvalidOperationException(
                "Invalid booking status transition from "
                + currentStatus
                + " to "
                + newStatus
        );
    }




    /*
     * Customer Bookings
     */
    @Override
    public List<PropertyBookingResponse> getCustomerBookings(
            String customerId) {


        return propertyBookingRepository
                .findByCustomerIdAndActiveTrue(customerId)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }






    /*
     * Owner Bookings
     */
    @Override
    public List<PropertyBookingResponse> getOwnerBookings(
            String ownerId) {


        return propertyBookingRepository
                .findByOwnerIdAndActiveTrue(ownerId)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }






    /*
     * Property Bookings
     */
    @Override
    public List<PropertyBookingResponse> getPropertyBookings(
            String propertyId) {


        return propertyBookingRepository
                .findByPropertyIdAndActiveTrue(propertyId)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }







    /*
     * Accept Booking
     */
    /*
     * Accept Booking
     */
    @Override
    public PropertyBookingResponse acceptBooking(
            String bookingId) {


        PropertyBooking booking =
                getBooking(bookingId);



        validateStatusTransition(
                booking.getStatus(),
                BookingStatus.ACCEPTED
        );

        booking.setStatus(
                BookingStatus.ACCEPTED
        );



        PropertyBooking updatedBooking =
                propertyBookingRepository.save(booking);



        // Get Property Details
        Property property =
                propertyRepository.findById(
                        booking.getPropertyId()
                )
                .orElseThrow(
                	    () -> new ResourceNotFoundException(
                	        "Property not found with id : "
                	        + booking.getPropertyId()
                	    )
                	);



        // Create Notification For Customer

        NotificationRequest notificationRequest =
                NotificationRequest.builder()

                .userId(
                        booking.getCustomerId()
                )

                .title(
                        "Booking Accepted"
                )

                .message(
                        "Your booking request for "
                        + property.getTitle()
                        + " has been accepted."
                )

                .type(
                        NotificationType.BOOKING
                )

                .referenceId(
                        booking.getId()
                )

                .build();



        notificationService.createNotification(
                notificationRequest
        );



        return mapToResponse(updatedBooking);

    }


    /*
     * Reject Booking
     */
    @Override
    public PropertyBookingResponse rejectBooking(
            String bookingId) {


        PropertyBooking booking =
                getBooking(bookingId);


        validateStatusTransition(
                booking.getStatus(),
                BookingStatus.REJECTED
        );

        booking.setStatus(
                BookingStatus.REJECTED
        );


        return mapToResponse(
                propertyBookingRepository.save(booking)
        );

    }






    /*
     * Cancel Booking
     */
    @Override
    public PropertyBookingResponse cancelBooking(
            String bookingId) {


        PropertyBooking booking =
                getBooking(bookingId);


        validateStatusTransition(
                booking.getStatus(),
                BookingStatus.CANCELLED
        );

        booking.setStatus(
                BookingStatus.CANCELLED
        );


        return mapToResponse(
                propertyBookingRepository.save(booking)
        );

    }






    /*
     * Complete Booking
     */
    @Override
    public PropertyBookingResponse completeBooking(
            String bookingId) {


        PropertyBooking booking =
                getBooking(bookingId);



        validateStatusTransition(
                booking.getStatus(),
                BookingStatus.COMPLETED
        );

        booking.setStatus(
                BookingStatus.COMPLETED
        );



        return mapToResponse(
                propertyBookingRepository.save(booking)
        );

    }






    /*
     * Admin - All Bookings
     */
    @Override
    public List<PropertyBookingResponse> getAllBookings() {


        return propertyBookingRepository
                .findByActiveTrue()

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }






    private PropertyBooking getBooking(String id) {


        return propertyBookingRepository.findById(id)

                .orElseThrow(
                    () -> new ResourceNotFoundException(
                    		"Booking not found with id : " + id
                    )
                );

    }







    /*
     * Response Mapping With Extra Details
     */
    private PropertyBookingResponse mapToResponse(
            PropertyBooking booking) {


        PropertyBookingResponse response =
                propertyBookingMapper.toResponse(booking);



        propertyRepository.findById(
                booking.getPropertyId()
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
                booking.getCustomerId()
        )
        .ifPresent(customer -> {

            response.setCustomerName(
                    customer.getFirstName()
                    + " "
                    + customer.getLastName()
            );

        });




        userRepository.findById(
                booking.getOwnerId()
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
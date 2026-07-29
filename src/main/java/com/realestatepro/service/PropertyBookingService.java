package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.PropertyBookingRequest;
import com.realestatepro.dto.response.PropertyBookingResponse;



public interface PropertyBookingService {



    /*
     * Customer creates booking request
     */
    PropertyBookingResponse createBooking(
            PropertyBookingRequest request
    );



    /*
     * Get booking by ID
     */
    PropertyBookingResponse getBookingById(
            String bookingId
    );



    /*
     * Get all bookings of customer
     */
    List<PropertyBookingResponse> getCustomerBookings(
            String customerId
    );



    /*
     * Get all bookings received by owner
     */
    List<PropertyBookingResponse> getOwnerBookings(
            String ownerId
    );



    /*
     * Get bookings of a property
     */
    List<PropertyBookingResponse> getPropertyBookings(
            String propertyId
    );



    /*
     * Owner accepts booking
     */
    PropertyBookingResponse acceptBooking(
            String bookingId
    );



    /*
     * Owner rejects booking
     */
    PropertyBookingResponse rejectBooking(
            String bookingId
    );



    /*
     * Customer cancels booking
     */
    PropertyBookingResponse cancelBooking(
            String bookingId
    );



    /*
     * Complete booking
     */
    PropertyBookingResponse completeBooking(
            String bookingId
    );



    /*
     * Admin - get all bookings
     */
    List<PropertyBookingResponse> getAllBookings();

}
package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertyBookingRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyBookingResponse;
import com.realestatepro.service.PropertyBookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/property-bookings")
@RequiredArgsConstructor
public class PropertyBookingController {

    private final PropertyBookingService propertyBookingService;

    /*
     * Customer creates booking
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyBookingResponse>> createBooking(
            @Valid @RequestBody PropertyBookingRequest request) {

        PropertyBookingResponse response =
                propertyBookingService.createBooking(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<PropertyBookingResponse>builder()
                                .success(true)
                                .message("Property booking created successfully")
                                .data(response)
                                .build()
                );
    }

    /*
     * Booking Details
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','CUSTOMER')")
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<PropertyBookingResponse>> getBookingById(
            @PathVariable String bookingId) {

        PropertyBookingResponse response =
                propertyBookingService.getBookingById(bookingId);

        return ResponseEntity.ok(
                ApiResponse.<PropertyBookingResponse>builder()
                        .success(true)
                        .message("Booking fetched successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Customer Bookings
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<PropertyBookingResponse>>> getCustomerBookings(
            @PathVariable String customerId) {

        List<PropertyBookingResponse> response =
                propertyBookingService.getCustomerBookings(customerId);

        return ResponseEntity.ok(
                ApiResponse.<List<PropertyBookingResponse>>builder()
                        .success(true)
                        .message("Customer bookings fetched successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Owner Bookings
     */
    @PreAuthorize("hasAnyRole('OWNER','SUPER_ADMIN','ADMIN')")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<List<PropertyBookingResponse>>> getOwnerBookings(
            @PathVariable String ownerId) {

        List<PropertyBookingResponse> response =
                propertyBookingService.getOwnerBookings(ownerId);

        return ResponseEntity.ok(
                ApiResponse.<List<PropertyBookingResponse>>builder()
                        .success(true)
                        .message("Owner bookings fetched successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Property Bookings
     */
    @PreAuthorize("hasAnyRole('OWNER','SUPER_ADMIN','ADMIN')")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<List<PropertyBookingResponse>>> getPropertyBookings(
            @PathVariable String propertyId) {

        List<PropertyBookingResponse> response =
                propertyBookingService.getPropertyBookings(propertyId);

        return ResponseEntity.ok(
                ApiResponse.<List<PropertyBookingResponse>>builder()
                        .success(true)
                        .message("Property bookings fetched successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Accept Booking
     */
    @PreAuthorize("hasAnyRole('OWNER','SUPER_ADMIN','ADMIN')")
    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<ApiResponse<PropertyBookingResponse>> acceptBooking(
            @PathVariable String bookingId) {

        PropertyBookingResponse response =
                propertyBookingService.acceptBooking(bookingId);

        return ResponseEntity.ok(
                ApiResponse.<PropertyBookingResponse>builder()
                        .success(true)
                        .message("Booking accepted successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Reject Booking
     */
    @PreAuthorize("hasAnyRole('OWNER','SUPER_ADMIN','ADMIN')")
    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<ApiResponse<PropertyBookingResponse>> rejectBooking(
            @PathVariable String bookingId) {

        PropertyBookingResponse response =
                propertyBookingService.rejectBooking(bookingId);

        return ResponseEntity.ok(
                ApiResponse.<PropertyBookingResponse>builder()
                        .success(true)
                        .message("Booking rejected successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Cancel Booking
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<PropertyBookingResponse>> cancelBooking(
            @PathVariable String bookingId) {

        PropertyBookingResponse response =
                propertyBookingService.cancelBooking(bookingId);

        return ResponseEntity.ok(
                ApiResponse.<PropertyBookingResponse>builder()
                        .success(true)
                        .message("Booking cancelled successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Complete Booking
     */
    @PreAuthorize("hasAnyRole('OWNER','SUPER_ADMIN','ADMIN')")
    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<ApiResponse<PropertyBookingResponse>> completeBooking(
            @PathVariable String bookingId) {

        PropertyBookingResponse response =
                propertyBookingService.completeBooking(bookingId);

        return ResponseEntity.ok(
                ApiResponse.<PropertyBookingResponse>builder()
                        .success(true)
                        .message("Booking completed successfully")
                        .data(response)
                        .build()
        );
    }

    /*
     * Admin - All Bookings
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PropertyBookingResponse>>> getAllBookings() {

        List<PropertyBookingResponse> response =
                propertyBookingService.getAllBookings();

        return ResponseEntity.ok(
                ApiResponse.<List<PropertyBookingResponse>>builder()
                        .success(true)
                        .message("All bookings fetched successfully")
                        .data(response)
                        .build()
        );
    }
}